import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Bot, User, Mic, MicOff, Volume2, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/lib/api";
import { useSearchParams } from "react-router-dom";
import { ChatSidebar } from "./ChatSidebar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  className?: string;
  embedded?: boolean;
}

const quickSuggestions = [
  "I have a headache and eye strain",
  "Tell me about preventive dental care",
  "How can I improve my sleep quality?",
  "What are signs of dehydration?",
];

export function ChatInterface({ className, embedded = false }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your ScanMed AI assistant. How can I help you today? You can ask me about your scan results, symptoms, or general health questions.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const [searchParams] = useSearchParams();

  // Load chat from URL ID if present
  useEffect(() => {
    const chatId = searchParams.get("id");
    if (chatId) {
      loadChat(chatId);
      // Optional: Clear the param from URL without reloading to avoid sticking? 
      // Nah, keeping it is fine for deep linking.
    }
  }, [searchParams]);

  const languages = [
    { code: 'en-US', name: 'English' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'zh-CN', name: 'Chinese' },
  ];

  // Load a specific chat from backend
  const loadChat = async (chatId: string) => {
    try {
      const response = await api.get(`/chats/${chatId}`);
      if (response.data.success && response.data.chat) {
        const chatMessages = response.data.chat.messages || [];
        // Convert backend format to frontend format
        const formattedMessages: Message[] = chatMessages.map((m: any) => ({
          id: m.id || m._id || Date.now().toString(),
          role: m.sender === 'ai' ? 'assistant' : 'user',
          content: m.text,
          timestamp: new Date(m.timestamp),
        }));

        if (formattedMessages.length > 0) {
          setMessages(formattedMessages);
        } else {
          // Add welcome message if no messages
          setMessages([{
            id: "1",
            role: "assistant",
            content: "Hello! I'm your ScanMed AI assistant. How can I help you today?",
            timestamp: new Date(),
          }]);
        }
        setCurrentChatId(chatId);
      }
    } catch (error) {
      console.error("Error loading chat:", error);
      toast.error("Failed to load chat");
    }
  };

  // Start a new chat
  const handleNewChat = () => {
    setMessages([{
      id: "1",
      role: "assistant",
      content: "Hello! I'm your ScanMed AI assistant. How can I help you today? You can ask me about your scan results, symptoms, or general health questions.",
      timestamp: new Date(),
    }]);
    setCurrentChatId(null);
    setInput("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = selectedLanguage;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        setInput((prev) => {
          // If we have a final transcript, append it. 
          // If we only have interim, we might want to show it but not lock it in yet.
          // For simplicity, let's just use the latest transcript if it's substantial
          return finalTranscript || interimTranscript || prev;
        });
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        toast.error('Voice input error. Please try again.');
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, [selectedLanguage]);

  const handleVoiceRecord = () => {
    if (!recognitionRef.current) {
      toast.error('Voice input is not supported in your browser');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      toast.success("Voice recording stopped");
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        toast.success("Recording... Click again to stop");
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast.error('Could not start voice input');
      }
    }
  };

  const saveChatToBackend = async (updatedMessages: Message[]) => {
    try {
      // Convert messages to format expected by backend if necessary
      // Backend expects: { text, sender, timestamp } usually, but let's check what we send
      // We are sending the whole message object. Let's align with backend schema.
      // Backend likely expects 'messages' array.

      const backendMessages = updatedMessages.map(m => ({
        id: m.id, // or generate one
        sender: m.role === 'assistant' ? 'ai' : 'user',
        text: m.content,
        timestamp: m.timestamp
      }));

      if (currentChatId) {
        await api.put(`/chats/${currentChatId}`, {
          messages: backendMessages,
          title: backendMessages[1]?.text.substring(0, 30) || "New Chat",
          preview: backendMessages[backendMessages.length - 1]?.text.substring(0, 50)
        });
      } else {
        const response = await api.post("/chats", {
          title: backendMessages[1]?.text.substring(0, 30) || "New Chat",
          messages: backendMessages,
          preview: backendMessages[backendMessages.length - 1]?.text.substring(0, 50)
        });
        if (response.data.success) {
          setCurrentChatId(response.data.chat._id);
        }
      }
    } catch (error) {
      console.error("Error saving chat:", error);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    try {
      // Prepare history for ML endpoint
      // Prepare history for ML endpoint (Backend expects simple format and handles Gemini formatting)
      const conversationHistory = messages.slice(1).map(m => ({
        sender: m.role === "user" ? "user" : "ai",
        text: m.content
      }));

      const response = await api.post("/ml/chat", {
        message: userMessage.content,
        history: conversationHistory,
        language: "en", // or selectedLanguage
        chatId: currentChatId
      });

      if (response.data.success) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.data.response,
          timestamp: new Date(),
        };

        const finalMessages = [...updatedMessages, aiMessage];
        setMessages(finalMessages);
        setIsTyping(false);

        if (response.data.chatId) {
          setCurrentChatId(response.data.chatId);
        }

        await saveChatToBackend(finalMessages);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      setIsTyping(false);
      toast.error("Failed to get response from AI");

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date(),
      };
      setMessages([...updatedMessages, errorMessage]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage;
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error('Text-to-speech not supported');
    }
  };

  return (
    <div className={cn("flex h-full bg-background rounded-2xl overflow-hidden border border-border", className)}>
      {/* Sidebar - only show if not embedded */}
      {!embedded && (
        <ChatSidebar
          currentChatId={currentChatId}
          onSelectChat={loadChat}
          onNewChat={handleNewChat}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 h-full min-w-0 bg-card">
        {/* Chat header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-medical flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">ScanMed AI</h3>
              <p className="text-xs text-muted-foreground">Always here to help</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="text-xs border rounded-lg px-2 py-1 bg-background"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 animate-fade-in",
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  message.role === "user"
                    ? "gradient-medical"
                    : "bg-muted"
                )}
              >
                {message.role === "user" ? (
                  <User className="w-4 h-4 text-primary-foreground" />
                ) : (
                  <Bot className="w-4 h-4 text-primary" />
                )}
              </div>
              <div
                className={cn(
                  "max-w-[75%] px-4 py-3 rounded-2xl group relative",
                  message.role === "user"
                    ? "chat-bubble-user"
                    : "chat-bubble-ai"
                )}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                {message.role === "assistant" && (
                  <button
                    onClick={() => speakText(message.content)}
                    className="absolute -right-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-background/10 rounded"
                    title="Read aloud"
                  >
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="chat-bubble-ai">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-soft" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-soft" style={{ animationDelay: "0.2s" }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-soft" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick suggestions */}
        <div className="px-4 py-2 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1.5 text-xs font-medium bg-accent text-accent-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleVoiceRecord}
              className={cn(
                "shrink-0 transition-colors bg-muted hover:bg-muted/80",
                isRecording
                  ? "text-destructive bg-destructive/10 hover:bg-destructive/20 animate-pulse"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="gradient-medical text-primary-foreground shrink-0"
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
