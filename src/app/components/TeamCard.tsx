"use client";

import Image from "next/image";
import type { TeamData } from "@/lib/types/teams";

interface TeamCardProps {
  team: TeamData;
}

export default function TeamCard({ team }: TeamCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col items-center text-center">
        {/* Team Logo */}
        <div className="mb-4 w-20 h-20 relative">
          <Image
            src={team.logo_path}
            alt={`${team.name} logo`}
            fill
            className="object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        </div>

        {/* Team Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-1">{team.name}</h3>

        {/* Short Name */}
        <p className="text-sm text-gray-600 mb-4">{team.short_name}</p>

        {/* Ratings */}
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded">
            <span className="text-sm font-medium text-gray-700">
              Offensive:
            </span>
            <span className="text-sm font-semibold text-blue-600">
              {team.off_rating.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded">
            <span className="text-sm font-medium text-gray-700">
              Defensive:
            </span>
            <span className="text-sm font-semibold text-green-600">
              {team.def_rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
