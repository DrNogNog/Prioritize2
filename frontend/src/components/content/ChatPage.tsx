"use client";

import { useState, useRef, useEffect } from "react";
import DataSources from "@/components/content/DataSources"
type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      const botMessage: Message = {
        role: "assistant",
        content: data.reply || "No response",
      };

      setMessages([...newMessages, botMessage]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Error connecting to server" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex align-center w-full">
    <div style={styles.container}>

      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start" }}>
            
            {/* Assistant avatar BEFORE the message div */}
            {msg.role === "assistant" && (
              <img
                src="/ai.png"
                alt="Bot"
                style={styles.avatar}
              />
            )}
            {msg.role === "user" && (
              <img
                src="/user.png"
                alt="You"
                style={styles.avatar}
              />
            )}

            <div
              style={{
                ...styles.message,
                ...(msg.role === "user" ? styles.userMessage : styles.botMessage),
              }}
            >
              <div>{msg.content}</div>
            </div>

          </div>
        ))}

        {loading && (
          <div style={styles.botMessage}>Typing...</div>
        )}

        <div ref={bottomRef} />
      </div>
        <div style={styles.topchat}>Quering: Mobile App · Q2 2026  · 4 sources available</div>
      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your signals..."
        />
        <button style={styles.button} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
    <div className="min-h-screen flex flex-col">     
       <DataSources/>
    </div>

    </div>
    
  );
}

const styles: Record<string, React.CSSProperties> = {
  dataSources: {
    border: "1px solid"
  },
  topchat: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px 14px",
    color: "#5F5E5A",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "0.3px",
    whiteSpace: "nowrap",
  },
  container: {
    flex: 1,           // allows container to take remaining space
    margin: 0,
    padding: 20,
    fontFamily: "sans-serif",
    backgroundColor: "transparent",
    boxShadow: "none",
    border: "none",
  },
  chatBox: {
    backgroundColor: "transparent", // makes it borderless / flush
    boxShadow: "none",   // remove any shadow if previously added
    border: "none", 
    padding: 15,
    height: 500,
    overflowY: "auto",
    marginBottom: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: "50%", // circle
    marginRight: 12,
  },
  message: {
    display: "flex",       // horizontal layout
    alignItems: "center",  // vertical centering
    marginBottom: 12,
    padding: 6,
    borderRadius: 12,
    maxWidth: "70%",
    gap: 8,                // spacing between avatar and text
  },
  userMessage: {
    background: "#F5F4F0",
    color: "black",
    marginRight: "auto",
  },
  botMessage: {
    background: "#FFFFFF",
    color: "black",
    marginRight: "auto",
  },
  inputContainer: {
    display: "flex",
    gap: 10,
  },
  input: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    border: "1px solid #ccc",
    background: "#FFFFFF"
  },
  button: {
    padding: "12px 20px",
    borderRadius: 8,
    background: "#E6F1FB",
    color: "#2971BC",
    cursor: "pointer",
    border: "1px solid #2971BC",
  },
};