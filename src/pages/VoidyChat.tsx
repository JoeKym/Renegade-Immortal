import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Send, Bot, Trash2, Download, Plus, MessageSquare, ChevronLeft, MoreVertical, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { VoidyBackground } from "@/components/voidy/VoidyBackground";
import { VoidyChatMessages, type Msg } from "@/components/voidy/VoidyChatMessages";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/voidy-chat`;
const HISTORY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/voidy-history`;

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

const suggestions = [
  "Who is Wang Lin?",
  "Explain the cultivation realms",
  "Tell me about Li Muwan",
  "What are the Ancient Gods?",
  "Summarize the novel's plot",
];

export default function Voidy() {
  const { user, session } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const authHeader = useMemo(() => {
    return session?.access_token ? `Bearer ${session.access_token}` : "";
  }, [session]);

  useEffect(() => {
    if (user) loadConversations();
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const loadConversations = async () => {
    try {
      const resp = await fetch(`${HISTORY_URL}?action=list`, {
        headers: { Authorization: authHeader },
      });
      if (!resp.ok) throw new Error("Failed to load conversations");
      const data = await resp.json();
      setConversations(data.conversations || []);
    } catch (e) {
      console.error("Failed to load conversations:", e);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const resp = await fetch(`${HISTORY_URL}?action=messages&conversation_id=${conversationId}`, {
        headers: { Authorization: authHeader },
      });
      if (!resp.ok) throw new Error("Failed to load messages");
      const data = await resp.json();
      const msgs = (data.messages || []).map((m: any) => ({ role: m.role, content: m.content }));
      setMessages(msgs);
    } catch (e) {
      toast.error("Failed to load conversation");
    }
  };

  const createConversation = async () => {
    if (!user) {
      toast.error("Please sign in to save conversations");
      return;
    }
    try {
      const resp = await fetch(`${HISTORY_URL}?action=create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({ title: "New Chat" }),
      });
      if (!resp.ok) throw new Error("Failed to create conversation");
      const data = await resp.json();
      setConversations((prev) => [data.conversation, ...prev]);
      setActiveConversationId(data.conversation.id);
      setMessages([]);
      if (isMobile) setSidebarOpen(false);
    } catch (e) {
      toast.error("Failed to create conversation");
    }
  };

  const selectConversation = (id: string) => {
    setActiveConversationId(id);
    loadMessages(id);
    if (isMobile) setSidebarOpen(false);
  };

  const deleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const resp = await fetch(`${HISTORY_URL}?action=delete&id=${id}`, {
        method: "DELETE",
        headers: { Authorization: authHeader },
      });
      if (!resp.ok) throw new Error("Failed to delete");
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConversationId === id) {
        setActiveConversationId(null);
        setMessages([]);
      }
      toast.success("Conversation deleted");
    } catch (e) {
      toast.error("Failed to delete conversation");
    }
  };

  const renameConversation = async (id: string) => {
    if (!editTitle.trim()) {
      setEditingId(null);
      return;
    }
    try {
      const resp = await fetch(`${HISTORY_URL}?action=update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({ id, title: editTitle.trim() }),
      });
      if (!resp.ok) throw new Error("Failed to rename");
      setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, title: editTitle.trim() } : c)));
      toast.success("Renamed successfully");
    } catch (e) {
      toast.error("Failed to rename");
    } finally {
      setEditingId(null);
    }
  };

  const saveMessage = async (conversationId: string, role: string, content: string) => {
    try {
      await fetch(`${HISTORY_URL}?action=save_message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({ conversation_id: conversationId, role, content }),
      });
    } catch (e) {
      console.error("Failed to save message:", e);
    }
  };

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    let conversationId = activeConversationId;
    if (!conversationId && user) {
      try {
        const resp = await fetch(`${HISTORY_URL}?action=create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify({ title: text.slice(0, 50) + (text.length > 50 ? "..." : "") }),
        });
        if (resp.ok) {
          const data = await resp.json();
          conversationId = data.conversation.id;
          setActiveConversationId(conversationId);
          setConversations((prev) => [data.conversation, ...prev]);
        }
      } catch (e) {
        console.error("Failed to auto-create conversation:", e);
      }
    }

    const userMsg: Msg = { role: "user", content: text.trim() };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setIsLoading(true);

    if (conversationId) await saveMessage(conversationId, "user", text.trim());

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Request failed (${resp.status})`);
      }
      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              const updated = assistantSoFar;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: updated } : m));
                }
                return [...prev, { role: "assistant", content: updated }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              const updated = assistantSoFar;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: updated } : m));
                }
                return [...prev, { role: "assistant", content: updated }];
              });
            }
          } catch { }
        }
      }

      if (conversationId && assistantSoFar) {
        await saveMessage(conversationId, "assistant", assistantSoFar);
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to get response");
      if (!assistantSoFar) setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, activeConversationId, user]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(input); };
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } };

  const MAX_CHARS = 2000;

  const exportChat = () => {
    if (messages.length === 0) return;
    const text = messages.map((m) => `[${m.role === "user" ? "You" : "Voidy"}]\n${m.content}`).join("\n\n---\n\n");
    const blob = new Blob([`Voidy Chat Export - ${new Date().toLocaleString()}\n${"=".repeat(40)}\n\n${text}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `voidy-chat-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <VoidyBackground />
      <div className="flex h-screen pt-16">
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen ? 0 : -300 }}
          className={`fixed md:relative z-20 w-72 h-[calc(100vh-4rem)] bg-card/95 backdrop-blur-md border-r border-border flex flex-col ${sidebarOpen ? "" : "hidden md:flex"}`}
        >
          <div className="p-4 border-b border-border">
            <Button onClick={createConversation} className="w-full gap-2"><Plus size={16} /> New Chat</Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => selectConversation(conv.id)}
                  className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${activeConversationId === conv.id ? "bg-primary/20 border border-primary/30" : "hover:bg-accent"}`}
                >
                  <MessageSquare size={16} className="shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    {editingId === conv.id ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => renameConversation(conv.id)}
                        onKeyDown={(e) => { if (e.key === "Enter") renameConversation(conv.id); if (e.key === "Escape") setEditingId(null); }}
                        autoFocus
                        className="w-full text-sm bg-transparent border-b border-primary outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <p className="text-sm truncate">{conv.title}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{new Date(conv.updated_at).toLocaleDateString()}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button onClick={(e) => e.stopPropagation()} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-accent rounded"><MoreVertical size={14} /></button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditingId(conv.id); setEditTitle(conv.title); }}><Edit2 size={14} className="mr-2" /> Rename</DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => deleteConversation(conv.id, e as any)} className="text-destructive"><Trash2 size={14} className="mr-2" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </ScrollArea>
        </motion.div>

        <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-background/50">
          <div className="flex items-center gap-2 p-4 border-b border-border bg-card/50 backdrop-blur-sm">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden"><ChevronLeft size={20} /></Button>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-primary/20"><Bot className="w-5 h-5 text-primary" /></div>
              <h1 className="font-heading text-xl">Voidy</h1>
            </div>
            <span className="text-xs text-muted-foreground ml-auto">{user ? "" : "Sign in to save chats"}</span>
          </div>

          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <VoidyChatMessages messages={messages} isLoading={isLoading} suggestions={suggestions} onSuggestion={sendMessage} />
          </ScrollArea>

          <div className="border-t border-border p-3 bg-card/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2 px-1">
              {messages.length > 0 && (
                <div className="flex gap-2">
                  <button onClick={() => { setMessages([]); setActiveConversationId(null); }} className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"><Trash2 size={12} /> Clear</button>
                  <button onClick={exportChat} className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"><Download size={12} /> Export</button>
                </div>
              )}
              <span className="text-xs text-muted-foreground ml-auto">{isLoading && <span className="text-primary/70 animate-pulse">Voidy is thinking…</span>}</span>
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="flex-1 relative">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Voidy a question..."
                  className="min-h-[44px] max-h-[120px] resize-none text-sm bg-background/50 pr-16"
                  rows={1}
                  disabled={isLoading}
                />
                <span className={`absolute right-2 bottom-1.5 text-[10px] ${input.length > MAX_CHARS * 0.9 ? "text-destructive" : "text-muted-foreground/50"}`}>{input.length}/{MAX_CHARS}</span>
              </div>
              <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="shrink-0 h-[44px] w-[44px]"><Send size={18} /></Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
