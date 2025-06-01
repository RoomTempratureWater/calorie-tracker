
"use client";

import { useEffect, useState } from "react";
import { useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type LogEntry = {
  id: number;
  title: string;
  timestamp: string;
  protein: number; // grams
  carbs: number;   // grams
  fat: number;     // grams
};

export default function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);


  // NOTE: aditya -> if youre working on this, use fetchWithDebounce method to call the api while chaning this dummy api call.
  useEffect(() => {
    const dummyLogs: LogEntry[] = [
      {
        id: 1,
        title: "🍗 Chicken & Rice (Lunch)",
        timestamp: "2025-05-31 12:45 PM",
        protein: 45,
        carbs: 60,
        fat: 10,
      },
      {
        id: 2,
        title: "🍌 2 Bananas (Snack)",
        timestamp: "2025-05-31 4:00 PM",
        protein: 2,
        carbs: 48,
        fat: 0,
      },
      {
        id: 3,
        title: "🥩 Steak & Veggies (Dinner)",
        timestamp: "2025-05-31 8:30 PM",
        protein: 50,
        carbs: 20,
        fat: 25,
      },
      {
        id: 4,
        title: "🧋 Protein Shake",
        timestamp: "2025-05-31 9:45 PM",
        protein: 30,
        carbs: 5,
        fat: 2,
      },
      {
        id: 4,
        title: "🧋 Protein Shake",
        timestamp: "2025-05-31 9:45 PM",
        protein: 30,
        carbs: 5,
        fat: 2,
      },
      {
        id: 4,
        title: "🧋 Protein Shake",
        timestamp: "2025-05-31 9:45 PM",
        protein: 30,
        carbs: 5,
        fat: 2,
      },
    ];

    setTimeout(() => setLogs(dummyLogs), 600);
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);


  const handleDelete = (id: number) => {
    setLogs((prev) => prev.filter((log) => log.id !== id));
  };

  return (
    <div className="flex flex-col items-center justify-start h-full px-4 py-10 bg-[var(--background)] text-[var(--foreground)]">
      <h1 className="text-3xl font-bold mb-6">Activity Logs</h1>

      <div className="w-full max-w-2xl space-y-4 overflow-y-auto">
        {logs.length === 0 ? (
          <p className="text-muted-foreground text-center">Loading logs...</p>
        ) : (
          logs.map((log) => (
            <Card
              key={log.id}
              className="relative bg-[var(--sidebar)] text-[var(--sidebar-foreground)] border border-[var(--sidebar-border)] shadow-sm"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base font-semibold">{log.title}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      {log.timestamp}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
                    onClick={() => handleDelete(log.id)}
                    aria-label="Delete log"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="grid grid-cols-3 gap-4 text-sm pt-1 text-muted-foreground">
                <div className="text-center">
                  <span className="block text-xs text-muted">Protein</span>
                  <span className="text-base font-semibold text-[var(--sidebar-foreground)]">
                    {log.protein}g
                  </span>
                </div>
                <div className="text-center">
                  <span className="block text-xs text-muted">Carbs</span>
                  <span className="text-base font-semibold text-[var(--sidebar-foreground)]">
                    {log.carbs}g
                  </span>
                </div>
                <div className="text-center">
                  <span className="block text-xs text-muted">Fat</span>
                  <span className="text-base font-semibold text-[var(--sidebar-foreground)]">
                    {log.fat}g
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
