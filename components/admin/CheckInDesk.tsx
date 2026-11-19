'use client';

import { AlertTriangle, Camera, CheckCircle2, Loader2, Volume2, VolumeX, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment, useCallback, useEffect, useRef, useState, useTransition, type ReactNode } from 'react';

import { PRIMARY_BUTTON, SECONDARY_BUTTON, SMALL_PRIMARY_BUTTON, SMALL_SECONDARY_BUTTON } from '@/components/registration/field-styles';
import { checkInAttendee, lookUpAttendee } from '@/lib/admin/actions';
import { isRepeatScan } from '@/lib/admin/rules';
import type { Registration } from '@/lib/db/schema';
import { formatDeadline } from '@/lib/registration/format';
import type { CheckInDetails, CheckInResult } from '@/lib/registration/seats';

type Result = CheckInResult | { kind: 'error' };
type Tone = keyof typeof TONES;
type Person = { kind: 'person'; scanned: string; details: CheckInDetails };
type Shown = Person | { kind: 'unknown' } | { kind: 'error'; message: string };

const attempt = (scanned: string): Promise<Result> => checkInAttendee(scanned).catch(() => ({ kind: 'error' }));

const CAMERA_FAILED = "The camera didn't start. Allow camera access, use your phone's camera app, or search below.";
const SCANNER_FAILED = "The scanner isn't working. Use your phone's camera app, or search below.";
const OFFLINE = "Check your connection and that you're signed in, then try again.";

const NOT_ADMITTED: Record<Registration['status'], string> = {
  pending: 'Payment not confirmed',
  payment_submitted: 'Payment not confirmed: still being checked',
  approved: 'Payment confirmed just now: scan again',
  waitlisted: 'On the waitlist, no seat',
  rejected: 'Registration not approved',
  cancelled: 'Registration cancelled',
};

const STATUS: Record<Registration['status'], string> = {
  pending: 'Not paid',
  payment_submitted: 'Payment being checked',
  approved: 'Paid, pass issued',
  waitlisted: 'Waitlisted',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
};

const TONES = {
  ok: { box: 'border-emerald-400 bg-emerald-500/20', title: 'text-emerald-300', Icon: CheckCircle2 },
  warn: { box: 'border-[#FBBF24] bg-[#FBBF24]/15', title: 'text-[#FBBF24]', Icon: AlertTriangle },
  bad: { box: 'border-red-500 bg-red-900/40', title: 'text-red-300', Icon: XCircle },
};

const toneOf = (shown: Shown): Tone => {
  if (shown.kind !== 'person') return 'bad';
  if (shown.details.checkedInAt) return 'warn';
  return shown.details.status === 'approved' ? 'ok' : 'bad';
};

// [frequency Hz, start s, length s]. Generated, so there are no audio files to load at the venue.
const BEEPS: Record<Tone, [number, number, number][]> = {
  ok: [[1320, 0, 0.12]],
  warn: [[880, 0, 0.08], [880, 0.15, 0.08]],
  bad: [[140, 0, 0.6]],
};
const VIBRATIONS: Record<Tone, number | number[]> = { ok: 80, warn: [70, 60, 70], bad: 500 };

let audio: AudioContext | null = null;

// iOS Safari only lets audio start inside a tap, so every desk button calls this first.
function unlockAudio() {
  try {
    audio ??= new AudioContext();
    if (audio.state !== 'running') void audio.resume();
    const silence = audio.createBufferSource();
    silence.buffer = audio.createBuffer(1, 1, 22050);
    silence.connect(audio.destination);
    silence.start();
  } catch {
    audio = null; // No Web Audio: the desk still works, silently.
  }
}

function feedback(tone: Tone, muted: boolean) {
  if ('vibrate' in navigator) navigator.vibrate(VIBRATIONS[tone]); // Android only: iOS has no vibration API.
  if (muted || !audio) return;
  const now = audio.currentTime;
  const peak = tone === 'bad' ? 0.25 : 0.4; // A square wave sounds louder at the same level.
  for (const [frequency, start, length] of BEEPS[tone]) {
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = tone === 'bad' ? 'square' : 'sine';
    oscillator.frequency.value = frequency;
    // Short ramps, or each beep starts and ends with a click.
    gain.gain.setValueAtTime(0.0001, now + start);
    gain.gain.exponentialRampToValueAtTime(peak, now + start + 0.01);
    gain.gain.setValueAtTime(peak, now + start + length - 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + start + length);
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start(now + start);
    oscillator.stop(now + start + length + 0.05);
  }
}

function Card({ tone, title, children }: { tone: Tone; title: string; children?: ReactNode }) {
  const { box, title: titleClass, Icon } = TONES[tone];
  return (
    <div role="status" className={`rounded-2xl border-2 p-5 ${box}`}>
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
          <p>{OFFLINE}</p>
        </Card>
      );
  }
}

// Everything the volunteer compares with the college ID. No email, and the phone is masked.
function ScanCard({ shown }: { shown: Shown }) {
  if (shown.kind === 'unknown') {
    return (
      <Card tone="bad" title="Unknown QR">
        <p>This isn&apos;t a pass for this event.</p>
      </Card>
    );
  }
  if (shown.kind === 'error') {
    return (
      <Card tone="bad" title={shown.message}>
        <p>{OFFLINE}</p>
      </Card>
    );
  }
  const { details } = shown;
  const tone = toneOf(shown);
  const title = details.checkedInAt
    ? `Already checked in at ${formatDeadline(details.checkedInAt)}`
    : tone === 'ok'
      ? 'Valid pass: check their college ID'
      : NOT_ADMITTED[details.status];
  const rows: [string, string, boolean?][] = [
    ['College', details.college],
    ['Branch', details.branch ?? '—'],
    ['Year', details.yearOfStudy],
    ['Ticket', details.ticketNo, true],
    ['Builder ID', details.builderId ?? '—', true],
    ['Phone', `••••••${details.phoneLast4}`, true],
    ['Status', STATUS[details.status]],
  ];
  return (
    <Card tone={tone} title={title}>
      <p className="text-3xl leading-tight font-black break-words text-white">{details.name}</p>
      <dl className="mt-4 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-base">
        {rows.map(([label, value, mono]) => (
          <Fragment key={label}>
            <dt className="text-[#CFC5DC]">{label}</dt>
            <dd className={`font-semibold break-words text-white ${mono ? 'font-mono' : ''}`}>{value}</dd>
          </Fragment>
        ))}
      </dl>
      {details.checkedInBy && <p className="mt-3 break-all text-xs text-[#CFC5DC]">By {details.checkedInBy}</p>}
      {tone === 'bad' && (
        <Link
          href={`/admin/scd?q=${encodeURIComponent(details.ticketNo)}`}
          className="mt-3 inline-block font-semibold text-[#FBBF24] underline-offset-2 hover:underline"
        >
          Open in registrations
        </Link>
      )}
    </Card>
  );
}

export function CheckInDesk({ initialCode }: { initialCode: string }) {
  const [shown, setShown] = useState<Shown | null>(null);
  const [checkedIn, setCheckedIn] = useState(''); // The last person checked in, shown while scanning.
  const [muted, setMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [starting, setStarting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const video = useRef<HTMLVideoElement>(null);
  const detector = useRef<InstanceType<typeof import('barcode-detector/ponyfill').BarcodeDetector> | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const openedLink = useRef(false);
  const lastScan = useRef<{ code: string; at: number } | null>(null);

  const show = useCallback(
    (next: Shown) => {
      setShown(next);
      setCheckedIn('');
      feedback(toneOf(next), muted);
    },
    [muted],
  );

  // Read-only: nobody is checked in until the volunteer has seen the card and tapped Check in.
  const lookUp = useCallback(
    (scanned: string) => {
      startTransition(async () => {
        const details = await lookUpAttendee(scanned).catch(() => undefined);
        if (details === undefined) show({ kind: 'error', message: "Couldn't look up this pass" });
        else show(details ? { kind: 'person', scanned, details } : { kind: 'unknown' });
      });
    },
    [show],
  );

  // Opened from a phone's camera app. The code leaves the URL first, so a reload can't resubmit it.
  useEffect(() => {
    if (!initialCode || openedLink.current) return;
    openedLink.current = true;
    window.history.replaceState(null, '', '/admin/checkin');
    lookUp(initialCode);
  }, [initialCode, lookUp]);

  useEffect(() => () => stream.current?.getTracks().forEach((track) => track.stop()), []);

  // Pauses while a card is up. The camera stays on, so scanning resumes the moment it closes.
  useEffect(() => {
    if (!cameraOn || shown || isPending) return;
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
      if (found) {
        const now = Date.now();
        const repeat = isRepeatScan(lastScan.current, found, now);
        lastScan.current = { code: found, at: now };
        if (!repeat) {
          lookUp(found);
          return;
        }
      }
      timer = setTimeout(scan, 200);
    };
    scan();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [cameraOn, shown, isPending, lookUp]);

  // Back to scanning. The pass just handled is probably still in view, so it starts the 3 seconds again.
  const next = () => {
    unlockAudio();
    if (lastScan.current) lastScan.current.at = Date.now();
    setShown(null);
  };

  // The same one-UPDATE check-in as before, so two phones on one pass still get one success.
  const checkIn = (person: Person) => {
    unlockAudio();
    startTransition(async () => {
      const result = await attempt(person.scanned);
      if (result.kind === 'ok') {
        feedback('ok', muted);
        next();
        setCheckedIn(`${result.name} · ${result.ticketNo}`);
      } else if (result.kind === 'already') {
        show({ ...person, details: { ...person.details, checkedInAt: result.at, checkedInBy: result.by } });
      } else if (result.kind === 'not_admitted') {
        show({ ...person, details: { ...person.details, status: result.status } });
      } else {
        show(result.kind === 'unknown' ? { kind: 'unknown' } : { kind: 'error', message: "Couldn't check in" });
      }
    });
  };

  const startCamera = async () => {
    unlockAudio(); // Before any await, while the tap still counts.
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

  const canCheckIn = shown?.kind === 'person' && toneOf(shown) === 'ok';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            unlockAudio();
            setMuted(!muted);
          }}
          className={SMALL_SECONDARY_BUTTON}
        >
          {muted ? <VolumeX className="size-4" aria-hidden="true" /> : <Volume2 className="size-4" aria-hidden="true" />}
          {muted ? 'Unmute' : 'Mute'}
        </button>
      </div>

      {isPending && !shown && (
        <p role="status" className="flex items-center gap-2 text-sm text-[#CFC5DC]">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Checking…
        </p>
      )}
      {shown && (
        <>
          <ScanCard shown={shown} />
          {canCheckIn ? (
            <div className="grid grid-cols-[2fr_1fr] gap-3">
              <button type="button" disabled={isPending} onClick={() => checkIn(shown)} className={PRIMARY_BUTTON}>
                {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <CheckCircle2 className="size-4" aria-hidden="true" />}
                Check in
              </button>
              <button type="button" disabled={isPending} onClick={next} className={SECONDARY_BUTTON}>
                Next
              </button>
            </div>
          ) : (
            <button type="button" disabled={isPending} onClick={next} className={PRIMARY_BUTTON}>
              Next
            </button>
          )}
        </>
      )}
      {checkedIn && !shown && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-xl border-2 border-emerald-400 bg-emerald-500/20 px-4 py-3 font-semibold break-words text-emerald-100"
        >
          <CheckCircle2 className="size-5 shrink-0 text-emerald-300" aria-hidden="true" />
          Checked in: {checkedIn}
        </p>
      )}

      <div className={`overflow-hidden rounded-2xl bg-black ${cameraOn || starting ? 'aspect-square max-h-96 w-full' : 'hidden'}`}>
        <video ref={video} muted playsInline className="size-full object-cover" aria-label="Camera preview" />
      </div>

      {cameraError && (
        <p role="alert" className="rounded-xl border border-red-500/50 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {cameraError}
        </p>
      )}

      {!cameraOn && (
        <button type="button" disabled={starting} onClick={startCamera} className={shown ? SECONDARY_BUTTON : PRIMARY_BUTTON}>
          {starting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Camera className="size-4" aria-hidden="true" />}
          Start camera
        </button>
      )}
      {cameraOn && !shown && !isPending && <p className="text-center text-sm text-[#CFC5DC]">Point the camera at a QR pass.</p>}
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
