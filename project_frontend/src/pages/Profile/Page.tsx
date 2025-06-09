import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import 'react-calendar-heatmap/dist/styles.css';
import { parse, format } from 'date-fns';
import UserOverviewCard from "./UserOverviewCard";
import RatingChart from "./RatingChart";
import DifficultyBarChart from "./DifficultyBarChart";
import ActivityCalendar from "./ActivityCalendar";
import GoBackButton from "@/components/GoBackButton";

const formatDate = (date: Date) => date.toISOString().split("T")[0];

export default function ProfilePage() {
    //const [activeTab, setActiveTab] = useState("current");
    interface User {
      firstName: string;
      lastName: string;
      email: string;
      nationality: string;
      experience: number;
      coins: number;
      phoneNumber: string;
      profilePicture: string;
    }

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
      const token = localStorage.getItem("token");
      console.log("Token en localStorage:", token);

      if (!token) {
        console.error("No hay token en localStorage");
        return;
      }
    
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Usuario autenticado:", res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.error("Error al obtener el perfil", err.response?.data || err.message);
      });
    }, []);

    const [xpHistory, setXpHistory] = useState<{ date: string; experience: number }[]>([]);

    useEffect(() => {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;

      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/xp-history/employee/${userId}`)
        .then((res) => {
          const formatted = res.data.map((entry: any) => ({
            date: new Date(entry.date).toLocaleDateString(), // e.g., "5/30/2025"
            experience: entry.experience,
          }));
          setXpHistory(formatted);
        })
        .catch((err) => {
          console.error("Error fetching XP history", err);
        });
    }, []);

    const [ratingHistory, setRatingHistory] = useState<string[]>([]);

    useEffect(() => {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;

      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/solutions/employee/${userId}`)
        .then((res) => {
          const sortedSolutions = res.data
            .filter((sol: any) => sol.status === "Accepted")
            .sort((a: any, b: any) => new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime());

            const datesOnly = sortedSolutions.map((sol: any) =>
              new Date(sol.submissionDate).toLocaleDateString()
            );

          setRatingHistory(datesOnly);
        })
        .catch((err) => {
          console.error("Error fetching rating history", err);
        });
    }, []);

    const [difficultyData, setDifficultyData] = useState<{ Easy: number; Medium: number; Hard: number } | null>(null);

    useEffect(() => {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/employees/solved-difficulty/${userId}`)
        .then((res) => {
          setDifficultyData(res.data);
        })
        .catch((err) => {
          console.error("Error fetching difficulty data", err);
        });
    }, []);
    //const chartHeightPx = 90;
    console.log("this is the data: ", difficultyData);
    //const allZero =
    difficultyData !== null &&
    Object.values(difficultyData).every((v) => v === 0);

    const dateCounts: { [key: string]: number } = {};

    ratingHistory.forEach((dateStr) => {
      const parsedDate = parse(dateStr, 'M/d/yyyy', new Date());
      const formattedDate = format(parsedDate, 'yyyy-MM-dd');
      dateCounts[formattedDate] = (dateCounts[formattedDate] || 0) + 1;
    });

    //const currentYear = new Date().getFullYear();
    
    // Extract years
  const years = useMemo(() => {
    const yearSet = new Set(
      ratingHistory.map((dateStr) => new Date(dateStr).getFullYear())
    );
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [ratingHistory]);

  const [selectedYear, setSelectedYear] = useState<number>(
    years[0] ?? new Date().getFullYear()
  );

  // Filter heatmap data for selected year
  const heatmapValues = useMemo(() => {
    const counts: Record<string, number> = {};

    ratingHistory.forEach((dateStr) => {
      const date = new Date(dateStr);
      if (date.getFullYear() === selectedYear) {
        const key = formatDate(date);
        counts[key] = (counts[key] || 0) + 1;
      }
    });

    return Object.entries(counts).map(([date, count]) => ({ date, count }));
  }, [ratingHistory, selectedYear]);
  const startDate = `${selectedYear}-01-01`;
  const endDate = `${selectedYear}-12-31`;
    
    return (
      <div className="min-h-screen bg-[#363B41] text-black">
        <div className="container mx-auto px-4 py-6">
          <GoBackButton to="/home" />
  
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <UserOverviewCard user={user} />
            </div>

            {/* Right column - Charts and stats */}
            <div className="space-y-6">
              <RatingChart xpHistory={xpHistory} />

              <DifficultyBarChart difficultyData={difficultyData} />

              <ActivityCalendar
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                years={years}
                startDate={startDate}
                endDate={endDate}
                heatmapValues={heatmapValues}
              />
          </div>
        </div>
      </div>
    </div>
  )
}