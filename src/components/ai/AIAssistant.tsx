import { useEffect, useRef, useState } from 'react';
import { MessageSquare, Send, Bot, User, X, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AIAssistantProps {
  tripContext?: unknown;
  destinationContext?: unknown;
}

export default function AIAssistant({ tripContext, destinationContext }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "I'm your CheapVacay assistant. Ask me how to lower costs, choose transport, or tighten a trip budget." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) {
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          tripContext,
          destinationContext,
        }),
      });

      if (!response.ok) {
        throw new Error('Assistant request failed');
      }

      const data = await response.json();
      const modelText = typeof data.text === 'string' && data.text.trim()
        ? data.text
        : "I'm sorry, I couldn't process that request.";

      setMessages((prev) => [...prev, { role: 'model', text: modelText }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: "I'm having trouble connecting right now. Try asking again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-8 md:right-8 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-50"
        aria-label="Open AI assistant"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div
      className={cn(
        'fixed bottom-20 right-4 md:bottom-8 md:right-8 w-[350px] bg-card border rounded-2xl shadow-2xl flex flex-col z-50 transition-all overflow-hidden',
        isMinimized ? 'h-14' : 'h-[500px]',
      )}
    >
      <header className="p-3 bg-primary text-primary-foreground flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <span className="font-semibold">Travel Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-white/20 rounded" aria-label={isMinimized ? 'Expand assistant' : 'Minimize assistant'}>
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded" aria-label="Close assistant">
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {!isMinimized && (
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-accent/5">
            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={cn(
                  'flex gap-2 max-w-[85%]',
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto',
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                    msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground',
                  )}
                >
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div
                  className={cn(
                    'p-3 rounded-2xl text-sm whitespace-pre-wrap',
                    msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-card border rounded-tl-none',
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 mr-auto">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 bg-card border rounded-2xl rounded-tl-none animate-pulse">Thinking...</div>
              </div>
            )}
          </div>

          <div className="p-3 border-t bg-card flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about your trip..."
              className="flex-1 p-2 bg-accent/10 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="p-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
