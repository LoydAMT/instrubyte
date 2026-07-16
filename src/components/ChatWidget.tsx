import React, { useEffect, useRef, useState } from 'react';
import { trackEvent } from '../utils/analytics';
import { CONTACT_ENDPOINT, WEB3FORMS_ACCESS_KEY } from './Contact';
import type { ChatImage, ChatLeadSummary, ChatMessage } from '../types';

const MAX_IMAGE_DIMENSION = 1024;
const IMAGE_JPEG_QUALITY = 0.82;
const MAX_UPLOAD_FILE_SIZE = 15 * 1024 * 1024; // pre-decode sanity check; output is downscaled well below this

async function downscaleImage(file: File): Promise<ChatImage> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Image processing is not supported in this browser.');
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const dataUrl = canvas.toDataURL('image/jpeg', IMAGE_JPEG_QUALITY);
  return { mediaType: 'image/jpeg', data: dataUrl.slice(dataUrl.indexOf(',') + 1) };
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
const CHAT_FUNCTION_URL = SUPABASE_URL ? `${SUPABASE_URL}/functions/v1/chat` : undefined;
const IS_CONFIGURED = Boolean(CHAT_FUNCTION_URL && SUPABASE_PUBLISHABLE_KEY);

function chatFunctionHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    apikey: SUPABASE_PUBLISHABLE_KEY ?? '',
    Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY ?? ''}`,
  };
}

const MAX_MESSAGES = 40;
const WELCOME_MESSAGE =
  "Hi! I can help figure out what sensor or equipment you need — describe it, or attach a photo of what you're replacing — and pass it to our team for a formal quotation. What are you looking for today?";
const NOT_CONFIGURED_MESSAGE = 'Chat is temporarily unavailable — please use the contact form below instead.';

type HandoffStatus = 'idle' | 'collecting-contact' | 'sending' | 'sent' | 'error';

interface ChatLeadWire {
  category?: string;
  specs?: string;
  contact_name?: string;
  contact_email?: string;
  contact_company?: string;
  urgency_note?: string;
}

function fromWireLead(raw: ChatLeadWire): ChatLeadSummary {
  return {
    category: raw.category,
    specs: raw.specs,
    contactName: raw.contact_name,
    contactEmail: raw.contact_email,
    contactCompany: raw.contact_company,
    urgencyNote: raw.urgency_note,
  };
}

function toWireLead(lead: ChatLeadSummary): ChatLeadWire {
  return {
    category: lead.category,
    specs: lead.specs,
    contact_name: lead.contactName,
    contact_email: lead.contactEmail,
    contact_company: lead.contactCompany,
    urgency_note: lead.urgencyNote,
  };
}

async function persistEscalation(lead: ChatLeadSummary, transcript: ChatMessage[]): Promise<void> {
  if (!CHAT_FUNCTION_URL) return;
  try {
    await fetch(CHAT_FUNCTION_URL, {
      method: 'POST',
      headers: chatFunctionHeaders(),
      body: JSON.stringify({ action: 'escalate', lead: toWireLead(lead), messages: transcript }),
    });
  } catch {
    // Best-effort record — the Web3Forms email below is the primary notification path.
  }
}

async function sendWeb3FormsHandoff(lead: ChatLeadSummary, transcript: ChatMessage[]): Promise<boolean> {
  try {
    const body = new FormData();
    body.append('access_key', WEB3FORMS_ACCESS_KEY);
    body.append('subject', `New chatbot inquiry from ${lead.contactName || 'website visitor'}`);
    body.append('from_name', 'InstruByte Chatbot');
    body.append('replyto', lead.contactEmail || '');
    body.append('name', lead.contactName || 'Not provided');
    body.append('email', lead.contactEmail || 'Not provided');
    body.append('company', lead.contactCompany || 'Not provided');
    body.append('service_needed', lead.category || 'Chatbot Inquiry');
    body.append(
      'message',
      [
        `Category: ${lead.category || 'Not specified'}`,
        `Details: ${lead.specs || 'Not specified'}`,
        lead.urgencyNote ? `Urgency: ${lead.urgencyNote}` : null,
        '',
        'Conversation:',
        ...transcript.map(
          (m) => `${m.role === 'user' ? 'Client' : 'Bot'}: ${m.content}${m.images?.length ? ' [photo attached]' : ''}`,
        ),
      ]
        .filter((line): line is string => Boolean(line))
        .join('\n'),
    );

    const response = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body,
    });
    return response.ok;
  } catch {
    return false;
  }
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lead, setLead] = useState<ChatLeadSummary | null>(null);
  const [leadAutoPersisted, setLeadAutoPersisted] = useState(false);
  const [showHandoffCard, setShowHandoffCard] = useState(false);
  const [handoffStatus, setHandoffStatus] = useState<HandoffStatus>('idle');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [pendingImage, setPendingImage] = useState<ChatImage | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, showHandoffCard, handoffStatus]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Please attach an image file.');
      return;
    }
    if (file.size > MAX_UPLOAD_FILE_SIZE) {
      setImageError('That image is too large — please use a smaller photo.');
      return;
    }

    try {
      setPendingImage(await downscaleImage(file));
      setImageError(null);
    } catch {
      setImageError("Couldn't process that image — please try a different photo.");
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if ((!trimmed && !pendingImage) || isLoading || messages.length >= MAX_MESSAGES) return;

    if (!IS_CONFIGURED || !CHAT_FUNCTION_URL) {
      setError(NOT_CONFIGURED_MESSAGE);
      return;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: trimmed,
      ...(pendingImage ? { images: [pendingImage] } : {}),
    };
    const nextMessages: ChatMessage[] = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setPendingImage(null);
    setImageError(null);
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(CHAT_FUNCTION_URL, {
        method: 'POST',
        headers: chatFunctionHeaders(),
        body: JSON.stringify({ action: 'chat', messages: nextMessages }),
      });

      if (!res.ok) {
        const errBody = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(errBody?.error || 'Something went wrong. Please try again.');
      }

      const data = (await res.json()) as { reply: string; leadReady: boolean; lead?: ChatLeadWire };
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);

      if (data.leadReady && data.lead) {
        setLead(fromWireLead(data.lead));
        setLeadAutoPersisted(true);
        setShowHandoffCard(true);
        setHandoffStatus('idle');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTalkToHuman = () => {
    if (!IS_CONFIGURED) {
      setError(NOT_CONFIGURED_MESSAGE);
      return;
    }
    setShowHandoffCard(true);
    setHandoffStatus(lead?.contactName && lead?.contactEmail ? 'idle' : 'collecting-contact');
  };

  const handleConfirmSend = async () => {
    const name = (lead?.contactName || contactName).trim();
    const email = (lead?.contactEmail || contactEmail).trim();
    if (!name || !email) {
      setHandoffStatus('collecting-contact');
      return;
    }

    const finalLead: ChatLeadSummary = { ...lead, contactName: name, contactEmail: email };
    setHandoffStatus('sending');

    if (!leadAutoPersisted) {
      await persistEscalation(finalLead, messages);
    }

    const emailed = await sendWeb3FormsHandoff(finalLead, messages);
    if (emailed) {
      trackEvent('generate_lead', { source: 'chatbot', service_needed: finalLead.category || 'Chatbot Inquiry' });
      setHandoffStatus('sent');
    } else {
      setHandoffStatus('error');
    }
  };

  const atMessageLimit = messages.length >= MAX_MESSAGES;

  return (
    <div className="chat-widget">
      {isOpen && (
        <div className="chat-panel" role="dialog" aria-label="InstruByte assistant chat">
          <div className="chat-panel-header">
            <div>
              <p className="chat-panel-title">InstruByte Assistant</p>
              <p className="chat-panel-subtitle">Procurement &amp; quotation inquiries</p>
            </div>
            <div className="chat-panel-header-actions">
              <button type="button" className="chat-talk-human" onClick={handleTalkToHuman}>
                Talk to a human
              </button>
              <button
                type="button"
                className="chat-panel-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          <div className="chat-messages">
            <div className="chat-message chat-message-assistant">
              <p>{IS_CONFIGURED ? WELCOME_MESSAGE : NOT_CONFIGURED_MESSAGE}</p>
            </div>

            {messages.map((m, i) => (
              <div key={i} className={`chat-message chat-message-${m.role}`}>
                {m.images?.map((img, j) => (
                  <img
                    key={j}
                    className="chat-message-image"
                    src={`data:${img.mediaType};base64,${img.data}`}
                    alt="Attached photo"
                  />
                ))}
                {m.content && <p>{m.content}</p>}
              </div>
            ))}

            {isLoading && (
              <div className="chat-message chat-message-assistant chat-message-loading" aria-label="Assistant is typing">
                <span className="chat-typing-dot" />
                <span className="chat-typing-dot" />
                <span className="chat-typing-dot" />
              </div>
            )}

            {error && (
              <p className="chat-error" role="alert">
                {error}
              </p>
            )}

            {showHandoffCard && handoffStatus !== 'sent' && (
              <div className="chat-handoff-card">
                <p className="chat-handoff-title">
                  {lead?.category
                    ? `Ready to send your ${lead.category} inquiry to our team?`
                    : "Let's connect you with our team."}
                </p>
                {lead?.specs && <p className="chat-handoff-specs">{lead.specs}</p>}

                {handoffStatus === 'collecting-contact' && (
                  <div className="chat-handoff-contact-fields">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      aria-label="Your name"
                    />
                    <input
                      type="email"
                      placeholder="Your email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      aria-label="Your email"
                    />
                  </div>
                )}

                <div className="chat-handoff-actions">
                  <button
                    type="button"
                    className="primary-button chat-handoff-send"
                    onClick={handleConfirmSend}
                    disabled={handoffStatus === 'sending'}
                  >
                    {handoffStatus === 'sending' ? 'Sending…' : 'Send to our team'}
                  </button>
                  <button
                    type="button"
                    className="chat-handoff-dismiss"
                    onClick={() => setShowHandoffCard(false)}
                    disabled={handoffStatus === 'sending'}
                  >
                    Keep chatting
                  </button>
                </div>

                {handoffStatus === 'error' && (
                  <p className="chat-handoff-error" role="alert">
                    Something went wrong — please try again, or use the contact form below.
                  </p>
                )}
              </div>
            )}

            {handoffStatus === 'sent' && (
              <p className="chat-handoff-success" role="status">
                Thanks! Your inquiry has been sent to our team — we&apos;ll follow up shortly.
              </p>
            )}

            <div ref={messagesEndRef} />
          </div>

          {imageError && (
            <p className="chat-error chat-image-error" role="alert">
              {imageError}
            </p>
          )}
          {pendingImage && (
            <div className="chat-pending-image">
              <img src={`data:${pendingImage.mediaType};base64,${pendingImage.data}`} alt="Attachment preview" />
              <span>Photo attached</span>
              <button type="button" onClick={() => setPendingImage(null)} aria-label="Remove attached photo">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          )}

          <form className="chat-input-row" onSubmit={sendMessage}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="chat-file-input"
              aria-hidden="true"
              tabIndex={-1}
            />
            <button
              type="button"
              className="chat-attach-button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || atMessageLimit || !IS_CONFIGURED}
              aria-label="Attach a photo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
              </svg>
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={atMessageLimit ? 'Please use the contact form below' : 'Type your message…'}
              disabled={isLoading || atMessageLimit || !IS_CONFIGURED}
              aria-label="Message"
            />
            <button
              type="submit"
              disabled={isLoading || atMessageLimit || (!input.trim() && !pendingImage) || !IS_CONFIGURED}
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
          {atMessageLimit && (
            <p className="chat-limit-note">
              This conversation has gotten long — please use the contact form below to continue.
            </p>
          )}
        </div>
      )}

      <button
        type="button"
        className={`chat-launcher${isOpen ? ' is-open' : ''}`}
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? 'Close chat' : 'Chat with us'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
