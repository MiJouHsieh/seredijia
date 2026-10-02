import { useState, useEffect } from "react";
import { useAuth } from "src/context/AuthContext";
import { supabase } from "src/supabaseClient";
import { Link } from "react-router";

function HistoryItem({ label, mood, url, isHeader = false }) {
  const textClass = isHeader
    ? "font-medium dark:text-cream200 text-dark"
    : "dark:text-cream100 text-dark/60";

  return (
    <div className="grid items-center grid-cols-3 gap-4 p-2 border-b border-softPeach">
      <span className={textClass}>{label}</span>
      <span className={`text-center ${textClass}`}>{mood}</span>
      <div className="text-right">
        {isHeader ? (
          <span className={textClass}>紀錄入口</span>
        ) : (
          <Link
            to={url}
            className="font-light transition-colors duration-200 hover:text-peach dark:text-cream100 dark:hover:text-peach text-dark/60"
          >
            查看 →
          </Link>
        )}
      </div>
    </div>
  );
}

function EmptyHistoryState({ isCurrentMonth, today }) {
  return (
    <div className="flex flex-col items-center w-full gap-14">
      <p className="text-sm text-center">這個月還沒有留下紀錄</p>

      {isCurrentMonth && (
        <Link
          to={`/records/${today}`}
          className="font-medium transition-colors duration-200 border-b-4 hover:text-clayPeach hover:border-peach hover:dark:border-peach dark:border-cream200 border-milkTeaDark"
        >
          開始今日紀錄
        </Link>
      )}
    </div>
  );
}

//今天日期
function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function HistoryPage() {
  const [historyEntries, setHistoryEntries] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const userId = user?.id;

  function handlePrevMonth() {
    setSelectedMonth((prev) => {
      return new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
    });
  }
  function handleNextMonth() {
    if (isCurrentMonth) return;

    setSelectedMonth((prev) => {
      return new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
    });
  }
  // 顯示
  const displayMonth = `${selectedMonth.getFullYear()} 年 ${
    selectedMonth.getMonth() + 1
  } 月`;

  const currentDate = new Date();
  const today = getDateKey(currentDate);

  const isCurrentMonth =
    selectedMonth.getFullYear() === currentDate.getFullYear() &&
    selectedMonth.getMonth() === currentDate.getMonth();

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
          .select("id, record_date, mood")
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

  return (
    <main className="relative pt-12 page-style min-h-dvh">
      <div className="relative z-10 w-full px-4 py-10">
        <div className="mx-auto flex max-w-[500px] flex-col items-center gap-8 rounded-3xl md:max-w-[600px] md:px-6 lg:max-w-[800px]">
          <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center justify-between gap-3 pt-6">
            <button
              onClick={handlePrevMonth}
              className="p-2 text-sm border rounded-md border-peach hover:bg-peach/20 justify-self-start"
            >
              ← 上個月
            </button>
            <h1 className="text-center">{displayMonth}</h1>
            <button
              onClick={handleNextMonth}
              disabled={isCurrentMonth}
              className="p-2 text-sm border rounded-md border-peach hover:bg-peach/20 justify-self-end disabled:cursor-not-allowed disabled:opacity-40"
            >
              下個月 →
            </button>
          </div>
          {isLoading ? (
            <p className="text-sm">讀取紀錄中...</p>
          ) : historyEntries.length > 0 ? (
            <>
              <p className="text-sm">
                這個月已留下 {historyEntries.length} 天紀錄
              </p>

              <div className="w-full p-6 space-y-3 text-sm rounded-3xl bg-cream/80 dark:bg-cream/10">
                <HistoryItem label="日期" mood="心情" isHeader />
                <ul>
                  {historyEntries.map((item) => {
                    return (
                      <HistoryItem
                        key={item.id}
                        label={item.record_date}
                        mood={item.mood}
                        url={`/records/${item.record_date}`}
                      />
                    );
                  })}
                </ul>
              </div>
            </>
          ) : (
            <EmptyHistoryState
              isCurrentMonth={isCurrentMonth}
              today={today}
            />
          )}
        </div>
      </div>
    </main>
  );
}
