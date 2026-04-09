"use client";

import { FormEvent, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) {
      return;
    }

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!response.ok) {
        throw new Error("Chat API error");
      }

      const data = (await response.json()) as { response?: string };
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response?.trim() || "Nu am putut genera un raspuns acum.",
        },
      ]);
    } catch (error) {
      console.error("Chat widget error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "A aparut o eroare. Incearca din nou in cateva secunde.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50">
      {isOpen ? (
        <div className="mb-3 flex h-112 w-88 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_18px_38px_rgba(17,24,39,0.14)]">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-900">Asistent Mobila</h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-2 py-1 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            >
              Inchide
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">
            {messages.length === 0 ? (
              <p className="text-sm text-gray-500">
                Salut! Sunt asistentul LABIRINT. Te pot ajuta cu produse, mobilier la comanda si
                oferte pe Website, Instagram sau WhatsApp.
              </p>
            ) : (
              messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                    message.role === "user"
                      ? "ml-auto bg-black text-white"
                      : "bg-white text-gray-800 shadow-sm"
                  }`}
                >
                  {message.content}
                </div>
              ))
            )}

            {isLoading ? <p className="text-xs text-gray-500">Asistentul scrie...</p> : null}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-gray-200 p-3">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Scrie mesajul..."
              className="flex-1 rounded-2xl border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-500"
            >
              Trimite
            </button>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-black text-xl text-white shadow-xl transition hover:scale-105 hover:bg-gray-800"
        aria-label="Deschide chat"
      >
        💬
      </button>
    </div>
  );
}
