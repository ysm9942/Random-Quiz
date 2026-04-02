"use client";

import { useState, useRef, useEffect } from "react";

interface PinGateProps {
  storageKey: string;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

const CORRECT_PIN = "5350";

export default function PinGate({
  storageKey,
  title = "PIN 입력",
  description = "접속하려면 PIN 번호를 입력하세요.",
  children,
}: PinGateProps) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    setAuthenticated(stored === "true");
  }, [storageKey]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    setError(false);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 4 digits entered
    if (index === 3 && value) {
      const fullPin = newPin.join("");
      if (fullPin.length === 4) {
        if (fullPin === CORRECT_PIN) {
          localStorage.setItem(storageKey, "true");
          setAuthenticated(true);
        } else {
          setError(true);
          setShake(true);
          setTimeout(() => {
            setShake(false);
            setPin(["", "", "", ""]);
            inputRefs.current[0]?.focus();
          }, 500);
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (pasted.length === 4) {
      const newPin = pasted.split("");
      setPin(newPin);
      if (pasted === CORRECT_PIN) {
        localStorage.setItem(storageKey, "true");
        setAuthenticated(true);
      } else {
        setError(true);
        setShake(true);
        setTimeout(() => {
          setShake(false);
          setPin(["", "", "", ""]);
          inputRefs.current[0]?.focus();
        }, 500);
      }
    }
  };

  // Loading state (checking localStorage)
  if (authenticated === null) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 bg-background min-h-screen">
      <div className="w-full max-w-xs text-center space-y-8">
        {/* Lock Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
          <svg
            className="w-10 h-10 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted mt-2">{description}</p>
        </div>

        {/* PIN Input */}
        <div
          className={`flex justify-center gap-3 ${shake ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
          style={shake ? { animation: "shake 0.4s ease-in-out" } : {}}
        >
          {pin.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              className={`w-14 h-16 text-center text-2xl font-bold rounded-xl border-2 bg-card outline-none transition-all ${
                error
                  ? "border-danger text-danger"
                  : digit
                  ? "border-primary text-foreground"
                  : "border-border text-foreground focus:border-primary"
              }`}
              autoFocus={i === 0}
            />
          ))}
        </div>

        {error && (
          <p className="text-sm text-danger">PIN이 올바르지 않습니다.</p>
        )}

        <p className="text-xs text-muted/40">4자리 PIN을 입력하세요</p>
      </div>

      {/* Shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
