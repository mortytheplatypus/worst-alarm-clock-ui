"use client";

import { useState, useEffect } from "react";

interface MinuteSliderProps {
  readonly onConfirm?: (minute: number) => void;
  readonly confirmButtonText?: string;
}

// Fisher-Yates shuffle
function shuffleArray(array: number[]): number[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function MinuteSlider({ onConfirm, confirmButtonText = "Confirm Minute" }: MinuteSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(0);
  const [shuffledMinutes, setShuffledMinutes] = useState<number[]>([]);
  const [confirmedMinute, setConfirmedMinute] = useState<number | null>(null);

  useEffect(() => {
    const minutes = Array.from({ length: 60 }, (_, i) => i);
    setShuffledMinutes(shuffleArray(minutes));
  }, []);

  const currentMinute = shuffledMinutes[sliderPosition] ?? 0;

  const handleConfirm = () => {
    setConfirmedMinute(currentMinute);
    onConfirm?.(currentMinute);
  };

  const isLocked = confirmedMinute !== null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "clamp(12px, 2vw, 16px)", width: "100%", maxWidth: 500, boxSizing: "border-box" }}>
      {/* Label */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 4px"
      }}>
        <span style={{
          fontSize: "clamp(14px, 2.5vw, 18px)",
          fontWeight: 600,
          color: "#06b6d4",
          textTransform: "uppercase",
          letterSpacing: "clamp(1px, 0.3vw, 2px)",
        }}>
          Step 2: Guess(??) the Minute
        </span>
      </div>

      {/* Main box */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "clamp(12px, 3vw, 20px)",
          padding: "clamp(16px, 3vw, 24px)",
          border: isLocked ? "3px solid #22c55e" : "3px solid #06b6d4",
          borderRadius: "clamp(12px, 2vw, 16px)",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          boxShadow: isLocked
            ? "0 0 30px rgba(34, 197, 94, 0.3), inset 0 0 60px rgba(34, 197, 94, 0.1)"
            : "0 0 30px rgba(6, 182, 212, 0.3), inset 0 0 60px rgba(6, 182, 212, 0.1)",
          transition: "all 0.3s ease",
        }}
      >
        {/* Display */}
        <div
          style={{
            fontSize: "clamp(48px, 12vw, 72px)",
            fontWeight: "bold",
            color: isLocked ? "#22c55e" : "#06b6d4",
            textAlign: "center",
            textShadow: isLocked
              ? "0 0 30px rgba(34, 197, 94, 0.6)"
              : "0 0 30px rgba(6, 182, 212, 0.6)",
            fontFamily: "monospace",
            transition: "all 0.15s ease",
          }}
        >
          {currentMinute.toString().padStart(2, "0")}
        </div>

        {/* Slider container */}
        <div style={{ position: "relative" }}>
          <input
            type="range"
            min={0}
            max={59}
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            disabled={isLocked}
            style={{
              width: "100%",
              height: "clamp(20px, 3vw, 24px)",
              cursor: isLocked ? "default" : "grab",
              accentColor: isLocked ? "#22c55e" : "#06b6d4",
              opacity: isLocked ? 0.5 : 1,
            }}
          />
        </div>

        {/* Locked indicator */}
        {isLocked && (
          <div style={{
            textAlign: "center",
            padding: "clamp(6px, 1vw, 8px) clamp(12px, 2vw, 16px)",
            background: "rgba(34, 197, 94, 0.2)",
            borderRadius: 8,
            fontSize: "clamp(12px, 2vw, 14px)",
            fontWeight: 600,
            color: "#22c55e",
          }}>
            Minute Locked: {confirmedMinute}
          </div>
        )}
      </div>

      {/* Confirm button */}
      <button
        onClick={handleConfirm}
        disabled={isLocked}
        className={isLocked ? "minute-btn-disabled" : "minute-btn"}
      >
        {isLocked ? `Minute Confirmed: ${confirmedMinute}` : confirmButtonText}
      </button>

      <style>{`
        .minute-btn {
          padding: clamp(10px, 2vw, 14px) clamp(20px, 4vw, 40px);
          font-size: clamp(14px, 2.5vw, 18px);
          font-weight: bold;
          color: #fff;
          background: linear-gradient(135deg, #0891b2, #0e7490);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px rgba(8, 145, 178, 0.4);
          width: 100%;
        }
        .minute-btn:hover {
          background: linear-gradient(135deg, #06b6d4, #0891b2);
          transform: translateY(-3px);
          box-shadow: 0 6px 25px rgba(6, 182, 212, 0.5);
        }
        .minute-btn:active {
          transform: translateY(-1px);
        }
        .minute-btn-disabled {
          padding: clamp(10px, 2vw, 14px) clamp(20px, 4vw, 40px);
          font-size: clamp(14px, 2.5vw, 18px);
          font-weight: bold;
          color: #fff;
          background: linear-gradient(135deg, #374151, #4b5563);
          border: none;
          border-radius: 12px;
          cursor: default;
          transition: all 0.2s ease;
          width: 100%;
        }
      `}</style>
    </div>
  );
}
