"use client";

import { AltArrowLeft, AltArrowRight } from "@solar-icons/react";

type Props = {
  onWindowChange: (direction: "next" | "prev") => void;
  windowMin: number;
  windowMax: number;
  minWeek: number;
  maxWeek: number;
  sortBy: "offense" | "defense";
  onSortByChange: (sortBy: "offense" | "defense") => void;
};

export default function TableControls({
  onWindowChange,
  windowMin,
  windowMax,
  minWeek,
  maxWeek,
  sortBy,
  onSortByChange,
}: Props) {
  return (
    <div>
      <div className="flex flex-wrap gap-y-6 items-center justify-between my-4">
        <div className="border border-gray-300 rounded-lg p-0.5 flex">
          <button
            type="button"
            className={`px-3 py-1 rounded-md text-sm ${
              sortBy === "offense" ? "bg-gray-200" : ""
            }`}
            onClick={() => onSortByChange("offense")}
          >
            Sort by Offense
          </button>
          <button
            type="button"
            className={`px-3 py-1 rounded-md text-sm ${
              sortBy === "defense" ? "bg-gray-200" : ""
            }`}
            onClick={() => onSortByChange("defense")}
          >
            Sort by Defense
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            disabled={windowMin <= minWeek}
            className="px-3 py-1 text-sm border rounded-md disabled:text-gray-400"
            onClick={() => onWindowChange("prev")}
          >
            <div className="flex items-center gap-2">
              <AltArrowLeft />
              <span>Prev GW</span>
            </div>
          </button>
          <span className="text-sm text-gray-600">
            Showing GW {windowMin}-{windowMax}
          </span>
          <button
            type="button"
            disabled={windowMax >= maxWeek}
            className="px-3 py-1 text-sm border rounded-md disabled:text-gray-400"
            onClick={() => onWindowChange("next")}
          >
            <div className="flex items-center gap-2">
              <span>Next GW</span>
              <AltArrowRight />
            </div>
          </button>
        </div>
      </div>

      <Legend />
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <span className="inline-block w-4 h-4 rounded-sm bg-lime-300 border border-lime-400" />
        <span>Easy</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block w-4 h-4 rounded-sm bg-neutral-100 border border-gray-300" />
        <span>Medium</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block w-4 h-4 rounded-sm bg-red-300 border border-red-400" />
        <span>Hard</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block w-4 h-4 rounded-sm bg-neutral-50 border border-gray-200" />
        <span>No fixture / N/A</span>
      </div>
    </div>
  );
}
