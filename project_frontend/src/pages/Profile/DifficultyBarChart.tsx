import { Card } from "@/components/card";

type DifficultyData = {
  Easy: number;
  Medium: number;
  Hard: number;
};

type Props = {
  difficultyData: DifficultyData | null;
};

const chartHeightPx = 90;

const DifficultyBarChart: React.FC<Props> = ({ difficultyData }) => {
  const allZero =
    difficultyData !== null &&
    Object.values(difficultyData).every((v) => v === 0);

  return (
    <Card className="bg-[#f4f4f5] p-6 rounded-2xl shadow-md border border-gray-300 text-gray-800">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Problem Ratings</h2>
        <p className="text-sm text-gray-600">
          Distribution of solved problems by difficulty level.
        </p>
      </div>

      <div className="relative h-[140px] w-full rounded-xl bg-white border border-gray-200 shadow-inner p-4">
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
                    className={`w-full rounded-t ${barColor} cursor-default transition-all duration-300`}
                    style={{ height: `${height}px` }}
                  ></div>
                  <div className="absolute bottom-[110%] mb-1 hidden group-hover:block px-2 py-1 text-xs text-white bg-black rounded">
                    {value} {value === 1 ? "problem" : "problems"}
                  </div>
                  <span className="mt-2 text-sm text-gray-700">{level}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-gray-500">
            No difficulty data available.
          </div>
        )}
      </div>
    </Card>
  );
};

export default DifficultyBarChart;
