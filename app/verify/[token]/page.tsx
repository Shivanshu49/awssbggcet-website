'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Building,
  User,
  Ticket,
  Calendar
} from 'lucide-react';

export default function VerifyQrPage() {
  const params = useParams();
  const token = params?.token as string;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any | null>(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkInDone, setCheckInDone] = useState(false);

  useEffect(() => {
    if (!token) return;

    fetch(`/api/verify/${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setData({ valid: false, reason: 'NETWORK_ERROR' });
        setLoading(false);
      });
  }, [token]);

  const handleConfirmCheckIn = async () => {
    setCheckingIn(true);
    try {
      const res = await fetch(`/api/verify/${encodeURIComponent(token)}`, {
        method: 'POST',
      });
      const resData = await res.json();
      if (resData.success) {
        setCheckInDone(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090511] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-amber-400 animate-spin mb-4" />
        <p className="text-xs font-mono text-[#A89DB5]">Verifying QR Authenticity...</p>
      </div>
    );
  }

  // 1. Invalid Token
  if (!data?.valid) {
    return (
      <div className="min-h-screen bg-[#090511] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#100B18] border border-red-500/50 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-red-950/80 border border-red-500 flex items-center justify-center text-red-400 mx-auto">
            <XCircle className="w-9 h-9" />
          </div>
          <h2 className="text-xl font-bold text-white">INVALID OR UNAUTHORIZED PASS</h2>
          <p className="text-xs text-[#A89DB5]">
            This QR code is either counterfeit, tampered with, or does not exist in our event registry.
          </p>
        </div>
      </div>
    );
  }

  // 2. Already Checked In
  if (data?.alreadyCheckedIn && !checkInDone) {
    return (
      <div className="min-h-screen bg-[#090511] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#100B18] border border-amber-500/50 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-amber-950/80 border border-amber-500 flex items-center justify-center text-amber-400 mx-auto">
            <AlertTriangle className="w-9 h-9" />
          </div>
          <h2 className="text-xl font-bold text-amber-300">ALREADY CHECKED IN</h2>
          <p className="text-xs text-[#A89DB5]">
            This attendee pass has already been admitted at the venue.
          </p>
          <div className="bg-[#1A0E2A] p-4 rounded-xl text-left text-xs space-y-2 border border-[#4C2A66]/60">
            <p className="text-white font-bold">{data.attendee.firstName} {data.attendee.lastName}</p>
            <p className="text-amber-400 font-mono">{data.attendee.registrationId}</p>
            <p className="text-[#A89DB5]">{data.attendee.college}</p>
          </div>
        </div>
      </div>
    );
  }

  // 3. Valid Pass — Verified Green Status
  return (
    <div className="min-h-screen bg-[#090511] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#100B18] border border-emerald-500/60 rounded-3xl p-8 text-center space-y-6 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
        <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto shadow-lg">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
            {checkInDone ? 'CHECK-IN COMPLETED' : 'VERIFIED ATTENDEE'}
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-1">
            {data.attendee.firstName} {data.attendee.lastName}
          </h2>
          <p className="text-xs font-mono text-amber-300 mt-0.5">{data.attendee.registrationId}</p>
        </div>

        <div className="bg-[#1A0E2A]/70 p-4 rounded-xl text-left text-xs space-y-2 border border-[#4C2A66]/60">
          <div className="flex items-center gap-2 text-[#C4B5DA]">
            <Building className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{data.attendee.college}</span>
          </div>
          <div className="flex items-center gap-2 text-[#C4B5DA]">
            <Ticket className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{data.attendee.eventTitle || data.attendee.eventSlug}</span>
          </div>
        </div>

        {!checkInDone ? (
          <button
            onClick={handleConfirmCheckIn}
            disabled={checkingIn}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition"
          >
            {checkingIn ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>Confirm & Check In</span>
            )}
          </button>
        ) : (
          <div className="py-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-mono text-xs">
            Checked in successfully just now.
          </div>
        )}
      </div>
    </div>
  );
}

