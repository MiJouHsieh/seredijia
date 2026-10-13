import { useState, useEffect } from "react";
import { useAuth } from "src/context/AuthContext";
import { supabase } from "src/supabaseClient";
import { Link } from "react-router";

import { MonthlyCalendar } from "src/components/calendar/MonthlyCalendar";

//今天日期
function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function HistoryPage() {
  const [historyEntries, setHistoryEntries] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    () => new Date(),
  );
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    async function fetchHistoryEntry() {
      try {
        setIsLoading(true);
        //清除前一個月份的資料
        setHistoryEntries([]);

        const startDate = getDateKey(
          new Date(
            selectedMonth.getFullYear(),
            selectedMonth.getMonth(),
            1,
          ),
        );

        const endDate = getDateKey(
          new Date(
            selectedMonth.getFullYear(),
            selectedMonth.getMonth() + 1,
            1,
          ),
        );

        const { data, error } = await supabase
          .from("daily_checkins")
          .select("id, record_date, mood, mood_note, event_note")
          .eq("user_id", userId)
          .gte("record_date", startDate)
          .lt("record_date", endDate)
          .order("record_date", { ascending: false });

        if (error) throw error;

        setHistoryEntries(data ?? []);
      } catch (error) {
        console.error("讀取歷史紀錄失敗：", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistoryEntry();
  }, [userId, selectedMonth]);

  const selectedMonthKey = `${selectedMonth.getFullYear()}-${String(
    selectedMonth.getMonth() + 1,
  ).padStart(2, "0")}`;

  const currentDate = new Date();
  const isCurrentMonth =
    selectedMonth.getFullYear() === currentDate.getFullYear() &&
    selectedMonth.getMonth() === currentDate.getMonth();

  return (
    <main className="relative pt-12 page-style min-h-dvh">
      <div className="relative z-10 w-full px-4 py-10">
        <div className="mx-auto flex max-w-[500px] flex-col items-center gap-8 rounded-3xl md:max-w-[600px] md:px-6 lg:max-w-[800px]">
          <div
            className={`underline underline-offset-4 ${
              isCurrentMonth
                ? "visible"
                : "pointer-events-none invisible"
            }`}
          >
            <Link
              to="/weekly-review"
              className="flex justify-center font-medium transition-colors duration-200 hover:text-clayPeach dark:hover:text-peach text-dark dark:text-cream"
            >
              查看一週紀錄 →
            </Link>
          </div>

          <MonthlyCalendar
            monthlyEntries={historyEntries}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />

          {isLoading ? (
            <p className="text-sm">讀取紀錄中...</p>
          ) : (
            <div className="flex flex-col">
              <p className="p-2 text-sm">
                {selectedMonth.getMonth() + 1} 月已留下{" "}
                {historyEntries.length > 0
                  ? historyEntries.length
                  : 0}{" "}
                天紀錄
              </p>
              <Link
                to={`/monthly-review/${selectedMonthKey}`}
                aria-label="Seredijia 月紀錄頁"
                className="font-medium text-center transition-colors duration-200 border-b-4 cursor-pointer hover:text-clayPeach hover:border-clayPeach dark:border-cream200 border-milkTeaDark dark:hover:text-peach dark:hover:border-peach text-dark dark:text-cream"
              >
                查看 {selectedMonth.getMonth() + 1} 月回顧 →
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
