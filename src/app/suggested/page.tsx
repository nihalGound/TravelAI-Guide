"use client";
import { useEffect, useState } from "react";

interface Tour {
  _id: string;
  city: string;
  image: string;
  activities: string[];
  details: string[];
}

export default function SuggestedToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch("/api/suggested");
        const data = await response.json();
        setTours(data.tours);
      } catch (error) {
        console.error("Error fetching suggested tours:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading tours...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Suggested Tours</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <div
            key={tour._id || tour.city}
            className="border rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={tour.image}
              alt={tour.city}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{tour.city}</h2>
              <p className="mb-2 font-medium">Activities:</p>
              <ul className="list-disc list-inside mb-2">
                {tour.activities.map((act, idx) => (
                  <li key={idx}>{act}</li>
                ))}
              </ul>
              <details>
                <summary className="cursor-pointer font-medium text-blue-600">
                  View 7-day Plan
                </summary>
                <ul className="list-decimal list-inside mt-2">
                  {tour.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </details>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
