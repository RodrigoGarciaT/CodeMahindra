import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card } from "@/components/card"; // Adjust the path if needed

type Props = {
  xpHistory: { date: string; experience: number }[];
};

const RatingChart: React.FC<Props> = ({ xpHistory }) => {
  const hasData = xpHistory && xpHistory.length > 0;

  return (
    <Card className="bg-[#f4f4f5] p-6 rounded-2xl shadow-md border border-gray-300 text-gray-800">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Rating Chart</h2>
        <p className="text-sm text-gray-600">
          This chart shows the experience progression over time.
        </p>
      </div>

      {hasData ? (
        <div className="h-[200px] w-full rounded-xl bg-white border border-gray-200 shadow-inner p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={xpHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="experience"
                stroke="#ef4444"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[200px] flex items-center justify-center rounded-xl bg-white border border-gray-200 shadow-inner text-sm text-gray-500">
          No data available to display the chart.
        </div>
      )}
    </Card>
  );
};

export default RatingChart;
