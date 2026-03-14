'use client'

import { useState, useRef, useEffect } from 'react'

type Message = {
  id: string
  text: string
  isOwn: boolean
  timestamp: number
}

type InputBarProps = {
  input: string
  setInput: React.Dispatch<React.SetStateAction<string>>
  onSend: () => void
  onFile: (e: React.ChangeEvent<HTMLInputElement>) => void
  fileRef: React.RefObject<HTMLInputElement | null>
}

function InputBar({
  input,
  setInput,
  onSend,
  onFile,
  fileRef,
}: InputBarProps) {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <input
        ref={fileRef}
        type="file"
        onChange={onFile}
        className="hidden"
      />

      <div className="flex items-center gap-3 rounded-full border border-zinc-300 bg-white px-5 py-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-zinc-500 hover:text-black dark:text-zinc-400"
        >
          📎
        </button>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onSend()
          }
        }}
          placeholder="Type a message..."
          className="flex-1 bg-transparent outline-none"
        />

        <button
          onClick={onSend}
          disabled={!input.trim()}
          className={`flex h-9 w-9 items-center justify-center rounded-full
          ${
            input.trim()
              ? 'bg-black text-white dark:bg-white dark:text-black'
              : 'bg-zinc-200 text-zinc-400 dark:bg-zinc-700'
          }`}
        >
          ➤
        </button>

      </div>
    </div>
  )
}

export default function ChatPage() {

  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      text: 'Welcome to the chat 👋',
      isOwn: false,
      timestamp: Date.now(),
    },
  ])

  const [input, setInput] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const hasStarted = messages.length > 1

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
  if (!input.trim()) return

  const userText = input.trim()

  const msg: Message = {
    id: crypto.randomUUID(),
    text: userText,
    isOwn: true,
    timestamp: Date.now(),
  }

  setMessages((m) => [...m, msg])
  setInput('')

  try {
    const res = await fetch('http://localhost:8080/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userText,
      }),
    })

    const data = await res.json()

    setMessages((m) => [
      ...m,
      {
        id: crypto.randomUUID(),
        text: data.message,
        isOwn: false,
        timestamp: Date.now(),
      },
    ])
  } catch (err) {
    console.error(err)

    setMessages((m) => [
      ...m,
      {
        id: crypto.randomUUID(),
        text: 'Server error 😅',
        isOwn: false,
        timestamp: Date.now(),
      },
    ])
  }
}

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setMessages((m) => [
      ...m,
      {
        id: crypto.randomUUID(),
        text: `📎 ${file.name}`,
        isOwn: true,
        timestamp: Date.now(),
      },
    ])

    e.target.value = ''
  }

  return (
    <div className="flex h-screen flex-col bg-zinc-50 dark:bg-zinc-950">

      {/* Header */}
      <header className="border-b border-zinc-200 bg-white px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <h1 className="font-semibold">Prioritize</h1>
          <button onClick={() => alert('settings')}>☰</button>
        </div>
      </header>

      {!hasStarted && (
        <div className="flex flex-1 items-center justify-center px-4">
          <InputBar
            input={input}
            setInput={setInput}
            onSend={sendMessage}
            onFile={handleFile}
            fileRef={fileRef}
          />
        </div>
      )}

      {hasStarted && (
        <>
          <main className="flex-1 overflow-y-auto px-4 pt-6 pb-4">
            <div className="mx-auto max-w-4xl space-y-4">

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2
                    ${
                      msg.isOwn
                        ? 'bg-black text-white dark:bg-zinc-100 dark:text-black'
                        : 'bg-white dark:bg-zinc-800'
                    }`}
                  >
                    {msg.text}

                    <div className="text-xs opacity-60 text-right mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              ))}

              <div ref={bottomRef} />
            </div>
          </main>

          <footer className="border-t border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900">
            <InputBar
              input={input}
              setInput={setInput}
              onSend={sendMessage}
              onFile={handleFile}
              fileRef={fileRef}
            />
          </footer>
        </>
      )}
    </div>
  )
}
