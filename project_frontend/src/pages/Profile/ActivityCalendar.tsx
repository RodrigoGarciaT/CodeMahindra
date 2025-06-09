import { Card } from "@/components/card";
import CalendarHeatmap from "react-calendar-heatmap";

type Props = {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  years: number[];
  heatmapValues: { date: string; count: number }[];
  startDate: string;
  endDate: string;
};

const ActivityCalendar: React.FC<Props> = ({
  selectedYear,
  setSelectedYear,
  years,
  heatmapValues,
  startDate,
  endDate,
}) => {
  return (
    <Card className="bg-[#f4f4f5] p-6 rounded-2xl shadow-md border border-gray-300 text-gray-800">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Activity Calendar</h2>
          <p className="text-sm text-gray-600">
            Your coding activity throughout the year.
          </p>
        </div>
        <select
          className="text-sm px-3 py-2 border border-gray-300 rounded-md bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-red-500"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white border border-gray-200 shadow-inner p-4">
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={heatmapValues}
          classForValue={(value) => {
            if (!value || value.count === 0) return "fill-gray-200";
            if (value.count === 1) return "fill-green-200";
            if (value.count === 2) return "fill-green-400";
            return "fill-green-600";
          }}
          titleForValue={(value) =>
            value ? `${value.date}: ${value.count} submission(s)` : "No submissions"
          }
        />
      </div>
    </Card>
  );
};

export default ActivityCalendar;
