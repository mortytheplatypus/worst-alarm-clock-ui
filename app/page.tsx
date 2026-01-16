"use client";

import { useState } from "react";
import HourPicker from "@/app/components/HourPicker";
import MinuteSlider from "@/app/components/MinuteSlider";
import AMPMChooser from "@/app/components/AMPMChooser";
import AlarmDone from "@/app/components/AlarmDone";

type Step = "hour" | "minute" | "ampm" | "done";

export default function Home() {
  const [step, setStep] = useState<Step>("hour");
  const [confirmedHour, setConfirmedHour] = useState<number | null>(null);
  const [confirmedMinute, setConfirmedMinute] = useState<number | null>(null);
  const [confirmedAmPm, setConfirmedAmPm] = useState<"AM" | "PM" | null>(null);
  const [resetKey, setResetKey] = useState(0);

  const handleHourConfirm = (hour: number) => {
    setConfirmedHour(hour);
    setStep("minute");
  };

  const handleMinuteConfirm = (minute: number) => {
    setConfirmedMinute(minute);
    setStep("ampm");
  };

  const handleAmPmConfirm = (ampm: "AM" | "PM") => {
    setConfirmedAmPm(ampm);
    setStep("done");
  };

  const handleStartOver = () => {
    setConfirmedHour(null);
    setConfirmedMinute(null);
    setConfirmedAmPm(null);
    setStep("hour");
    setResetKey((prev) => prev + 1);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
        padding: "40px 20px",
      }}
    >
      <main
        style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontSize: 42,
              fontWeight: 800,
              background: "linear-gradient(135deg, #f97316, #eab308, #22c55e, #06b6d4, #a855f7)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              marginBottom: 8,
            }}
          >
            Worst Alarm Clock UI BCF 2026
          </h1>
          <p style={{ fontSize: 16, color: "#64748b" }}>
            ek ambulance bhej dena, bhayankar komedi hogaya idhar
          </p>
        </div>

        {/* Step Indicator */}
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {(() => {
            const allSteps = ["hour", "minute", "ampm", "done"];
            const currentStepIndex = allSteps.indexOf(step);
            const surpriseRevealed = currentStepIndex >= 2; // Show all 4 steps only when on ampm or done
            
            // Before surprise: show only hour, minute, done (as steps 1, 2, 3)
            // After surprise: show all 4 steps
            const visibleSteps = surpriseRevealed 
              ? allSteps 
              : ["hour", "minute", "done"];
            
            return visibleSteps.map((s, i) => {
              const actualIndex = allSteps.indexOf(s);
              const isCurrentStep = step === s;
              const isCompleted = currentStepIndex > actualIndex;
              const displayNumber = i + 1;
              const isLastStep = i === visibleSteps.length - 1;

              let bgColor = "rgba(255,255,255,0.1)";
              if (isCurrentStep) {
                bgColor = "linear-gradient(135deg, #a855f7, #7c3aed)";
              } else if (isCompleted) {
                bgColor = "#22c55e";
              }

              const textColor = isCurrentStep || isCompleted ? "#fff" : "#64748b";
              const lineColor = isCompleted ? "#22c55e" : "rgba(255,255,255,0.1)";

              return (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 600,
                      background: bgColor,
                      color: textColor,
                      boxShadow: isCurrentStep ? "0 0 20px rgba(168, 85, 247, 0.5)" : "none",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {isCompleted ? "✓" : displayNumber}
                  </div>
                  {!isLastStep && (
                    <div
                      style={{
                        width: 40,
                        height: 2,
                        background: lineColor,
                        transition: "all 0.3s ease",
                      }}
                    />
                  )}
                </div>
              );
            });
          })()}
        </div>

        {/* Step 1: Hour Picker */}
        {step === "hour" && (
          <HourPicker
            key={`hour-${resetKey}`}
            onConfirm={handleHourConfirm}
            confirmButtonText="Confirm kor(en) bhai, Minute tao ektu choose kora dorkar →"
          />
        )}

        {/* Step 2: Minute Slider */}
        {step === "minute" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <div
              style={{
                padding: "12px 24px",
                background: "rgba(34, 197, 94, 0.2)",
                border: "1px solid #22c55e",
                borderRadius: 12,
                color: "#22c55e",
                fontSize: 16,
              }}
            >
              Hour selected: <strong>{confirmedHour}</strong>
            </div>
            <MinuteSlider
              key={`minute-${resetKey}`}
              onConfirm={handleMinuteConfirm}
              confirmButtonText="Thik ache, eitai taile final →"
            />
          </div>
        )}

        {/* Step 3: AM/PM Coin Toss */}
        {step === "ampm" && confirmedHour !== null && confirmedMinute !== null && (
          <AMPMChooser
            key={`ampm-${resetKey}`}
            confirmedHour={confirmedHour}
            confirmedMinute={confirmedMinute}
            onConfirm={handleAmPmConfirm}
            confirmButtonText="Ho, eitai (🤔)"
          />
        )}

        {/* Step 4: Done */}
        {step === "done" && confirmedHour !== null && confirmedMinute !== null && confirmedAmPm !== null && (
          <AlarmDone
            confirmedHour={confirmedHour}
            confirmedMinute={confirmedMinute}
            confirmedAmPm={confirmedAmPm}
            onStartOver={handleStartOver}
          />
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>
            No actual alarm clocks were harmed •
            Developed by{" "}
            <a
              href="https://github.com/mortytheplatypus"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#a855f7",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              mortytheplatypus
            </a>
          </p>
        </div>
      </main>

    </div>
  );
}
