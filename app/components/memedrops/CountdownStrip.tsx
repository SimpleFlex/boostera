"use client";

import { useEffect, useState } from "react";

function getNextSunday9PMUTC(): Date {
  const now = new Date();
  const day = now.getUTCDay(); // 0 = Sunday
  const daysUntilSunday = day === 0 ? 7 : 7 - day;

  const next = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + daysUntilSunday,
      21,
      0,
      0,
      0
    )
  );

  // If today is Sunday but before 9PM UTC, use today
  if (day === 0 && now.getUTCHours() < 21) {
    next.setUTCDate(next.getUTCDate() - 7);
  }

  return next;
}

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function CountdownStrip() {
  const [target, setTarget] = useState<Date>(getNextSunday9PMUTC);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(getNextSunday9PMUTC()));

  useEffect(() => {
    const tick = () => {
      const tl = getTimeLeft(target);
      // Auto-reset when timer hits 0
      if (
        tl.days === 0 &&
        tl.hours === 0 &&
        tl.minutes === 0 &&
        tl.seconds === 0
      ) {
        const next = getNextSunday9PMUTC();
        setTarget(next);
        setTimeLeft(getTimeLeft(next));
      } else {
        setTimeLeft(tl);
      }
    };

    const t = setInterval(tick, 1000);
    tick();
    return () => clearInterval(t);
  }, [target]);

  const pad = (n: number) => String(n).padStart(2, "0");

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      {units.map((u, i) => (
        <div key={u.label} className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              <span className="text-2xl font-extrabold tabular-nums text-white">
                {pad(u.value)}
              </span>
            </div>
            <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/45">
              {u.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="mb-5 text-xl font-bold text-white/30">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
