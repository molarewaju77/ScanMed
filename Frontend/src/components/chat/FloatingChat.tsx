import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ChatInterface } from "./ChatInterface";

export function FloatingChat() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button
                    size="icon"
                    className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl z-50 animate-in fade-in zoom-in duration-300 hover:scale-105 transition-transform gradient-medical"
                >
                    <MessageSquare className="h-7 w-7" />
                    <span className="sr-only">Open Chat</span>
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] p-0 flex flex-col">
                <div className="h-full flex flex-col">
                    <ChatInterface embedded={true} className="h-full" />
                </div>
            </SheetContent>
        </Sheet>
    );
}
