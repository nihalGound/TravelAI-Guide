"use client";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

function Page({}: Props) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background from-blue-50 to-white">
      <header className="relative overflow-hidden">
        <nav className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-primary-800">
              TravelAI Guide
            </h1>
          </div>

          {/* Links */}
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-8">
            <a href="/Itinerary">
              <div className="group hover:border-gray-500 border-transparent border-2 hover:shadow-xs px-2 py-1 rounded-md transition-all duration-200">
                <span className="text-amber-600 group-hover:text-white transition-colors duration-200">
                  Get Plan with AI
                </span>
              </div>
            </a>
            <a
              href="/suggested"
              className="font-medium hover:text-primary-600 transition-colors"
            >
              <div className="px-2 py-1 rounded-md transition-all duration-200">
                <span className="">Suggested Tours</span>
              </div>
            </a>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
              Your Perfect Travel Plan in{" "}
              <span className="text-amber-600">Seconds</span>
            </h2>
            <p className="mt-6 text-lg text-gray-400 max-w-xl">
              Create personalized day-by-day travel itineraries powered by AI.
              Discover hidden gems and must-see attractions tailored to your
              interests.
            </p>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
                alt="Beautiful travel destination"
                className="rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500 z-10 relative"
              />
              <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-primary-100 rounded-full opacity-70 z-0"></div>
              <div className="absolute -top-6 -right-6 w-40 h-40 bg-yellow-100 rounded-full opacity-70 z-0"></div>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-16 left-0 right-0 h-24 bg-white transform skew-y-3 z-10"></div>
      </header>
    </div>
  );
}

export default Page;
