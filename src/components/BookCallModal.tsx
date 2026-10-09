import React, { useState } from 'react';
import { X, Calendar, Clock, User, Building, Mail, CheckCircle2, Shield, PhoneCall, AlertCircle } from 'lucide-react';
import { DealbookDeal } from '../types';
import { api, DealbookApiError } from '../services/dealbookApi';
import { useTheme } from '../context/ThemeContext';

interface BookCallModalProps {
  deal?: DealbookDeal | null;
  allDeals?: DealbookDeal[];
  userEmail?: string;
  isOpen: boolean;
  onClose: () => void;
}

const TOPICS = [
  'General Deal Overview & Mandate Briefing',
  'Deep-Dive Diligence & Data Room Access',
  'Commercial Terms & Allocation Request',
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
  const { isLight } = useTheme();
  const [selectedDealRef, setSelectedDealRef] = useState<string>(deal?.ref || '');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(userEmail || '');
  const [institution, setInstitution] = useState('');
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState(TIME_SLOTS[1]);
  const [topic, setTopic] = useState(TOPICS[0]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentDeal = deal || allDeals.find((d) => d.ref === selectedDealRef);
  const targetRef = currentDeal?.ref || selectedDealRef;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!targetRef) {
      setErrorMessage('Please select a deal reference for the call booking.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.bookCall(targetRef, {
        preferredDate,
        preferredTime,
        topic,
        institution: institution.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      setSubmittedMessage(res.message || 'Call request received. A CRM task has been created for the deal owner.');
    } catch (err: unknown) {
      if (err instanceof DealbookApiError) {
        setErrorMessage(`Booking failed: ${err.code.replace(/_/g, ' ')}`);
      } else {
        setErrorMessage('Failed to schedule call. Please check your connection and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setSubmittedMessage(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div
      id="book-call-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md"
    >
      <div className="fixed inset-0" onClick={resetAndClose} />

      <div
        className={`relative w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden z-10 transition-all ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900 shadow-slate-900/10'
            : 'bg-[#141417] border-[rgba(201,162,77,0.3)] text-[#EDEDE9] shadow-black/80'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-[#18181C] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[rgba(201,162,77,0.12)] border border-[rgba(201,162,77,0.3)] flex items-center justify-center text-[#C9A24D]">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif tracking-tight text-[#EDEDE9]">
                Schedule Briefing Call
              </h2>
              <p className="text-xs text-stone-400">
                {currentDeal ? `${currentDeal.ref} — ${currentDeal.title}` : 'Quatromine Deal Desk'}
              </p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedMessage ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg text-emerald-400">Briefing Request Received</h3>
            <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
              {submittedMessage}
            </p>
            <div className="pt-4">
              <button
                onClick={resetAndClose}
                className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#C9A24D] hover:bg-[#d4b05e] text-black transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {!deal && allDeals.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1.5">
                  Opportunity Reference *
                </label>
                <select
                  value={selectedDealRef}
                  onChange={(e) => setSelectedDealRef(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C9A24D] ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#18181C] border-white/10 text-white'
                  }`}
                  required
                >
                  <option value="">Select Opportunity...</option>
                  {allDeals.map((d) => (
                    <option key={d.ref} value={d.ref}>
                      {d.ref} - {d.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1.5">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C9A24D] ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#18181C] border-white/10 text-white'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1.5">
                  Time Slot *
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C9A24D] ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#18181C] border-white/10 text-white'
                  }`}
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jean Dupont"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C9A24D] ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#18181C] border-white/10 text-white'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1.5">
                  Firm / Institution
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. Alpine Capital Partners"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C9A24D] ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#18181C] border-white/10 text-white'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1.5">
                Briefing Topic
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C9A24D] ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#18181C] border-white/10 text-white'
                }`}
              >
                {TOPICS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1.5">
                Questions or Specific Mandate Scope (Optional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Indicate specific questions, target allocation size, or focus points for the call..."
                className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C9A24D] resize-none ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#18181C] border-white/10 text-white'
                }`}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={resetAndClose}
                className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl text-xs font-medium bg-[#C9A24D] hover:bg-[#d4b05e] text-black transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
              >
                {submitting ? 'Creating CRM Task...' : 'Confirm Call Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
