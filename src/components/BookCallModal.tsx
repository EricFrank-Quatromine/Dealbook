import React, { useState } from 'react';
import { X, Calendar, Clock, User, Building, Mail, CheckCircle2, Shield, PhoneCall } from 'lucide-react';
import { CallBookingRequest, Deal } from '../types';
import { dealService } from '../services/dealService';

interface BookCallModalProps {
  deal?: Deal | null;
  allDeals?: Deal[];
  userEmail?: string;
  isOpen: boolean;
  onClose: () => void;
}

const TOPICS = [
  'General Deal Overview & Briefing',
  'Deep-Dive Diligence & Data Room Access',
  'Commercial Terms, Ask & Allocation Request',
  'Technical Architecture & Regulatory Sign-Off',
  'Direct Founder / Executive Introduction',
];

const TIME_SLOTS = [
  '09:00 - 09:45 CET',
  '10:30 - 11:15 CET',
  '14:00 - 14:45 CET',
  '16:00 - 16:45 CET',
  '17:15 - 18:00 CET',
];

export const BookCallModal: React.FC<BookCallModalProps> = ({
  deal,
  allDeals = [],
  userEmail = '',
  isOpen,
  onClose,
}) => {
  const [selectedDealId, setSelectedDealId] = useState<string>(deal?.id || '');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(userEmail || '');
  const [institution, setInstitution] = useState('');
  const [preferredDate, setPreferredDate] = useState(() => {
    // Tomorrow as default date formatted YYYY-MM-DD
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState(TIME_SLOTS[1]);
  const [topic, setTopic] = useState(TOPICS[0]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentDeal = deal || allDeals.find((d) => d.id === selectedDealId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setSubmitting(true);
    const bookingRequest: CallBookingRequest = {
      dealId: currentDeal?.id,
      dealName: currentDeal?.name,
      name: name.trim(),
      email: email.trim(),
      institution: institution.trim(),
      preferredDate,
      preferredTime,
      topic,
      notes: notes.trim(),
    };

    try {
      const res = await dealService.bookCall(bookingRequest);
      setSubmittedMessage(res.message);
    } catch {
      setSubmittedMessage(
        `Call request registered for ${preferredDate} at ${preferredTime}. Quatromine team will follow up via email.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setSubmittedMessage(null);
    onClose();
  };

  return (
    <div
      id="book-call-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Crisp dark backdrop with zero blur */}
      <div
        className="fixed inset-0 bg-[#0B0B0C]/85 transition-opacity"
        onClick={resetAndClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-[#151518] border border-[rgba(255,255,255,0.12)] rounded-2xl shadow-2xl shadow-black/80 overflow-hidden z-10 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-[rgba(255,255,255,0.08)] flex items-start justify-between bg-[#19191D]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 text-[10px] tracking-widest uppercase font-semibold text-[#C9A24D] px-2.5 py-0.5 rounded-full bg-[rgba(201,162,77,0.12)] border border-[rgba(201,162,77,0.3)]">
                <PhoneCall className="w-3 h-3" />
                Briefing Request
              </span>
              <span className="text-xs text-[#5F5F65]">Direct Syndication Line</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl text-[#EDEDE9] font-normal">
              Book a Deal Briefing
            </h2>
            <p className="text-xs text-[#94949B] mt-1 font-light">
              Schedule a 45-minute confidential discussion with the Quatromine deal lead and investment committee.
            </p>
          </div>

          <button
            type="button"
            id="close-book-call-modal"
            onClick={resetAndClose}
            className="text-[#94949B] hover:text-[#EDEDE9] p-1.5 rounded-xl hover:bg-[#222227] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submittedMessage ? (
          /* Confirmation View */
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[rgba(201,162,77,0.14)] border border-[rgba(201,162,77,0.4)] flex items-center justify-center mx-auto text-[#C9A24D]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-[#EDEDE9]">
              Call Request Confirmed
            </h3>
            <p className="text-xs text-[#94949B] leading-relaxed max-w-md mx-auto">
              {submittedMessage}
            </p>

            {currentDeal?.responsiblePerson && (
              <div className="p-4 bg-[#111114] border border-[rgba(255,255,255,0.08)] rounded-xl text-left max-w-sm mx-auto mt-4">
                <span className="text-[10px] uppercase text-[#5F5F65] tracking-wider block mb-1">
                  Responsible Quatromine Lead
                </span>
                <p className="text-xs text-[#EDEDE9] font-medium">
                  {currentDeal.responsiblePerson.name}
                </p>
                <p className="text-[11px] text-[#C9A24D]">
                  {currentDeal.responsiblePerson.title}
                </p>
                <p className="text-[11px] text-[#94949B] mt-1 font-mono">
                  {currentDeal.responsiblePerson.email}
                </p>
              </div>
            )}

            <div className="pt-4">
              <button
                type="button"
                onClick={resetAndClose}
                className="px-6 py-2.5 text-xs font-medium bg-[#C9A24D] text-[#0B0B0C] rounded-xl hover:bg-[#d6b05e] transition-colors cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Deal Selection / Fixed Deal Notice */}
            {deal ? (
              <div className="p-3.5 bg-[#111114] border border-[rgba(201,162,77,0.3)] rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#C9A24D] uppercase tracking-wider block font-medium">
                    Opportunity Selected
                  </span>
                  <span className="font-serif text-sm text-[#EDEDE9] font-medium">
                    {deal.name}
                  </span>
                  <span className="text-[11px] text-[#94949B] block">
                    {deal.stage} &bull; {deal.ticket} &bull; {deal.sector}
                  </span>
                </div>
                {deal.responsiblePerson && (
                  <div className="text-right text-[11px] text-[#94949B] border-l border-[rgba(255,255,255,0.08)] pl-3">
                    <span className="text-[#5F5F65] text-[10px] block">Lead:</span>
                    <span className="text-[#EDEDE9]">{deal.responsiblePerson.name}</span>
                  </div>
                )}
              </div>
            ) : allDeals.length > 0 ? (
              <div>
                <label className="block text-[11px] font-medium text-[#94949B] uppercase tracking-wider mb-1.5">
                  Select Opportunity of Interest
                </label>
                <select
                  id="book-call-deal-select"
                  value={selectedDealId}
                  onChange={(e) => setSelectedDealId(e.target.value)}
                  className="w-full bg-[#111114] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2 text-xs text-[#EDEDE9] outline-none focus:border-[#C9A24D]/60 transition-colors"
                >
                  <option value="">General Pipeline / Multi-Deal Discussion</option>
                  {allDeals.map((d) => (
                    <option key={d.id} value={d.id} className="bg-[#1B1B1F]">
                      {d.name} ({d.stage} — {d.ticket})
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            {/* Discussion Topic */}
            <div>
              <label className="block text-[11px] font-medium text-[#94949B] uppercase tracking-wider mb-1.5">
                Primary Agenda / Topic
              </label>
              <select
                id="book-call-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-[#111114] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2 text-xs text-[#EDEDE9] outline-none focus:border-[#C9A24D]/60 transition-colors"
              >
                {TOPICS.map((t) => (
                  <option key={t} value={t} className="bg-[#1B1B1F]">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time Slot Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[#94949B] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-[#C9A24D]" />
                  Preferred Date
                </label>
                <input
                  type="date"
                  id="book-call-date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full bg-[#111114] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2 text-xs text-[#EDEDE9] outline-none focus:border-[#C9A24D]/60 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#94949B] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-[#C9A24D]" />
                  Time Window (CET)
                </label>
                <select
                  id="book-call-time"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full bg-[#111114] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2 text-xs text-[#EDEDE9] outline-none focus:border-[#C9A24D]/60 transition-colors"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot} className="bg-[#1B1B1F]">
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[#94949B] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <User className="w-3 h-3 text-[#94949B]" />
                  Your Full Name
                </label>
                <input
                  type="text"
                  id="book-call-name"
                  required
                  placeholder="e.g. Marc de Weck"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#111114] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2 text-xs text-[#EDEDE9] placeholder-[#5F5F65] outline-none focus:border-[#C9A24D]/60 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#94949B] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-[#94949B]" />
                  Work / Institutional Email
                </label>
                <input
                  type="email"
                  id="book-call-email"
                  required
                  placeholder="investor@familyoffice.ch"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111114] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2 text-xs text-[#EDEDE9] placeholder-[#5F5F65] outline-none focus:border-[#C9A24D]/60 transition-colors"
                />
              </div>
            </div>

            {/* Institution / Firm */}
            <div>
              <label className="block text-[11px] font-medium text-[#94949B] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Building className="w-3 h-3 text-[#94949B]" />
                Institution / Family Office (Optional)
              </label>
              <input
                type="text"
                id="book-call-institution"
                placeholder="e.g. Geneva Private Capital / Pictet Multi-Family"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full bg-[#111114] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2 text-xs text-[#EDEDE9] placeholder-[#5F5F65] outline-none focus:border-[#C9A24D]/60 transition-colors"
              />
            </div>

            {/* Custom Notes / Questions */}
            <div>
              <label className="block text-[11px] font-medium text-[#94949B] uppercase tracking-wider mb-1.5">
                Specific Inquiries or Questions
              </label>
              <textarea
                id="book-call-notes"
                rows={2}
                placeholder="Specific queries regarding allocation sizing, co-investors, or diligence timelines..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#111114] border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2 text-xs text-[#EDEDE9] placeholder-[#5F5F65] outline-none focus:border-[#C9A24D]/60 transition-colors resize-none"
              />
            </div>

            {/* Confidentiality disclaimer & Submit */}
            <div className="pt-2 border-t border-[rgba(255,255,255,0.07)] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-[#5F5F65]">
                <Shield className="w-3.5 h-3.5 text-[#C9A24D]" />
                <span>NDA &amp; Institutional Protocol protected</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-4 py-2 text-xs text-[#94949B] hover:text-[#EDEDE9] rounded-xl hover:bg-[#222227] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-confirm-book-call"
                  disabled={submitting}
                  className="flex-1 sm:flex-initial px-5 py-2.5 text-xs font-medium bg-[#C9A24D] text-[#0B0B0C] rounded-xl hover:bg-[#d6b05e] transition-colors cursor-pointer disabled:opacity-50 shadow-md shadow-[#C9A24D]/10"
                >
                  {submitting ? 'Confirming...' : 'Confirm Call Request'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
