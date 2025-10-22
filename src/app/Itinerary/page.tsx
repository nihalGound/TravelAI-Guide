"use client";
import TravelPlanForm from "@/components/itinerary-form";
import StreamingItinerary from "@/components/stream-itinerary";
import { cn } from "@/lib/utils";
import { useState } from "react";

const Page = () => {
  const [formData, setFormData] = useState<{
    city: string;
    dates: { start: string; end: string };
    interests: string[];
  } | null>(null);

  const apiEndpoint = "/api/generate";

  const handleFormSubmit = (data: {
    city: string;
    dates: { start: string; end: string };
    interests: string[];
  }) => {
    setFormData(data);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8 z-20">
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            AI Travel Planner
          </h1>
          <p className="text-xl text-muted-foreground">
            Generate personalized itineraries
          </p>
        </header>

        {!formData ? (
          <TravelPlanForm onSubmit={handleFormSubmit} />
        ) : (
          <StreamingItinerary
            apiEndpoint={apiEndpoint}
            requestBody={formData}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
