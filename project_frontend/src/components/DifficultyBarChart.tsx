import React, { useEffect, useState } from "react";
import axios from "axios";

const DifficultySummaryCard = () => {
  const [difficultyData, setDifficultyData] = useState({ Easy: 0, Medium: 0, Hard: 0 });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/employees/difficulty-stats`)
      .then((res) => setDifficultyData(res.data))
      .catch((err) => console.error("Failed to fetch difficulty stats:", err));
  }, []);

  const chartHeightPx = 100;
  const allZero = Object.values(difficultyData).every((val) => val === 0);

  return (
    <div className="bg-gray-800 rounded-2xl shadow p-4">
      <div className="mb-2 flex items-center">
        <h3 className="text-lg font-semibold mb-4">Problem Solves</h3>
      </div>
      <div className="relative h-[120px] w-full">
        {difficultyData && !allZero ? (
          <div className="flex h-full w-full items-end justify-between">
            {["Easy", "Medium", "Hard"].map((level) => {
              const value = difficultyData[level as keyof typeof difficultyData];
              const max = Math.max(...Object.values(difficultyData));
              const height = max === 0 ? 0 : (value / max) * chartHeightPx;

              const barColor =
                level === "Easy"
                  ? "bg-green-500"
                  : level === "Medium"
                  ? "bg-yellow-500"
                  : "bg-red-500";

              return (
                <div
                  key={level}
                  className="flex flex-col items-center justify-end w-[30%] group relative"
                >
                  <div
                    className={`w-full rounded-t ${barColor} cursor-default`}
                    style={{ height: `${height}px` }}
                  ></div>
                  {/* Tooltip */}
                  <div className="absolute bottom-[110%] mb-1 hidden group-hover:block px-2 py-1 text-xs text-white bg-black rounded">
                    {value} {value === 1 ? "problem" : "problems"}
                  </div>
                  <span className="mt-2 text-sm">{level}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-600 text-sm">
            No difficulty data available.
          </div>
        )}
      </div>
    </div>
  );
};

export default DifficultySummaryCard;
