"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, MessageCircle } from "lucide-react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

// Mock Data
const MOCK_QUESTION = {
    id: 1,
    text: "AIは教育の質を向上させると思いますか？",
    options: ["はい", "いいえ", "わからない"]
};

const MOCK_RESULTS = [
    { name: "はい", value: 65, color: "#f97316" },
    { name: "いいえ", value: 20, color: "#3abff8" },
    { name: "わからない", value: 15, color: "#9ca3af" }
];

export default function ParticipantPage() {
    const [hasAnswered, setHasAnswered] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showReflection, setShowReflection] = useState(false);
    const [chatMessages, setChatMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
        { role: "ai", text: "回答ありがとうございます。「はい」を選んだ理由を教えていただけますか？" }
    ]);
    const [inputText, setInputText] = useState("");

    const handleAnswer = (option: string) => {
        setSelectedOption(option);
        setHasAnswered(true);
    };

    const handleSendMessage = () => {
        if (!inputText.trim()) return;
        setChatMessages(prev => [...prev, { role: "user", text: inputText }]);
        setInputText("");
        // Mock AI Reply
        setTimeout(() => {
            setChatMessages(prev => [...prev, { role: "ai", text: "なるほど、興味深い視点ですね。具体的にはどのような場面でそう感じますか？" }]);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-orange-50 font-sans text-slate-800">
            <div className="mx-auto max-w-md bg-white min-h-screen shadow-xl overflow-hidden flex flex-col">

                {/* Header */}
                <header className="bg-primary p-4 text-white text-center shadow-md z-10 sticky top-0">
                    <h1 className="text-lg font-bold">Active Learning</h1>
                </header>

                <main className="flex-1 p-6 flex flex-col">
                    <AnimatePresence mode="wait">
                        {!hasAnswered ? (
                            <motion.div
                                key="question"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col justify-center flex-1"
                            >
                                <div className="mb-8 text-center">
                                    <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-primary mb-2">
                                        問い No.1
                                    </span>
                                    <h2 className="text-2xl font-bold leading-tight text-slate-900">
                                        {MOCK_QUESTION.text}
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    {MOCK_QUESTION.options.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => handleAnswer(option)}
                                            className="w-full rounded-2xl border-2 border-gray-100 bg-white p-5 text-lg font-semibold shadow-sm transition-all active:scale-95 active:border-primary active:bg-orange-50"
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        ) : !showReflection ? (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex flex-col flex-1"
                            >
                                <div className="mb-6 text-center">
                                    <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">回答を受け付けました</h2>
                                    <p className="text-gray-500">他の参加者の回答状況です</p>
                                </div>

                                <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={MOCK_RESULTS} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <XAxis type="number" hide />
                                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                                                {MOCK_RESULTS.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                    {/* Overlay text for bars since recharts axis can be tricky on mobile */}
                                    <div className="absolute inset-0 flex flex-col justify-around py-4 pointer-events-none">
                                        {MOCK_RESULTS.map((r, i) => (
                                            <div key={i} className="pl-4 font-bold text-slate-700 drop-shadow-sm flex justify-between pr-8">
                                                <span>{r.name}</span>
                                                <span>{r.value}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowReflection(true)}
                                    className="w-full rounded-xl bg-gradient-to-r from-secondary to-blue-500 p-4 text-white font-bold shadow-lg shadow-blue-200 transition-transform active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <MessageCircle size={20} />
                                    振り返りチャットへ
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="reflection"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col flex-1 h-full"
                            >
                                <div className="flex-1 overflow-y-auto space-y-4 p-2 mb-4">
                                    {chatMessages.map((msg, i) => (
                                        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                            <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === "user" ? "bg-primary text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"}`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2 p-2 bg-gray-50 rounded-xl border border-gray-200">
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                        placeholder="メッセージを入力..."
                                        className="flex-1 bg-transparent px-2 py-1 outline-none text-slate-900"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className="rounded-lg bg-primary p-2 text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
                                        disabled={!inputText.trim()}
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
