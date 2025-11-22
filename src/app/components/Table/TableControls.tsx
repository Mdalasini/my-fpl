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
  gameWeekRange: number;
  onGameWeekRangeChange: (gameWeekRange: number) => void;
};

export default function TableControls({
  onWindowChange,
  windowMin,
  windowMax,
  minWeek,
  maxWeek,
  sortBy,
  onSortByChange,
  gameWeekRange,
  onGameWeekRangeChange,
}: Props) {
  const rangeOptions = [3, 4, 5, 6];
  const sortOptions: ("offense" | "defense")[] = ["offense", "defense"];

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Sort By:</span>
        <div
          role="group"
          aria-label="Select sort by"
          className="inline-flex rounded-lg border border-gray-300 overflow-hidden"
        >
          {sortOptions.map((value, idx) => {
            const isActive = sortBy === value;
            return (
              <button
                key={value}
                type="button"
                disabled={isActive}
                className={[
                  "px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-1",
                  "disabled:cursor-not-allowed disabled:opacity-100 text-gray-800",
                  isActive ? "bg-gray-200" : "bg-white hover:bg-gray-100",
                  idx !== sortOptions.length - 1
                    ? "border-r border-gray-300"
                    : "",
                ].join(" ")}
                onClick={() => onSortByChange(value)}
              >
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 mb-6 flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Select Range:</span>
        <fieldset
          aria-label="Select gameweek range"
          className="inline-flex rounded-lg border border-gray-300 overflow-hidden"
        >
          {rangeOptions.map((n, idx) => {
            const isActive = gameWeekRange === n;
            return (
              <button
                key={n}
                type="button"
                aria-pressed={isActive}
                disabled={isActive}
                onClick={() => onGameWeekRangeChange(n)}
                className={[
                  "px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-1",
                  "disabled:cursor-not-allowed disabled:opacity-100 text-gray-800",
                  isActive ? "bg-gray-200" : "bg-white hover:bg-gray-100",
                  idx !== rangeOptions.length - 1
                    ? "border-r border-gray-300"
                    : "",
                ].join(" ")}
              >
                +{n}
              </button>
            );
          })}
        </fieldset>
      </div>

      <div className="flex items-center gap-4 mt-6">
        <button
          type="button"
          disabled={windowMin <= minWeek}
          className="inline-flex rounded-lg border border-gray-300 overflow-hidden px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-100 text-gray-800 bg-white hover:bg-gray-100"
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
          className="inline-flex rounded-lg border border-gray-300 overflow-hidden px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-100 text-gray-800 bg-white hover:bg-gray-100"
          onClick={() => onWindowChange("next")}
        >
          <div className="flex items-center gap-2">
            <span>Next GW</span>
            <AltArrowRight />
          </div>
        </button>
      </div>

      <Legend />
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 mt-6">
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
