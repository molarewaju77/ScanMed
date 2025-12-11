import { MainLayout } from "@/components/layout/MainLayout";
import { MessageCircle, Clock, User, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatLog {
  id: string;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  date: string;
  messageCount: number;
}

const mockChats: ChatLog[] = [
  {
    id: "1",
    userName: "Mohamed Omar",
    userAvatar: "MO",
    lastMessage: "Thank you for the eye scan analysis...",
    date: "Today, 2:30 PM",
    messageCount: 8,
  },
  {
    id: "2",
    userName: "Sarah Johnson",
    userAvatar: "SJ",
    lastMessage: "What does the teeth scan result mean?",
    date: "Today, 1:15 PM",
    messageCount: 12,
  },
  {
    id: "3",
    userName: "James Wilson",
    userAvatar: "JW",
    lastMessage: "I have concerns about my skin scan...",
    date: "Yesterday, 4:45 PM",
    messageCount: 5,
  },
  {
    id: "4",
    userName: "Emily Chen",
    userAvatar: "EC",
    lastMessage: "Can you recommend any treatments?",
    date: "Yesterday, 10:20 AM",
    messageCount: 15,
  },
];

const AdminChats = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Chat Monitoring</h1>
          <p className="text-muted-foreground mt-1">
            Monitor user conversations for quality control
          </p>
        </div>

        {/* Privacy Notice */}
        <div className="medical-card bg-accent/50 border-primary/20 flex items-start gap-3">
          <Shield className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-medium text-foreground">Privacy Notice</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Chat monitoring is for quality control purposes only. All conversations are
              confidential and protected under our privacy policy. Access is logged and
              restricted to authorized personnel.
            </p>
          </div>
        </div>

        {/* Chat List */}
        <div className="space-y-3">
          {mockChats.map((chat) => (
            <div
              key={chat.id}
              className="medical-card flex items-center gap-4 p-4"
            >
              <div className="w-12 h-12 rounded-full gradient-medical flex items-center justify-center text-primary-foreground font-medium">
                {chat.userAvatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-foreground">{chat.userName}</h3>
                  <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                    {chat.messageCount} messages
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate mt-1">
                  {chat.lastMessage}
                </p>
                <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" />
                  {chat.date}
                </span>
              </div>
              <span className="text-xs px-2 py-1 bg-muted rounded-lg text-muted-foreground">
                Read-only
              </span>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminChats;
