"use client";

import { useState } from "react";

interface AMPMChooserProps {
    readonly confirmedHour: number;
    readonly confirmedMinute: number;
    readonly onConfirm: (ampm: "AM" | "PM") => void;
    readonly confirmButtonText?: string;
}

export default function AMPMChooser({
    confirmedHour,
    confirmedMinute,
    onConfirm,
    confirmButtonText = "Ho, eitai (🤔)"
}: AMPMChooserProps) {
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isFlipping, setIsFlipping] = useState(false);
    const [coinRotation, setCoinRotation] = useState(0);
    const [coinResult, setCoinResult] = useState<"AM" | "PM" | null>(null);

    const handleCoinToss = () => {
        if (isFlipping) return;

        setIsFlipping(true);
        setCoinResult(null);
        setIsInitialLoad(false);

        // Random result
        const result: "AM" | "PM" = Math.random() > 0.5 ? "AM" : "PM";

        // Animate coin flip
        let rotations = 0;
        const totalRotations = 8 + Math.floor(Math.random() * 4); // 8-11 full rotations
        const finalRotation = result === "AM" ? 0 : 180; // AM = heads, PM = tails

        const flipInterval = setInterval(() => {
            rotations++;
            setCoinRotation(prev => prev + 180);

            if (rotations >= totalRotations) {
                clearInterval(flipInterval);
                setCoinRotation(finalRotation);
                setCoinResult(result);
                setIsFlipping(false);
            }
        }, 100);
    };

    const handleConfirm = () => {
        if (!coinResult) return;
        onConfirm(coinResult);
    };

    const getTossButtonText = () => {
        if (isFlipping) return "🪙 Ghurtese...";
        if (coinResult) return "🔄 Hoynai, abar toss";
        return "🪙 Toss kore select kortam!";
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 32,
                padding: 40,
                width: 600,
                height: 560,
                background: "linear-gradient(135deg, rgba(251, 146, 60, 0.15), rgba(168, 85, 247, 0.15))",
                border: "2px solid rgba(251, 146, 60, 0.5)",
                borderRadius: 24,
                boxShadow: "0 0 40px rgba(251, 146, 60, 0.2)",
            }}
        >
            <div style={{ textAlign: "center" }}>
                <p style={{
                    fontSize: 14,
                    color: "#fb923c",
                    textTransform: "uppercase",
                    letterSpacing: 3,
                    marginBottom: 8,
                }}>
                    🎰 Surprise MF 🎰
                </p>
                <h2 style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: "#fff",
                    marginTop: 24,
                    marginBottom: 8,
                }}>
                    AM or PM?
                </h2>
            </div>

            {/* Selected time display */}
            <div
                style={{
                    padding: "12px 24px",
                    background: "rgba(34, 197, 94, 0.2)",
                    border: "1px solid #22c55e",
                    borderRadius: 12,
                    color: "#22c55e",
                    fontSize: 24,
                }}
            >
                Time: <strong>{confirmedHour.toString().padStart(2, "0")}:{confirmedMinute.toString().padStart(2, "0")}</strong> — but AM or PM? 🤔
            </div>

            {/* The Coin - only shown during flipping */}
            {!isInitialLoad && isFlipping && (
                <div
                    style={{
                        perspective: "1000px",
                        width: 150,
                        height: 150,
                    }}
                >
                    <div
                        className="coin"
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "relative",
                            transformStyle: "preserve-3d",
                            transform: `rotateY(${coinRotation}deg)`,
                            transition: "transform 0.1s linear",
                        }}
                    >
                        {/* AM Side (Heads) */}
                        <div
                            style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                backfaceVisibility: "hidden",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 36,
                                fontWeight: 800,
                                background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                                color: "#78350f",
                                boxShadow: "0 0 30px rgba(251, 191, 36, 0.5), inset 0 -4px 10px rgba(0,0,0,0.2)",
                                border: "4px solid #fcd34d",
                            }}
                        >
                            ☀️ AM
                        </div>
                        {/* PM Side (Tails) */}
                        <div
                            style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                backfaceVisibility: "hidden",
                                transform: "rotateY(180deg)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 36,
                                fontWeight: 800,
                                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                                color: "#e0e7ff",
                                boxShadow: "0 0 30px rgba(99, 102, 241, 0.5), inset 0 -4px 10px rgba(0,0,0,0.2)",
                                border: "4px solid #818cf8",
                            }}
                        >
                            🌙 PM
                        </div>
                    </div>
                </div>
            )}

            {/* Result Display */}
            {coinResult && !isFlipping && (
                <div
                    style={{
                        padding: "16px 32px",
                        background: coinResult === "AM"
                            ? "linear-gradient(135deg, rgba(251, 191, 36, 0.3), rgba(245, 158, 11, 0.1))"
                            : "linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(79, 70, 229, 0.1))",
                        border: `2px solid ${coinResult === "AM" ? "#fbbf24" : "#6366f1"}`,
                        borderRadius: 16,
                        textAlign: "center",
                        animation: "resultPop 0.3s ease-out",
                        marginTop: 28
                    }}
                >
                    <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 4 }}>Coin ghuira eita uthse</p>
                    <p style={{
                        fontSize: 28,
                        fontWeight: 800,
                        color: coinResult === "AM" ? "#fbbf24" : "#818cf8",
                    }}>
                        {coinResult === "AM" ? "☀️" : "🌙"} {coinResult}
                    </p>
                </div>
            )}

            {/* Buttons */}
            <div style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center", marginTop: 32 }}>
                <button
                    onClick={handleCoinToss}
                    disabled={isFlipping}
                    className="coin-toss-btn"
                    style={{
                        opacity: isFlipping ? 0.5 : 1,
                        cursor: isFlipping ? "not-allowed" : "pointer",
                        // Bigger button for first toss
                        ...(coinResult === null && !isFlipping ? {
                            padding: "22px 52px",
                            fontSize: 24,
                            borderRadius: 16,
                            marginTop: 48,
                        } : {}),
                    }}
                >
                    {getTossButtonText()}
                </button>

                {coinResult && !isFlipping && (
                    <button
                        onClick={handleConfirm}
                        className="confirm-ampm-btn"
                    >
                        {confirmButtonText} → {coinResult}
                    </button>
                )}
            </div>

            <style>{`
        .coin-toss-btn {
          padding: 16px 32px;
          font-size: 18px;
          font-weight: bold;
          color: #fff;
          background: linear-gradient(135deg,rgb(107, 57, 10),rgb(87, 79, 12));
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 25px rgba(107, 57, 10, 0.4);
        }
        .coin-toss-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, rgb(140, 80, 20), rgb(107, 57, 10));
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 6px 30px rgba(107, 57, 10, 0.5);
        }
        .coin-toss-btn:active:not(:disabled) {
          transform: translateY(0) scale(0.98);
        }
        
        .confirm-ampm-btn {
          padding: 16px 32px;
          font-size: 18px;
          font-weight: bold;
          color: #fff;
          background: linear-gradient(135deg,rgb(21, 90, 46),rgb(10, 100, 43));
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 25px rgba(23, 87, 46, 0.4);
          animation: fadeSlideIn 0.3s ease-out;
        }
        .confirm-ampm-btn:hover {
          background: linear-gradient(135deg,rgb(23, 87, 46),rgb(7, 82, 35));
          transform: translateY(-2px);
          box-shadow: 0 6px 30px rgba(23, 87, 46, 0.5);
        }
        .confirm-ampm-btn:active {
          transform: translateY(0);
        }
        
        @keyframes resultPop {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes fadeSlideIn {
          0% {
            opacity: 0;
            transform: translateX(20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
        </div>
    );
}
