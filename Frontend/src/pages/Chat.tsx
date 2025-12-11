import { MainLayout } from "@/components/layout/MainLayout";
import { ChatInterface } from "@/components/chat/ChatInterface";

const Chat = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            AI Health Assistant
          </h1>
          <p className="text-muted-foreground mt-1">
            Ask questions about your health, scan results, or symptoms
          </p>
        </div>
        <ChatInterface embedded={true} />
      </div>
    </MainLayout>
  );
};

export default Chat;
