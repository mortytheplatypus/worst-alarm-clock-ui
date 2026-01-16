"use client";

import { useState, useEffect } from "react";

interface NumberPosition {
  number: number;
  x: number;
  y: number;
}

const BOX_WIDTH = 1000;
const BOX_HEIGHT = 480;
const NUMBER_SIZE = 72;        // approximate size of each number element
const MIN_DISTANCE = 120;      // minimum distance between number centers
const PADDING = 20;            // padding from box edges
const SHUFFLE_INTERVAL = 2000; // shuffle every 2 seconds

function generateRandomPositions(): NumberPosition[] {
  const positions: NumberPosition[] = [];
  const numbers = Array.from({ length: 12 }, (_, i) => i + 1);

  // Strict bounds: number buttons must be FULLY inside the box
  // Position is top-left corner, so button extends from (x,y) to (x+NUMBER_SIZE, y+NUMBER_SIZE)
  const minX = PADDING;
  const maxX = BOX_WIDTH - NUMBER_SIZE - PADDING;
  const minY = PADDING + 5; // Extra for countdown bar
  const maxY = BOX_HEIGHT - NUMBER_SIZE - PADDING;

  for (const num of numbers) {
    let attempts = 0;
    let placed = false;

    while (!placed && attempts < 200) {
      const x = minX + Math.random() * (maxX - minX);
      const y = minY + Math.random() * (maxY - minY);

      // Check for minimum distance with existing positions
      const tooClose = positions.some((pos) => {
        const dx = Math.abs(pos.x - x);
        const dy = Math.abs(pos.y - y);
        return dx < MIN_DISTANCE && dy < MIN_DISTANCE;
      });

      if (!tooClose) {
        positions.push({ number: num, x, y });
        placed = true;
      }
      attempts++;
    }

    // Fallback: clamp position to valid bounds
    if (!placed) {
      const x = Math.min(maxX, Math.max(minX, minX + Math.random() * (maxX - minX)));
      const y = Math.min(maxY, Math.max(minY, minY + Math.random() * (maxY - minY)));
      positions.push({ number: num, x, y });
    }
  }

  return positions;
}

interface HourPickerProps {
  readonly onConfirm?: (hour: number) => void;
  readonly confirmButtonText?: string;
}

export default function HourPicker({ onConfirm, confirmButtonText = "Confirm Hour" }: HourPickerProps) {
  const [positions, setPositions] = useState<NumberPosition[]>([]);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [confirmedHour, setConfirmedHour] = useState<number | null>(null);

  useEffect(() => {
    setPositions(generateRandomPositions());

    // Don't shuffle if hour is already confirmed
    if (confirmedHour !== null) return;

    const interval = setInterval(() => {
      setPositions(generateRandomPositions());
      setSelectedHour(null); // Clear selection on shuffle
    }, SHUFFLE_INTERVAL);

    return () => clearInterval(interval);
  }, [confirmedHour]);

  const handleSelect = (hour: number) => {
    setSelectedHour(hour);
  };

  const handleConfirm = () => {
    if (selectedHour !== null) {
      setConfirmedHour(selectedHour);
      onConfirm?.(selectedHour);
    }
  };

  const isLocked = confirmedHour !== null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Label */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 4px"
      }}>
        <span style={{
          fontSize: 18,
          fontWeight: 600,
          color: "#a855f7",
          textTransform: "uppercase",
          letterSpacing: 2,
        }}>
          Step 1: Hunt(!!) the Hour
        </span>
      </div>

      {/* Main box */}
      <div
        style={{
          position: "relative",
          width: BOX_WIDTH,
          height: BOX_HEIGHT,
          padding: PADDING,
          border: isLocked ? "3px solid #22c55e" : "3px solid #a855f7",
          borderRadius: 16,
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          overflow: "hidden",
          boxShadow: isLocked
            ? "0 0 30px rgba(34, 197, 94, 0.3), inset 0 0 60px rgba(34, 197, 94, 0.1)"
            : "0 0 30px rgba(168, 85, 247, 0.3), inset 0 0 60px rgba(168, 85, 247, 0.1)",
          transition: "all 0.3s ease",
        }}
      >
        {/* Countdown bar */}
        {!isLocked && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: 4,
              background: "linear-gradient(90deg, #f97316, #eab308, #22c55e)",
              animation: `shrink ${SHUFFLE_INTERVAL}ms linear infinite`,
              borderRadius: "0 2px 2px 0",
            }}
          />
        )}

        {positions.map((pos) => {
          const isSelected = selectedHour === pos.number;
          const isConfirmed = confirmedHour === pos.number;

          // Extract styles based on state
          let buttonColor = "#e2e8f0";
          let buttonBorder = "2px solid rgba(255,255,255,0.2)";
          let buttonBg = "rgba(255,255,255,0.05)";
          let buttonShadow = "0 4px 12px rgba(0,0,0,0.3)";

          if (isConfirmed) {
            buttonColor = "#000";
            buttonBorder = "4px solid #22c55e";
            buttonBg = "#22c55e";
            buttonShadow = "0 0 20px rgba(34, 197, 94, 0.6)";
          } else if (isSelected) {
            buttonColor = "#fff";
            buttonBorder = "3px solid #a855f7";
            buttonBg = "rgba(168, 85, 247, 0.8)";
            buttonShadow = "0 0 20px rgba(168, 85, 247, 0.6)";
          }

          const shouldScale = isSelected && !isConfirmed;
          const shouldFade = isLocked && !isConfirmed;

          return (
            <button
              key={pos.number}
              onClick={() => !isLocked && handleSelect(pos.number)}
              disabled={isLocked}
              style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                width: NUMBER_SIZE,
                height: NUMBER_SIZE,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                fontWeight: "bold",
                color: buttonColor,
                cursor: isLocked ? "default" : "pointer",
                userSelect: "none",
                borderRadius: "50%",
                border: buttonBorder,
                backgroundColor: buttonBg,
                boxShadow: buttonShadow,
                transition: "all 0.15s ease",
                transform: shouldScale ? "scale(1.1)" : "scale(1)",
                padding: 0,
                opacity: shouldFade ? 0.3 : 1,
              }}
            >
              {pos.number}
            </button>
          );
        })}

        {/* Locked overlay */}
        {isLocked && (
          <div style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            padding: "8px 16px",
            background: "rgba(34, 197, 94, 0.9)",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            color: "#000",
          }}>
            Hour Locked: {confirmedHour}
          </div>
        )}
      </div>

      {/* Confirm button */}
      <button
        onClick={handleConfirm}
        disabled={selectedHour === null || isLocked}
        className={selectedHour === null || isLocked ? "hour-btn-disabled" : "hour-btn"}
      >
        {isLocked ? `Hour Confirmed: ${confirmedHour}` : confirmButtonText}
      </button>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .hour-btn {
          padding: 14px 40px;
          font-size: 18px;
          font-weight: bold;
          color: #fff;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
        }
        .hour-btn:hover {
          background: linear-gradient(135deg, #a855f7, #7c3aed);
          transform: translateY(-3px);
          box-shadow: 0 6px 25px rgba(168, 85, 247, 0.5);
        }
        .hour-btn:active {
          transform: translateY(-1px);
        }
        .hour-btn-disabled {
          padding: 14px 40px;
          font-size: 18px;
          font-weight: bold;
          color: #fff;
          background: linear-gradient(135deg, #374151, #4b5563);
          border: none;
          border-radius: 12px;
          cursor: default;
          transition: all 0.2s ease;
        }
      `}</style>
    </div>
  );
}