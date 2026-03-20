import { useEffect, useMemo, useState } from "react";
import "./Maintenance.css";

const SIX_HOURS_IN_SECONDS = 6 * 60 * 60;

function formatTime(totalSeconds) {
  const safeSeconds = Math.max(totalSeconds, 0);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return {
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

export default function Maintenance() {
  const [timeLeft, setTimeLeft] = useState(SIX_HOURS_IN_SECONDS);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const { hours, minutes, seconds } = useMemo(() => formatTime(timeLeft), [timeLeft]);

  return (
    <div className="maintenance-page">
      <div className="maintenance-orb maintenance-orb-left" />
      <div className="maintenance-orb maintenance-orb-right maintenance-orb-delay" />

      <section className="maintenance-card">
        <p className="maintenance-badge">
          Website Update in Progress
          <span className="maintenance-dots">
            <span className="maintenance-dot" />
            <span className="maintenance-dot maintenance-dot-delay-1" />
            <span className="maintenance-dot maintenance-dot-delay-2" />
          </span>
        </p>

        <h1 className="maintenance-title">We are under maintenance</h1>
        <p className="maintenance-subtitle">
          Our website is currently being updated. We will be back soon.
        </p>

        <div className="timer-grid">
          <div className="timer-box">
            <p className="timer-value">{hours}</p>
            <p className="timer-label">Hours</p>
          </div>
          <div className="timer-box">
            <p className="timer-value">{minutes}</p>
            <p className="timer-label">Minutes</p>
          </div>
          <div className="timer-box">
            <p className="timer-value">{seconds}</p>
            <p className="timer-label">Seconds</p>
          </div>
        </div>

        <p className="maintenance-note">Reverse timer running from 06:00:00.</p>
        <p className="maintenance-note maintenance-note-secondary">Thank you for your patience.</p>
      </section>
    </div>
  );
}
