'use client';

import { AlertTriangle, Camera, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, useTransition, type ReactNode } from 'react';

import { PRIMARY_BUTTON, SECONDARY_BUTTON, SMALL_PRIMARY_BUTTON } from '@/components/registration/field-styles';
import { checkInAttendee } from '@/lib/admin/actions';
import type { Registration } from '@/lib/db/schema';
import { formatDeadline } from '@/lib/registration/format';
import type { CheckInResult } from '@/lib/registration/seats';

type Result = CheckInResult | { kind: 'error' };

const attempt = (scanned: string): Promise<Result> => checkInAttendee(scanned).catch(() => ({ kind: 'error' }));

const CAMERA_FAILED = "The camera didn't start. Allow camera access, use your phone's camera app, or search below.";
const SCANNER_FAILED = "The scanner isn't working. Use your phone's camera app, or search below.";

const NOT_ADMITTED: Record<Registration['status'], string> = {
  pending: 'Payment not confirmed',
  payment_submitted: 'Payment not confirmed: still being checked',
  approved: 'Payment confirmed just now: scan again',
  waitlisted: 'On the waitlist, no seat',
  rejected: 'Registration not approved',
  cancelled: 'Registration cancelled',
};

const TONES = {
  ok: { box: 'border-emerald-400/50 bg-emerald-400/10', title: 'text-emerald-300', Icon: CheckCircle2 },
  warn: { box: 'border-[#FBBF24]/50 bg-[#FBBF24]/10', title: 'text-[#FBBF24]', Icon: AlertTriangle },
  bad: { box: 'border-red-500/50 bg-red-950/40', title: 'text-red-300', Icon: XCircle },
};

function Card({ tone, title, children }: { tone: keyof typeof TONES; title: string; children?: ReactNode }) {
  const { box, title: titleClass, Icon } = TONES[tone];
  return (
    <div role="status" className={`rounded-2xl border p-5 ${box}`}>
      <p className={`flex items-center gap-2 text-lg font-bold ${titleClass}`}>
        <Icon className="size-6 shrink-0" aria-hidden="true" />
        {title}
      </p>
      {children && <div className="mt-2 text-sm leading-relaxed text-[#F8FAFC]">{children}</div>}
    </div>
  );
}

function Who({ name, college, ticketNo }: { name: string; college: string; ticketNo: string }) {
  return (
    <>
      <p className="text-base font-bold break-words">{name}</p>
      <p className="break-words text-[#CFC5DC]">{college}</p>
      <p className="font-mono text-xs text-[#E9D5FF]">{ticketNo}</p>
    </>
  );
}

function ResultCard({ result }: { result: Result }) {
  switch (result.kind) {
    case 'ok':
      return (
        <Card tone="ok" title="Checked in">
          <Who {...result} />
          <p className="mt-2 text-[#CFC5DC]">Compare the name with their college ID.</p>
        </Card>
      );
    case 'already':
      return (
        <Card tone="warn" title={`Already checked in at ${formatDeadline(result.at)}`}>
          <Who {...result} />
          {result.by && <p className="mt-2 break-all text-xs text-[#CFC5DC]">By {result.by}</p>}
        </Card>
      );
    case 'not_admitted':
      return (
        <Card tone="bad" title={NOT_ADMITTED[result.status]}>
          <Who {...result} />
          <Link
            href={`/admin/scd?q=${encodeURIComponent(result.ticketNo)}`}
            className="mt-2 inline-block font-semibold text-[#FBBF24] underline-offset-2 hover:underline"
          >
            Open in registrations
          </Link>
        </Card>
      );
    case 'unknown':
      return (
        <Card tone="bad" title="Unknown QR">
          <p>This isn&apos;t a pass for this event.</p>
        </Card>
      );
    case 'error':
      return (
        <Card tone="bad" title="Couldn't check in">
          <p>Check your connection and that you&apos;re signed in, then try again.</p>
        </Card>
      );
  }
}

export function CheckInDesk({ initialCode }: { initialCode: string }) {
  const [result, setResult] = useState<Result | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [starting, setStarting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const video = useRef<HTMLVideoElement>(null);
  const detector = useRef<InstanceType<typeof import('barcode-detector/ponyfill').BarcodeDetector> | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const openedLink = useRef(false);

  const submit = useCallback((scanned: string) => {
    startTransition(async () => setResult(await attempt(scanned)));
  }, []);

  // Opened from a phone's camera app. The code leaves the URL first, so a reload can't resubmit it.
  useEffect(() => {
    if (!initialCode || openedLink.current) return;
    openedLink.current = true;
    window.history.replaceState(null, '', '/admin/checkin');
    submit(initialCode);
  }, [initialCode, submit]);

  useEffect(() => () => stream.current?.getTracks().forEach((track) => track.stop()), []);

  // Stops at each result until "Scan next", or a QR still in frame would flip the result to "already".
  useEffect(() => {
    if (!cameraOn || result || isPending) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    const scan = async () => {
      let found = '';
      try {
        found = (await detector.current!.detect(video.current!))[0]?.rawValue ?? '';
        setCameraError('');
      } catch {
        setCameraError(SCANNER_FAILED); // Keeps trying, in case it's only the network catching up.
      }
      if (stopped) return;
      if (found) submit(found);
      else timer = setTimeout(scan, 200);
    };
    scan();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [cameraOn, result, isPending, submit]);

  const startCamera = async () => {
    setStarting(true);
    setCameraError('');
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      video.current!.srcObject = stream.current;
      await video.current!.play();
      const { BarcodeDetector, prepareZXingModule, ZXING_WASM_VERSION } = await import('barcode-detector/ponyfill');
      // Served from this site, so the venue's network only has to reach us.
      prepareZXingModule({
        overrides: {
          locateFile: (path: string, prefix: string) =>
            path.endsWith('.wasm') ? `/scd/zxing_reader-${ZXING_WASM_VERSION}.wasm` : prefix + path,
        },
      });
      detector.current = new BarcodeDetector({ formats: ['qr_code'] });
      setCameraOn(true);
    } catch {
      setCameraError(CAMERA_FAILED);
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className={`overflow-hidden rounded-2xl bg-black ${cameraOn || starting ? 'aspect-square max-h-96 w-full' : 'hidden'}`}>
        <video ref={video} muted playsInline className="size-full object-cover" aria-label="Camera preview" />
      </div>

      {isPending && (
        <p role="status" className="flex items-center gap-2 text-sm text-[#CFC5DC]">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Checking…
        </p>
      )}
      {result && !isPending && <ResultCard result={result} />}
      {cameraError && (
        <p role="alert" className="rounded-xl border border-red-500/50 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {cameraError}
        </p>
      )}

      {!cameraOn && (
        <button type="button" disabled={starting} onClick={startCamera} className={result ? SECONDARY_BUTTON : PRIMARY_BUTTON}>
          {starting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Camera className="size-4" aria-hidden="true" />}
          Start camera
        </button>
      )}
      {cameraOn && result && !isPending && (
        <button type="button" onClick={() => setResult(null)} className={PRIMARY_BUTTON}>
          Scan next
        </button>
      )}
      {cameraOn && !result && !isPending && <p className="text-center text-sm text-[#CFC5DC]">Point the camera at a QR pass.</p>}
    </div>
  );
}

export function CheckInButton({ code }: { code: string }) {
  const router = useRouter();
  const [result, setResult] = useState<Result | null>(null);
  const [isPending, startTransition] = useTransition();

  if (result) return <ResultCard result={result} />;
  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          setResult(await attempt(code));
          router.refresh();
        })
      }
      className={SMALL_PRIMARY_BUTTON}
    >
      {isPending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      Check in
    </button>
  );
}
