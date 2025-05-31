
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import MarkdownRenderer from "@/components/markdown";
import { useRef } from "react";
type Message = {
  role: "user" | "bot";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const fakeChatHistory: Message[] = [
      { role: "You", content: "what should i eat for dinner?" },
      { role: "You", content: "what should i eat for dinner asd awd awd awd awd awd asda djhaw?" },
      { role: "You", content: "what should i eat for dinner asdjkhawjhdjahdhjawgdhjagdhjgahjdgawjhdgad?" },
      { role: "Fitness Agent", content: "to fit your macros for today, i'd suggest eating chicken and rice" },
      { role: "You", content: "ok ill eat chicken and rice!, ajhdjwahdjkshadjkahwjkhdjashdka \n asjdghajwhgdahgwhdgashdgajwhgdjhagdhawghdjgahjgwajhgdhjawgjd ***asdawd*** ajahsd" },
      { role: "Fitness Agent", content: `## Super cool article about something \nTo make headers for the different sections \n\n of the article, type\n ### Materials \nyou'll need...` }
    ];
    setMessages(fakeChatHistory);
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex h-screen">
     

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 max-w-3xl mx-auto w-full bg-[var(--background)] text-[var(--foreground)]">
        {/* Chat Header */}
        <div className="border-b border-[var(--border)] p-4 text-center">
          <h1 className="text-xl font-semibold">Fitness Agent</h1>
          <p className="text-sm text-muted-foreground">
            ChatGPT for food intake tracking and analysis!
          </p>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-2 overflow-y-auto">
          <div className="space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "You" ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-[80%]">
                  <Card
                    className={`py-0 gap-1 border-0 !bg-transparent`}>
                    <CardHeader className={`gap-0 -mx-1 !border-0 !shadow-none !bg-transparent italic font-semibold ${msg.role === "You" ? "justify-end" : "justify-start"}`}>{msg.role}
                    </CardHeader>
                   
                    <CardContent className={` break-words whitespace-pre-wrap border rounded-lg ${
                        msg.role === "You" 
                        ? "justify-end bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]" 
                        : "justify-start bg-[var(--sidebar)] text-[var(--sidebar-foreground)]"
                    }`}>
                      <MarkdownRenderer content={msg.content} />
                    </CardContent>
                  </Card>
                </div>
              <div ref={bottomRef} />
              </div>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-[var(--border)] p-4">
          
          <div className="flex gap-2 max-w-2xl mx-auto">
            <Input
              placeholder="Type your message..."
              className="flex-1 bg-[var(--input)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
            />
            <Button className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-opacity-80">
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
