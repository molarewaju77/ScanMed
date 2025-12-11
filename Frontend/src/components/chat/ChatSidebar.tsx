import { useState, useEffect } from "react";
import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { toast } from "sonner";

interface Chat {
    _id: string;
    title: string;
    createdAt: string;
}

interface ChatSidebarProps {
    currentChatId: string | null;
    onSelectChat: (chatId: string) => void;
    onNewChat: () => void;
}

export function ChatSidebar({ currentChatId, onSelectChat, onNewChat }: ChatSidebarProps) {
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadChats();
    }, [currentChatId]);

    const loadChats = async () => {
        try {
            const response = await api.get("/chats");
            if (response.data.success) {
                setChats(response.data.chats);
            }
        } catch (error) {
            console.error("Error loading chats:", error);
            toast.error("Failed to load chat history");
        } finally {
            setLoading(false);
        }
    };

    const deleteChat = async (chatId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Delete this chat?")) return;

        try {
            await api.delete(`/chats/${chatId}`);
            setChats(chats.filter(c => c._id !== chatId));
            toast.success("Chat deleted");
            if (currentChatId === chatId) {
                onNewChat();
            }
        } catch (error) {
            console.error("Error deleting chat:", error);
            toast.error("Failed to delete chat");
        }
    };

    const groupChatsByDate = () => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);

        const groups: { today: Chat[]; yesterday: Chat[]; lastWeek: Chat[]; older: Chat[] } = {
            today: [],
            yesterday: [],
            lastWeek: [],
            older: []
        };

        chats.forEach(chat => {
            const chatDate = new Date(chat.createdAt);
            if (chatDate >= today) {
                groups.today.push(chat);
            } else if (chatDate >= yesterday) {
                groups.yesterday.push(chat);
            } else if (chatDate >= lastWeek) {
                groups.lastWeek.push(chat);
            } else {
                groups.older.push(chat);
            }
        });

        return groups;
    };

    const groups = groupChatsByDate();

    const ChatItem = ({ chat }: { chat: Chat }) => (
        <div
            onClick={() => onSelectChat(chat._id)}
            className={cn(
                "w-full text-left px-3 py-2 rounded-lg hover:bg-accent transition-colors group flex items-center justify-between cursor-pointer",
                currentChatId === chat._id && "bg-accent"
            )}
        >
            <div className="flex items-center gap-2 flex-1 min-w-0">
                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm truncate">{chat.title || "New Chat"}</span>
            </div>
            <button
                onClick={(e) => deleteChat(chat._id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-opacity"
            >
                <Trash2 className="h-3 w-3 text-destructive" />
            </button>
        </div>
    );

    return (
        <div className="w-64 border-r bg-card flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b">
                <Button onClick={onNewChat} className="w-full" variant="default">
                    <Plus className="h-4 w-4 mr-2" />
                    New Chat
                </Button>
            </div>

            {/* Chat List */}
            <ScrollArea className="flex-1 p-4">
                {loading ? (
                    <p className="text-sm text-muted-foreground text-center">Loading...</p>
                ) : (
                    <div className="space-y-4">
                        {groups.today.length > 0 && (
                            <div>
                                <h3 className="text-xs font-semibold text-muted-foreground mb-2">Today</h3>
                                <div className="space-y-1">
                                    {groups.today.map(chat => <ChatItem key={chat._id} chat={chat} />)}
                                </div>
                            </div>
                        )}

                        {groups.yesterday.length > 0 && (
                            <div>
                                <h3 className="text-xs font-semibold text-muted-foreground mb-2">Yesterday</h3>
                                <div className="space-y-1">
                                    {groups.yesterday.map(chat => <ChatItem key={chat._id} chat={chat} />)}
                                </div>
                            </div>
                        )}

                        {groups.lastWeek.length > 0 && (
                            <div>
                                <h3 className="text-xs font-semibold text-muted-foreground mb-2">Previous 7 Days</h3>
                                <div className="space-y-1">
                                    {groups.lastWeek.map(chat => <ChatItem key={chat._id} chat={chat} />)}
                                </div>
                            </div>
                        )}

                        {groups.older.length > 0 && (
                            <div>
                                <h3 className="text-xs font-semibold text-muted-foreground mb-2">Older</h3>
                                <div className="space-y-1">
                                    {groups.older.map(chat => <ChatItem key={chat._id} chat={chat} />)}
                                </div>
                            </div>
                        )}

                        {chats.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center">No chats yet</p>
                        )}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}
