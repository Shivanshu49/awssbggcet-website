'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Download,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Share2,
  Mail,
  MessageSquare
} from 'lucide-react';
import Image from 'next/image';

interface SuccessScreenProps {
  registrationId: string;
  qrDataUrl: string;
  verifyUrl: string;
  firstName: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venue: string;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  registrationId,
  qrDataUrl,
  verifyUrl,
  firstName,
  eventTitle,
  eventDate,
  eventTime,
  venue,
}) => {
  const downloadPdf = () => {
    window.open(`/api/pass/${registrationId}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto rounded-3xl bg-[#100B18] border border-[#4C2A66] p-6 sm:p-10 shadow-[0_10px_50px_rgba(0,0,0,0.6)] text-center space-y-8"
    >
      {/* Top Confirmed Icon */}
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-400 mb-4 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
          Registration Confirmed
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
          You're In, {firstName}! 🎉
        </h2>
        <p className="text-xs sm:text-sm text-[#A89DB5] mt-1 max-w-md">
          Your official digital entry pass for <strong className="text-white">{eventTitle}</strong> has been issued.
        </p>
      </div>

      {/* Conference Badge Card */}
      <div className="relative rounded-2xl bg-[#170E25] border-2 border-[#6B21A8]/60 p-6 sm:p-8 overflow-hidden text-left shadow-[0_4px_30px_rgba(107,33,168,0.25)]">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 blur-3xl -z-0 pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          {/* Details */}
          <div className="space-y-4 flex-1">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#A89DB5]">
                Registration Pass ID
              </span>
              <p className="text-xl sm:text-2xl font-mono font-bold text-amber-300">
                {registrationId}
              </p>
            </div>

            <div className="space-y-2 text-xs text-[#C4B5DA]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{eventDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{eventTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="line-clamp-2">{venue}</span>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="p-3 bg-white rounded-xl shadow-lg border-2 border-amber-400/40">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Entry QR Code"
                  width={140}
                  height={140}
                  className="rounded-lg"
                />
              ) : (
                <div className="w-[140px] h-[140px] bg-neutral-200 animate-pulse rounded-lg" />
              )}
            </div>
            <span className="text-[10px] font-mono text-[#A89DB5] mt-2 tracking-wider uppercase">
              Scan at Venue
            </span>
          </div>
        </div>
      </div>

      {/* Delivery notices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-left">
        <div className="p-3.5 rounded-xl bg-[#1A0E2A]/70 border border-[#4C2A66]/50 flex items-center gap-3">
          <Mail className="w-5 h-5 text-purple-400 shrink-0" />
          <span className="text-[#A89DB5]">
            Pass details sent to your registered <strong className="text-white">Email Address</strong>.
          </span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#1A0E2A]/70 border border-[#4C2A66]/50 flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-[#A89DB5]">
            Instant confirmation sent via <strong className="text-white">WhatsApp</strong>.
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <button
          onClick={downloadPdf}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(251,191,36,0.3)] transition"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF Entry Pass</span>
        </button>

        <a
          href={verifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#211235] hover:bg-[#2A1844] text-[#C4B5DA] hover:text-white font-semibold text-xs border border-purple-500/40 flex items-center justify-center gap-2 transition"
        >
          <span>Open Online Pass</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
};

