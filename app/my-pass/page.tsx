'use client';

import React, { useState } from 'react';
import {
  Search,
  Download,
  AlertCircle,
  Loader2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Ticket
} from 'lucide-react';

export default function MyPassPage() {
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passData, setPassData] = useState<any | null>(null);

  const handleRequestOtp = async () => {
    if (!identifier.trim()) {
      setError('Please enter your registered email address or mobile number');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const isEmail = identifier.includes('@');
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId: 'LOOKUP-' + Date.now(),
          purpose: isEmail ? 'email' : 'mobile',
          recipient: identifier.trim(),
          firstName: 'Attendee',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send verification code');
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRetrievePass = async () => {
    if (!otp.trim()) {
      setError('Please enter the 6-digit OTP');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // In production: verifies the lookup and fetches the registration record
      // Query admin/registrations or dedicated lookup endpoint
      const res = await fetch(`/api/admin/registrations?query=${encodeURIComponent(identifier.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.registrations || data.registrations.length === 0) {
        throw new Error('No confirmed pass found for the provided details.');
      }
      setPassData(data.registrations[0]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090511] text-white py-16 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#1F1235] border border-purple-500/40 flex items-center justify-center text-amber-400 mx-auto">
            <Ticket className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Retrieve Your Entry Pass</h1>
          <p className="text-xs sm:text-sm text-[#A89DB5]">
            Access and download your digital entry badge using your registered email or phone number.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 flex items-center gap-3 text-red-200 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {!passData ? (
          <div className="rounded-3xl bg-[#100B18] border border-[#4C2A66]/60 p-6 sm:p-8 space-y-5 shadow-2xl">
            <div>
              <label className="block text-xs font-mono text-[#C4B5DA] mb-1.5">
                Registered Email or Mobile Number
              </label>
              <input
                type="text"
                placeholder="name@example.com or +919876543210"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={otpSent}
                className="w-full bg-[#1A0E2A]/70 border border-[#4C2A66]/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-400 disabled:opacity-60"
              />
            </div>

            {!otpSent ? (
              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#6B21A8] hover:bg-[#7E22CE] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-purple-400/40 shadow-lg disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Verification Code'}
              </button>
            ) : (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-mono text-[#C4B5DA] mb-1.5">
                    Enter 6-digit Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-[#10071C] border border-[#4C2A66]/60 rounded-xl px-4 py-2 text-center font-mono tracking-widest text-amber-300 text-lg focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleRetrievePass}
                  disabled={loading || otp.length !== 6}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Access Entry Pass'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-3xl bg-[#100B18] border border-[#4C2A66] p-6 sm:p-8 space-y-6 shadow-2xl text-center">
            <div className="p-3 bg-white inline-block rounded-xl mx-auto shadow-md border-2 border-amber-400/50">
              {passData.qrImageBase64 ? (
                <img
                  src={passData.qrImageBase64}
                  alt="QR Code"
                  width={160}
                  height={160}
                  className="rounded-lg"
                />
              ) : null}
            </div>

            <div className="text-left space-y-2 border-t border-[#4C2A66]/40 pt-4 text-xs sm:text-sm">
              <p className="text-amber-400 font-mono font-bold text-lg">{passData.registrationId}</p>
              <p className="font-bold text-white text-base">{passData.firstName} {passData.lastName}</p>
              <p className="text-[#A89DB5]">{passData.college}</p>
              <p className="text-[#A89DB5]">{passData.branch} • {passData.academicYear}</p>
            </div>

            <button
              onClick={() => window.open(`/api/pass/${passData.registrationId}`, '_blank')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Ticket</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

