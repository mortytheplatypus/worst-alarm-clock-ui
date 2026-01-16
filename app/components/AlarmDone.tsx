"use client";

import { useState, useEffect, useRef } from "react";

const SOUNDTRACK_PATH = "/mp3/chi-re-noni-chi.mp3";

interface AlarmDoneProps {
    readonly confirmedHour: number;
    readonly confirmedMinute: number;
    readonly confirmedAmPm: "AM" | "PM";
    readonly onStartOver: () => void;
    readonly startOverButtonText?: string;
}

export default function AlarmDone({
    confirmedHour,
    confirmedMinute,
    confirmedAmPm,
    onStartOver,
    startOverButtonText = "Abar Kortam (PORTE BOSH(EN) BHAI!)"
}: AlarmDoneProps) {
    const [timeRemaining, setTimeRemaining] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
    const [isAlarmTriggered, setIsAlarmTriggered] = useState(false);
    const [audioBlocked, setAudioBlocked] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize audio on mount
    useEffect(() => {
        audioRef.current = new Audio(SOUNDTRACK_PATH);
        audioRef.current.loop = true;
        
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const formattedTime = `${confirmedHour.toString().padStart(2, "0")}:${confirmedMinute.toString().padStart(2, "0")} ${confirmedAmPm}`;

    // Calculate time remaining
    useEffect(() => {
        const calculateRemaining = () => {
            const now = new Date();

            // Convert 12-hour to 24-hour format
            let alarmHour24 = confirmedHour;
            if (confirmedAmPm === "AM") {
                if (confirmedHour === 12) alarmHour24 = 0;
            } else if (confirmedHour !== 12) {
                alarmHour24 = confirmedHour + 12;
            }

            // Create alarm time for today
            const alarmToday = new Date(now);
            alarmToday.setHours(alarmHour24, confirmedMinute, 0, 0);

            // Create alarm time for tomorrow
            const alarmTomorrow = new Date(alarmToday);
            alarmTomorrow.setDate(alarmTomorrow.getDate() + 1);

            // Calculate differences
            const diffToday = alarmToday.getTime() - now.getTime();
            const diffTomorrow = alarmTomorrow.getTime() - now.getTime();

            // Pick the nearest future time
            let diff: number;
            if (diffToday > 0) {
                // Alarm is later today
                diff = diffToday;
            } else {
                // Alarm already passed today, use tomorrow
                diff = diffTomorrow;
            }

            const totalSeconds = Math.floor(diff / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            setTimeRemaining({ hours, minutes, seconds });

            // Check if alarm should trigger (within 1 second of alarm time)
            if (totalSeconds <= 0 && !isAlarmTriggered) {
                setIsAlarmTriggered(true);
            }
        };

        calculateRemaining();
        const interval = setInterval(calculateRemaining, 1000);

        return () => clearInterval(interval);
    }, [confirmedHour, confirmedMinute, confirmedAmPm, isAlarmTriggered]);

    // Play alarm sound when triggered
    useEffect(() => {
        if (isAlarmTriggered && audioRef.current) {
            audioRef.current.play().catch(() => {
                // Browser blocked autoplay - need user interaction
                setAudioBlocked(true);
            });
        }
    }, [isAlarmTriggered]);

    // Handle enabling audio after user interaction
    const handleEnableAudio = () => {
        if (audioRef.current) {
            audioRef.current.play().then(() => {
                setAudioBlocked(false);
            }).catch(console.error);
        }
    };

    // Stop alarm and handle start over
    const handleStopAlarm = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsAlarmTriggered(false);
        onStartOver();
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 32,
                padding: 40,
                background: "linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.05))",
                border: "3px solid #22c55e",
                borderRadius: 24,
                boxShadow: "0 0 60px rgba(34, 197, 94, 0.3)",
            }}
        >
            <div style={{ textAlign: "center" }}>
                <p style={{
                    fontSize: 18,
                    color: "#22c55e",
                    textTransform: "uppercase",
                    letterSpacing: 3,
                    marginBottom: 16,
                }}>
                    Alarm Set For
                </p>
                <p
                    style={{
                        fontSize: 72,
                        fontWeight: 800,
                        fontFamily: "monospace",
                        color: "#22c55e",
                        textShadow: "0 0 60px rgba(34, 197, 94, 0.8)",
                        lineHeight: 1,
                    }}
                >
                    {formattedTime}
                </p>
            </div>

            {/* Time Remaining Display */}
            {timeRemaining && (
                <div
                    style={{
                        padding: "24px 40px",
                        background: "linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.1))",
                        border: "2px solid #06b6d4",
                        borderRadius: 16,
                        textAlign: "center",
                    }}
                >
                    <p style={{
                        fontSize: 14,
                        color: "#67e8f9",
                        textTransform: "uppercase",
                        letterSpacing: 2,
                        marginBottom: 12,
                    }}>
                        ⏰ Aar Baki Ache
                    </p>
                    <div style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "baseline" }}>
                        <div style={{ textAlign: "center" }}>
                            <span style={{
                                fontSize: 48,
                                fontWeight: 800,
                                fontFamily: "monospace",
                                color: "#22d3ee",
                                textShadow: "0 0 20px rgba(34, 211, 238, 0.5)",
                            }}>
                                {timeRemaining.hours.toString().padStart(2, "0")}
                            </span>
                            <p style={{ fontSize: 12, color: "#67e8f9", marginTop: 4 }}>HOURS</p>
                        </div>
                        <span style={{ fontSize: 48, color: "#22d3ee", fontWeight: 300 }}>:</span>
                        <div style={{ textAlign: "center" }}>
                            <span style={{
                                fontSize: 48,
                                fontWeight: 800,
                                fontFamily: "monospace",
                                color: "#22d3ee",
                                textShadow: "0 0 20px rgba(34, 211, 238, 0.5)",
                            }}>
                                {timeRemaining.minutes.toString().padStart(2, "0")}
                            </span>
                            <p style={{ fontSize: 12, color: "#67e8f9", marginTop: 4 }}>MINS</p>
                        </div>
                        <span style={{ fontSize: 48, color: "#22d3ee", fontWeight: 300 }}>:</span>
                        <div style={{ textAlign: "center" }}>
                            <span style={{
                                fontSize: 48,
                                fontWeight: 800,
                                fontFamily: "monospace",
                                color: "#22d3ee",
                                textShadow: "0 0 20px rgba(34, 211, 238, 0.5)",
                            }}>
                                {timeRemaining.seconds.toString().padStart(2, "0")}
                            </span>
                            <p style={{ fontSize: 12, color: "#67e8f9", marginTop: 4 }}>SECS</p>
                        </div>
                    </div>
                </div>
            )}

            <p style={{
                fontSize: 18,
                color: "#a3e635",
                textAlign: "center",
                maxWidth: 600,
            }}>
                bujhsi tor/apnar onek current je ei bhalo time e alarm set kora laglo.
                <br />
                I&apos;m a bit concerned about you tbh.
            </p>

            <button
                onClick={handleStopAlarm}
                className="start-over-btn"
            >
                {startOverButtonText}
            </button>

            {/* Floating Alarm Alert */}
            {isAlarmTriggered && (
                <div className="alarm-overlay">
                    <div className="alarm-floating-container">
                        <div className="alarm-text">
                            🔔 SHOMOY HOISE 🔔
                        </div>
                        <p className="alarm-subtext">
                            CT r pora hoise? 🤨
                        </p>
                        {audioBlocked && (
                            <button
                                onClick={handleEnableAudio}
                                className="enable-audio-btn"
                            >
                                🔊 sound na paile enable kor(en)!
                            </button>
                        )}
                        <button
                            onClick={handleStopAlarm}
                            className="dismiss-btn"
                        >
                            😴 keu thama eitare
                        </button>
                    </div>
                </div>
            )}

            <style>{`
        .start-over-btn {
          padding: 18px 56px;
          font-size: 20px;
          font-weight: bold;
          color: #fff;
          background: linear-gradient(135deg, #b91c1c, #991b1b);
          border: none;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 30px rgba(185, 28, 28, 0.5);
        }
        .start-over-btn:hover {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          transform: translateY(-2px);
          box-shadow: 0 6px 35px rgba(185, 28, 28, 0.6);
        }
        .start-over-btn:active {
          transform: translateY(0);
        }
        
        .alarm-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: overlayFadeIn 0.3s ease-out;
        }
        
        .alarm-floating-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          padding: 48px 64px;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(220, 38, 38, 0.2));
          border: 4px solid #ef4444;
          border-radius: 32px;
          box-shadow: 0 0 100px rgba(239, 68, 68, 0.6), 0 0 200px rgba(239, 68, 68, 0.3);
          animation: containerPulse 0.5s ease-in-out infinite alternate, floatBounce 2s ease-in-out infinite;
        }
        
        .alarm-text {
          font-size: 56px;
          font-weight: 900;
          color: #fef2f2;
          text-shadow: 0 0 40px rgba(239, 68, 68, 1), 0 0 80px rgba(239, 68, 68, 0.8);
          animation: textPulse 0.3s ease-in-out infinite alternate;
          text-align: center;
        }
        
        .alarm-subtext {
          font-size: 24px;
          color: #fca5a5;
          animation: subtextBlink 0.8s ease-in-out infinite;
        }
        
        .enable-audio-btn {
          padding: 16px 40px;
          font-size: 22px;
          font-weight: bold;
          color: #fff;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          border: none;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 30px rgba(245, 158, 11, 0.5);
          animation: audioButtonPulse 0.5s ease-in-out infinite alternate;
        }
        .enable-audio-btn:hover {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          transform: scale(1.1);
          box-shadow: 0 6px 50px rgba(245, 158, 11, 0.8);
        }
        
        .dismiss-btn {
          padding: 20px 48px;
          font-size: 20px;
          font-weight: bold;
          color: #fff;
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          border: none;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 30px rgba(220, 38, 38, 0.5);
          animation: buttonGlow 1s ease-in-out infinite alternate;
        }
        .dismiss-btn:hover {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          transform: scale(1.05);
          box-shadow: 0 6px 40px rgba(239, 68, 68, 0.7);
        }
        
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes containerPulse {
          from {
            box-shadow: 0 0 100px rgba(239, 68, 68, 0.6), 0 0 200px rgba(239, 68, 68, 0.3);
            border-color: #ef4444;
          }
          to {
            box-shadow: 0 0 150px rgba(239, 68, 68, 0.8), 0 0 300px rgba(239, 68, 68, 0.5);
            border-color: #f87171;
          }
        }
        
        @keyframes floatBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes textPulse {
          from {
            transform: scale(1);
            text-shadow: 0 0 40px rgba(239, 68, 68, 1), 0 0 80px rgba(239, 68, 68, 0.8);
          }
          to {
            transform: scale(1.05);
            text-shadow: 0 0 60px rgba(239, 68, 68, 1), 0 0 120px rgba(239, 68, 68, 1);
          }
        }
        
        @keyframes subtextBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes buttonGlow {
          from {
            box-shadow: 0 4px 30px rgba(220, 38, 38, 0.5);
          }
          to {
            box-shadow: 0 4px 50px rgba(239, 68, 68, 0.8);
          }
        }
        
        @keyframes audioButtonPulse {
          from {
            transform: scale(1);
            box-shadow: 0 4px 30px rgba(245, 158, 11, 0.5);
          }
          to {
            transform: scale(1.08);
            box-shadow: 0 6px 50px rgba(245, 158, 11, 0.9);
          }
        }
      `}</style>
        </div>
    );
}
