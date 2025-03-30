"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Markdown } from "react-showdown";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    text: string;
    sender: "user" | "bot" | "system";
    timestamp: number;
    id: string;
}

const Message = ({ msg }: { msg: Message }) => {
    const [displayedText, setDisplayedText] = useState("");
    const indexRef = useRef(0);

    useEffect(() => {
        if (msg.sender !== "bot") return;

        indexRef.current = 0;
        setDisplayedText("");

        const intervalId = setInterval(() => {
            if (indexRef.current < msg.text.length) {
                setDisplayedText(prev => prev + msg.text.charAt(indexRef.current));
                indexRef.current++;
            } else {
                clearInterval(intervalId);
            }
        }, 20);

        return () => clearInterval(intervalId);
    }, [msg.text, msg.sender]);

    return (
        <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: msg.sender === "user" ? 50 : -50 }}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`max-w-[80%] p-3 rounded-full transition-all duration-200 font-mono 
          ${msg.sender === "user"
                        ? "bg-white text-black"
                        : "bg-transparent text-white"}`}
            >
                {msg.sender === "bot" ? (
                    <Markdown
                        markdown={displayedText}
                        className="prose prose-invert prose-sm prose-headings:text-white prose-a:text-white prose-a:underline"
                    />
                ) : (
                    <p className="text-sm font-medium">{msg.text}</p>
                )}
            </div>
        </motion.div>
    );
};

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [showCommandsModal, setShowCommandsModal] = useState(false);
    const commands = [
        { command: "/clear ", description: "Clear the chat" },
        { description: "More commands will be added in future.........." }
    ];


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        const trimmedInput = input.trim();

        if (trimmedInput === "/clear") {
            clearChat();
            setInput("");
            return;
        }
        if (trimmedInput === "/help") {
            setShowCommandsModal(true);
            setInput("");
            return;
        }


        if (!trimmedInput) return;

        const userMessage: Message = {
            text: trimmedInput,
            sender: "user",
            timestamp: Date.now(),
            id: Math.random().toString(36).substr(2, 9)
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        try {
            const response = await axios.get(
                `${API_URL}/${encodeURIComponent(input)}`
            );

            const botMessage: Message = {
                text: response.data,
                sender: "bot",
                timestamp: Date.now(),
                id: Math.random().toString(36).substr(2, 9)
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage: Message = {
                text: "⚠️ Failed to get response. Please try again.",
                sender: "system",
                timestamp: Date.now(),
                id: Math.random().toString(36).substr(2, 9)
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
            inputRef.current?.focus();
        }
    };

    const clearChat = () => {
        setMessages([]);
        setShowClearConfirm(false); // Close modal if open
    };

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    return (
        <div className="flex flex-col h-screen w-full bg-black overflow-hidden font-mono">
            {/* Chat Header */}
            {showCommandsModal && (
                <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
                    <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 max-w-md w-full mx-4">
                        <h3 className="text-lg font-medium text-white mb-4">Available Commands</h3>
                        <div className="space-y-3 mb-6">
                            {commands.map((cmd, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <code className="text-blue-400">{cmd.command}</code>
                                    <span className="text-neutral-400 text-sm">{cmd.description}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowCommandsModal(false)}
                                className="px-4 py-2 bg-neutral-800 text-white rounded-lg cursor-pointer hover:bg-neutral-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="p-4 border-b border-neutral-800">
                <div className="flex items-center justify-between max-w-4xl mx-auto">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                    strokeLinejoin="round">
                                    <path d="M17 14h.01" />
                                    <path d="M7 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-white">PockeTalke</h2>
                            <p className="text-sm text-neutral-400">Made by #031 from weowls</p>
                        </div>
                    </div>
                    {showClearConfirm && (
                        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
                            <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 max-w-md w-full mx-4">
                                <h3 className="text-lg font-medium text-white mb-4">Clear Chat History?</h3>
                                <p className="text-neutral-400 text-sm mb-6">
                                    This will permanently delete all message. This action cannot be undone.
                                </p>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => setShowClearConfirm(false)}
                                        className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={clearChat}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Confirm Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Chat Header */}
                    <div className="p-4">
                        <div className="flex items-center justify-between max-w-4xl mx-auto">
                            <button
                                onClick={() => setShowClearConfirm(true)}
                                className="text-neutral-400 hover:text-white transition-colors cursor-pointer text-sm"
                            >
                                Clear Chat
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-2xl mx-auto space-y-4">
                    <AnimatePresence>
                        {messages.map((msg) => (
                            <Message key={msg.id} msg={msg} />
                        ))}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />

                    {/* Typing Indicator */}
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center space-x-2 text-neutral-400"
                        >
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
                                <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
                            </div>
                            <span className="text-sm">Thinking...</span>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-neutral-800">
                <div className="max-w-2xl mx-auto">
                    <div className="flex gap-2 items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type Message...or Type /help"
                            className="flex-1 px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-neutral-800 rounded-full focus:outline-none 
                    focus:border-neutral-300 bg-black text-white placeholder-neutral-600 
                    transition-all pr-12 md:pr-14"
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            aria-label="Type your message"
                            autoFocus
                            ref={inputRef}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || isTyping}
                            className="p-2.5 md:px-3.5 md:py-3 bg-white text-black rounded-full hover:bg-neutral-100 
                    disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 
                    flex items-center justify-center hover:scale-105 active:scale-95 flex-shrink-0"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 md:h-6 md:w-6"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m5 12 7-7 7 7" />
                                <path d="M12 19V5" />
                            </svg>
                        </button>
                    </div>
                    <div className="mt-3 text-center text-xs text-neutral-600 space-y-1">
                        <p className="leading-tight">AI may produce inaccurate info</p>
                        <p className="hidden md:inline">made by weowls</p>
                        <p className="md:hidden text-[10px]">weowls</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;