"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DayData {
  dayNumber: number;
  title: string;
  date?: string;
  place?: string;
  activities?: string;
}

const DayCard = ({ dayNumber, title, date, place, activities }: DayData) => (
  <Card className="p-6 space-y-3">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
        {dayNumber}
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-semibold">{title}</h3>
        {date && <p className="text-sm text-muted-foreground">{date}</p>}
      </div>
    </div>
    {place && (
      <div>
        <span className="font-medium text-primary">Place: </span>
        <span>{place}</span>
      </div>
    )}
    {activities && (
      <div>
        <span className="font-medium text-primary">Activities: </span>
        <span>{activities}</span>
      </div>
    )}
  </Card>
);

interface StreamingItineraryProps {
  apiEndpoint: string;
  requestBody: {
    city: string;
    dates: { start: string; end: string };
    interests: string[];
  };
}

const StreamingItinerary = ({
  apiEndpoint,
  requestBody,
}: StreamingItineraryProps) => {
  const [heading, setHeading] = useState("");
  const [days, setDays] = useState<DayData[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [status, setStatus] = useState("Analyzing your preferences...");
  const [error, setError] = useState<string | null>(null);

  const currentDayRef = useRef<DayData | null>(null);
  const processedDaysRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const messages = [
      "Analyzing your preferences...",
      "Searching for best destinations...",
      "Planning your perfect itinerary...",
      "Generating personalized recommendations...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (isStreaming) {
        i = (i + 1) % messages.length;
        setStatus(messages[i]);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isStreaming]);

  const finalizeDayCard = () => {
    if (
      currentDayRef.current &&
      currentDayRef.current.dayNumber !== undefined &&
      currentDayRef.current.title &&
      !processedDaysRef.current.has(currentDayRef.current.dayNumber)
    ) {
      const dayToAdd = { ...currentDayRef.current };
      processedDaysRef.current.add(dayToAdd.dayNumber);
      setDays((prev) => [...prev, dayToAdd]);
    }
  };

  const streamResponse = async () => {
    setIsStreaming(true);
    setError(null);
    setDays([]);
    setHeading("");
    processedDaysRef.current = new Set();
    currentDayRef.current = null;

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) throw new Error("No response stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");

        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          if (trimmed.startsWith("Heading:")) {
            setHeading(trimmed.replace("Heading:", "").trim());
            continue;
          }

          const dayMatch = trimmed.match(
            /^Day (\d+):\s*(.+?)\s*\(Date:\s*([^)]+)\)$/
          );

          if (dayMatch) {
            finalizeDayCard();
            currentDayRef.current = {
              dayNumber: parseInt(dayMatch[1], 10),
              title: dayMatch[2].trim(),
              date: dayMatch[3].trim(),
            };
            continue;
          }

          if (currentDayRef.current) {
            if (trimmed.startsWith("Place:")) {
              currentDayRef.current.place = trimmed
                .replace("Place:", "")
                .trim();
            } else if (trimmed.startsWith("activities:")) {
              currentDayRef.current.activities = trimmed
                .replace("activities:", "")
                .trim();
            }
          }
        }
      }

      finalizeDayCard();

      setIsStreaming(false);
      setStatus("Your itinerary is ready ✨");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error occurred");
      setIsStreaming(false);
      setStatus("An error occurred");
    }
  };

  useEffect(() => {
    streamResponse();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-20 p-4">
      {error && (
        <Card className="p-4 border-red-500 bg-red-50 text-red-700">
          <strong>Error:</strong> {error}
        </Card>
      )}

      {heading && (
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          {heading}
        </motion.h1>
      )}

      {isStreaming && days.length === 0 && (
        <div className="flex flex-col items-center py-6">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
          <p className="text-gray-600 animate-pulse">{status}</p>
        </div>
      )}

      <AnimatePresence mode="popLayout">
        {days.map((day) => (
          <motion.div
            key={`day-${day.dayNumber}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            layout
          >
            <DayCard
              dayNumber={day.dayNumber}
              title={day.title}
              date={day.date}
              place={day.place}
              activities={day.activities}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {isStreaming && days.length > 0 && (
        <div className="flex items-center justify-center gap-2 text-gray-600 mt-6">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="animate-pulse">Generating next day...</span>
        </div>
      )}

      {!isStreaming && days.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-green-600 font-medium"
        >
          ✨ {status}
        </motion.div>
      )}
    </div>
  );
};

export default StreamingItinerary;
