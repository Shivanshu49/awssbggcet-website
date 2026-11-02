'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  QrCode,
  Camera,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Building,
  User,
  Ticket
} from 'lucide-react';
import Link from 'next/link';

export default function AdminCheckInPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [verificationData, setVerificationData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [scannerStarted, setScannerStarted] = useState(false);
  const [manualToken, setManualToken] = useState('');
  const scannerRef = useRef<any>(null);

  const startScanner = async () => {
    try {
      // @ts-ignore
      const html5QrcodeModule = await import('html5-qrcode');
      const Html5QrcodeScanner = html5QrcodeModule.Html5QrcodeScanner;
      if (scannerRef.current) {
        scannerRef.current.clear();
      }

      const scanner = new Html5QrcodeScanner(
        'reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        false,
      );

      scanner.render(
        (decodedText: string) => {
          handleScanSuccess(decodedText);
        },
        (error: any) => {
          // Ignore frequent scan errors
        },
      );

      scannerRef.current = scanner;
      setScannerStarted(true);
    } catch (err) {
      console.error('Failed to initialize camera scanner:', err);
    }
  };

  const handleScanSuccess = async (rawUrlOrToken: string) => {
    // Extract token if raw text is full URL: https://site/verify/TOKEN
    let token = rawUrlOrToken;
    if (rawUrlOrToken.includes('/verify/')) {
      token = rawUrlOrToken.split('/verify/')[1];
    }

    setScanResult(token);
    setLoading(true);

    try {
      const res = await fetch(`/api/verify/${encodeURIComponent(token)}`);
      const data = await res.json();
      setVerificationData(data);

      // Auto check-in if valid and not already checked in
      if (data.valid && !data.alreadyCheckedIn) {
        await fetch(`/api/verify/${encodeURIComponent(token)}`, {
          method: 'POST',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetScan = () => {
    setScanResult(null);
    setVerificationData(null);
    setManualToken('');
  };

  return (
    <div className="min-h-screen bg-[#090511] text-white p-4 sm:p-8">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#4C2A66]/40">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">Event Entry Desk Scanner</h1>
            <p className="text-xs text-[#A89DB5]">Instant barcode/QR validation & check-in</p>
          </div>
          <Link
            href="/admin"
            className="text-xs font-mono text-amber-300 hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Camera Scanner Box */}
        <div className="rounded-3xl bg-[#100B18] border border-[#4C2A66]/60 p-6 space-y-4 shadow-xl">
          <div id="reader" className="w-full overflow-hidden rounded-2xl bg-black" />

          {!scannerStarted && (
            <button
              onClick={startScanner}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
            >
              <Camera className="w-4 h-4" />
              <span>Enable Device Camera Scanner</span>
            </button>
          )}

          {/* Manual Input Fallback */}
          <div className="pt-2 border-t border-[#4C2A66]/40 flex items-center gap-2">
            <input
              type="text"
              placeholder="Or paste QR Token / Verify URL manually..."
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              className="flex-1 bg-[#1A0E2A]/70 border border-[#4C2A66]/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
            <button
              onClick={() => handleScanSuccess(manualToken)}
              className="px-4 py-2 rounded-xl bg-[#6B21A8] hover:bg-[#7E22CE] text-white text-xs font-bold"
            >
              Verify
            </button>
          </div>
        </div>

        {/* Scan Status Display */}
        {verificationData && (
          <div className="rounded-3xl bg-[#100B18] border border-[#4C2A66] p-6 space-y-4 shadow-2xl text-center">
            {/* Condition 1: Invalid */}
            {!verificationData.valid && (
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-full bg-red-950/80 border border-red-500 flex items-center justify-center text-red-400 mx-auto">
                  <XCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-red-400">INVALID OR COUNTERFEIT QR</h3>
                <p className="text-xs text-[#A89DB5]">Not registered in system or tampered token signature.</p>
              </div>
            )}

            {/* Condition 2: Already Checked In */}
            {verificationData.valid && verificationData.alreadyCheckedIn && (
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-full bg-amber-950/80 border border-amber-500 flex items-center justify-center text-amber-400 mx-auto">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-amber-300">ALREADY CHECKED IN</h3>
                <p className="text-xs text-[#A89DB5]">
                  Attendee already marked present at {new Date(verificationData.checkedInAt).toLocaleTimeString()}
                </p>
                <div className="p-3 bg-[#1A0E2A] rounded-xl text-left text-xs space-y-1">
                  <p className="font-bold text-white">{verificationData.attendee.firstName} {verificationData.attendee.lastName}</p>
                  <p className="text-amber-300 font-mono">{verificationData.attendee.registrationId}</p>
                </div>
              </div>
            )}

            {/* Condition 3: Verified Green Status */}
            {verificationData.valid && !verificationData.alreadyCheckedIn && (
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-extrabold text-emerald-400 uppercase tracking-wider">
                  VERIFIED & CHECKED IN
                </h3>
                <div className="p-4 bg-[#1A0E2A] rounded-xl text-left text-xs space-y-1 border border-[#4C2A66]/60">
                  <p className="text-base font-bold text-white">
                    {verificationData.attendee.firstName} {verificationData.attendee.lastName}
                  </p>
                  <p className="text-amber-300 font-mono font-bold">{verificationData.attendee.registrationId}</p>
                  <p className="text-[#A89DB5]">{verificationData.attendee.college}</p>
                </div>
              </div>
            )}

            <button
              onClick={resetScan}
              className="w-full py-2.5 rounded-xl bg-[#211235] hover:bg-[#2C1847] text-white text-xs font-semibold flex items-center justify-center gap-2 border border-purple-500/40"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Scan Next Pass</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

