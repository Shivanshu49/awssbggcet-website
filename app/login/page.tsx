'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Lock,
  Mail,
  ArrowLeft,
  KeyRound,
  ExternalLink
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, loginWithEmail, loginWithProvider, logout } = useAuth();

  const [step, setStep] = useState<'email' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showTroubleModal, setShowTroubleModal] = useState(false);

  // Step 1: Submit email
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStep('password');
  };

  // Step 2: Submit password & login
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!password) {
      setErrorMessage('Please enter your password or passkey.');
      return;
    }

    setIsSubmitting(true);
    try {
      await loginWithEmail(email);
      router.push('/');
    } catch {
      setErrorMessage('Sign-in failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Social / SSO Provider Login
  const handleSocialLogin = async (provider: 'google' | 'apple' | 'github' | 'amazon') => {
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await loginWithProvider(provider);
      router.push('/');
    } catch {
      setErrorMessage(`Failed to authenticate with ${provider}.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Instant Demo Student Login
  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    await loginWithEmail('student.builder@gcet.edu.in', 'Ambuj Rai');
    router.push('/');
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 sm:px-6 py-12 relative overflow-hidden">
      {/* Background Cosmic Auroras (Theme Compliant) */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#090511] via-[#0E081C] to-[#090511] pointer-events-none z-0" />
      <div className="fixed top-1/4 -left-36 w-96 h-96 bg-[#A855F7]/[0.08] rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-1/4 -right-36 w-96 h-96 bg-[#FBBF24]/[0.07] rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        
        {/* Top Header Badge */}
        <div className="flex flex-col items-center mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-[#160E25] border border-[#A855F7]/40 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-transform group-hover:scale-105">
              <Image
                src="/logo/sbg-logo.png"
                alt="AWS Student Builder Group Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="text-left">
              <span className="text-sm font-bold text-white tracking-tight block group-hover:text-[#FBBF24] transition-colors">
                AWS Builder Center GCET
              </span>
              <span className="text-[10px] font-mono text-[#C084FC]">
                AWS Student Builder Group
              </span>
            </div>
          </Link>
        </div>

        {/* ============================================================== */}
        {/* CASE 1: ALREADY LOGGED IN CARD                                */}
        {/* ============================================================== */}
        {user ? (
          <div className="rounded-3xl border border-[#4C2A66]/80 bg-gradient-to-b from-[#180E29]/95 via-[#120B20]/95 to-[#090511]/98 p-7 sm:p-8 backdrop-blur-3xl shadow-[0_16px_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.15)] ring-1 ring-inset ring-white/[0.05] text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-[#7E22CE] via-[#A855F7] to-[#FBBF24] flex items-center justify-center text-xl font-bold font-mono text-white shadow-lg">
              {user.initials}
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Signed In</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
            <p className="text-xs font-mono text-[#9E92B0] mb-3">{user.email}</p>
            <div className="inline-block px-3 py-1 rounded-lg bg-[#150D24] border border-[#4C2A66]/60 text-xs font-mono text-[#FDE68A] mb-6">
              AWS Builder ID: <span className="font-bold text-[#FBBF24]">{user.builderId}</span>
            </div>

            <div className="space-y-3">
              <Link
                href="/"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#FBBF24] text-[#090511] font-heading font-extrabold text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6)] cursor-pointer"
              >
                <span>Continue to Home</span>
                <ArrowRight className="w-4 h-4 text-[#090511]" />
              </Link>
              <button
                type="button"
                onClick={logout}
                className="w-full py-2.5 rounded-full bg-[#150D24] hover:bg-[#201335] border border-[#4C2A66]/50 text-xs font-mono text-[#F87171] hover:text-red-300 transition-colors cursor-pointer"
              >
                Sign out of this Builder ID
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* CASE 2: GET STARTED LOGIN CARD (Matches Screenshot 1)          */
          /* ============================================================== */
          <div className="rounded-3xl border border-[#4C2A66]/80 bg-gradient-to-b from-[#180E29]/95 via-[#120B20]/95 to-[#090511]/98 backdrop-blur-3xl shadow-[0_16px_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.15)] ring-1 ring-inset ring-white/[0.05] overflow-hidden">
            {/* Apple Specular Top Rim */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

            <div className="p-7 sm:p-8">
              {/* Card Title (Exact Copy of "Get started") */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    Get started
                  </h1>
                  <p className="text-xs text-[#9E92B0] mt-1">
                    Sign in with your AWS Builder ID
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#150D24] border border-[#4C2A66]/60 flex items-center justify-center text-[#FBBF24] shadow-inner">
                  <Lock className="w-4 h-4" />
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Step 1: Email Form (Matches Screenshot 1) */}
              {step === 'email' ? (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="builder-email"
                      className="block text-xs font-semibold text-white mb-2"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <input
                        id="builder-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="username@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#0F0A18] border border-[#4C2A66]/80 text-white placeholder-[#786D87] text-sm focus:outline-none focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24] shadow-inner transition-colors font-mono"
                      />
                    </div>
                  </div>

                  {/* Primary CTA (Signature Golden Amber "Continue") */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#FBBF24] bg-[length:200%_auto] hover:bg-right text-[#090511] font-heading font-extrabold text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(251,191,36,0.45),inset_0_1px_1px_rgba(255,255,255,0.6)] hover:shadow-[0_0_35px_rgba(251,191,36,0.65)] hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Verifying...' : 'Continue'}
                  </button>
                </form>
              ) : (
                /* Step 2: Password / Passkey Authentication */
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#4C2A66]/40">
                    <div className="truncate">
                      <span className="text-[10px] font-mono uppercase text-[#9E92B0] block">Signing in as</span>
                      <span className="text-xs font-mono font-semibold text-[#FBBF24] truncate block">{email}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep('email')}
                      className="text-xs text-[#C084FC] hover:text-white flex items-center gap-1 cursor-pointer font-mono"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Change</span>
                    </button>
                  </div>

                  <div>
                    <label
                      htmlFor="builder-password"
                      className="block text-xs font-semibold text-white mb-2"
                    >
                      Password or Student Passkey
                    </label>
                    <input
                      id="builder-password"
                      type="password"
                      autoFocus
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-3 rounded-xl bg-[#0F0A18] border border-[#4C2A66]/80 text-white placeholder-[#786D87] text-sm focus:outline-none focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24] shadow-inner transition-colors font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#FBBF24] bg-[length:200%_auto] hover:bg-right text-[#090511] font-heading font-extrabold text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(251,191,36,0.45),inset_0_1px_1px_rgba(255,255,255,0.6)] hover:shadow-[0_0_35px_rgba(251,191,36,0.65)] hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Authenticating...' : 'Sign In to AWS Builder ID'}
                  </button>
                </form>
              )}

              {/* Divider: ─── OR ─── (Exact Matches Screenshot 1) */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#4C2A66]/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase font-mono">
                  <span className="bg-[#120B20] px-3 text-[#9E92B0]">OR</span>
                </div>
              </div>

              {/* Social / SSO Federation Sign-In Options (Exact Matches Screenshot 1) */}
              <div className="space-y-2.5">
                {/* 1. Google */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-[#140D22] hover:bg-[#1E1333] border border-[#4C2A66]/60 hover:border-[#A855F7]/60 text-white text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-[0.98] cursor-pointer group shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* 2. Apple */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin('apple')}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-[#140D22] hover:bg-[#1E1333] border border-[#4C2A66]/60 hover:border-[#A855F7]/60 text-white text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-[0.98] cursor-pointer group shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.92-1 .04-2.18.66-2.88 1.48-.61.71-1.15 1.83-1.01 2.89 1.12.09 2.32-.68 2.95-1.45z" />
                  </svg>
                  <span>Continue with Apple</span>
                </button>

                {/* 3. GitHub */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin('github')}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-[#140D22] hover:bg-[#1E1333] border border-[#4C2A66]/60 hover:border-[#A855F7]/60 text-white text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-[0.98] cursor-pointer group shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>Continue with GitHub</span>
                </button>

                {/* 4. Amazon */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin('amazon')}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-[#140D22] hover:bg-[#1E1333] border border-[#4C2A66]/60 hover:border-[#A855F7]/60 text-white text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-[0.98] cursor-pointer group shadow-sm"
                >
                  <span className="font-serif font-black text-amber-400 text-base leading-none">a</span>
                  <span>Continue with Amazon</span>
                </button>
              </div>

              {/* Legal & Terms Notice (Exact Copy from Screenshot 1) */}
              <p className="mt-6 text-[11px] text-[#9E92B0] leading-relaxed text-center">
                By clicking &quot;Continue&quot; or continuing with an alternative sign-in method, you agree to the{' '}
                <a
                  href="https://aws.amazon.com/agreement/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#60A5FA] hover:text-[#93C5FD] underline"
                >
                  AWS Customer Agreement
                </a>
                , and you acknowledge you have read the{' '}
                <a
                  href="https://aws.amazon.com/privacy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#60A5FA] hover:text-[#93C5FD] underline"
                >
                  AWS Privacy Notice
                </a>
                . By continuing, you will create an{' '}
                <span className="text-[#60A5FA] font-medium">AWS Builder ID</span>.
              </p>

              {/* Fast 1-Click Demo Shortcut for Reviewers */}
              <div className="mt-5 pt-4 border-t border-[#4C2A66]/30 text-center">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#180E29] hover:bg-[#251540] border border-[#FBBF24]/40 text-[#FDE68A] hover:text-[#FBBF24] text-[11px] font-mono transition-all cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
                  <span>Quick Demo: Sign in as Student Builder</span>
                </button>
              </div>
            </div>

            {/* Bottom Footer Bar: Trouble Signing In? (Matches Screenshot 1) */}
            <div className="border-t border-[#4C2A66]/60 bg-[#0F091A] p-3 text-center">
              <button
                type="button"
                onClick={() => setShowTroubleModal(true)}
                className="text-xs font-mono font-medium text-[#60A5FA] hover:text-[#93C5FD] transition-colors cursor-pointer"
              >
                Trouble Signing In?
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* TROUBLE SIGNING IN HELPER MODAL / DRAWER                       */}
      {/* ============================================================== */}
      {showTroubleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl border border-[#4C2A66] bg-gradient-to-b from-[#180E29] via-[#120B20] to-[#090511] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#FBBF24]" />
              <span>Trouble Signing In?</span>
            </h3>
            <p className="text-xs text-[#CFC5DC] mb-4 leading-relaxed">
              Here are common solutions for GCET students and builders signing into their AWS Builder ID:
            </p>

            <div className="space-y-3 text-xs font-mono text-[#D8CEE6]">
              <div className="p-3 rounded-xl bg-[#150D24] border border-[#4C2A66]/50">
                <span className="text-[#FBBF24] font-semibold block mb-1">Using Galgotias College Email?</span>
                <p className="text-[11px] text-[#9E92B0]">
                  You can sign in using your official <code className="text-[#E9D5FF]">@galgotiacollege.edu</code> or personal email address. Both support AWS Builder ID creation.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#150D24] border border-[#4C2A66]/50">
                <span className="text-[#C084FC] font-semibold block mb-1">Forgot Credentials?</span>
                <p className="text-[11px] text-[#9E92B0]">
                  Use the social federation options (Google / GitHub / Apple / Amazon) for instantaneous password-free login.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#150D24] border border-[#4C2A66]/50">
                <span className="text-emerald-400 font-semibold block mb-1">Need Club Support?</span>
                <p className="text-[11px] text-[#9E92B0]">
                  Email the community team at <a href="mailto:awsbuildercenter.gcet@gmail.com" className="text-[#60A5FA] underline">awsbuildercenter.gcet@gmail.com</a>.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowTroubleModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-[#241738] hover:bg-[#301F4B] text-white text-xs font-mono font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
