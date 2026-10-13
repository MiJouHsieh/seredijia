import { useState, useEffect } from "react";
import { useAuth } from "src/context/AuthContext";
import { supabase } from "src/supabaseClient";
import { Link, useParams } from "react-router";

import { moodOptions } from "src/constants/moodOptions";
  
function EmptyHistoryState({ isCurrentMonth, today }) {
  return (
    <div className="flex flex-col items-center w-full gap-14">
      {isCurrentMonth && (
        <>
          <p className="text-sm text-center">
            這個月還沒有留下紀錄
          </p>
          <Link
            to={`/records/${today}`}
            className="font-medium transition-colors duration-200 border-b-4 hover:text-clayPeach hover:border-peach hover:dark:border-peach dark:border-cream200 border-milkTeaDark"
          >
            開始今日紀錄
          </Link>
        </>
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

function MoodStatItem({ emoji, label, count }) {
  return (
    <div className="flex items-center justify-between p-2 border-b border-softPeach dark:border-softPeach/20">
      <div className="flex items-center gap-3">
        <span>{emoji}</span>
        <span className="dark:text-cream100 text-dark/60">
          {label}
        </span>
      </div>

      <span className="font-medium dark:text-cream200 text-dark">
        {count} 天
      </span>
    </div>
  );
}

export function MonthlyReviewPage() {
  const { user } = useAuth();
  const userId = user?.id;

  const { month } = useParams();

  const [monthlyEntries, setMonthlyEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //月份
  const [year, monthNumber] = month.split("-");

  const selectedMonth = new Date(
    Number(year),
    Number(monthNumber) - 1,
    1,
  );

  // 心情統計
  const moodStats = {
    happy: 0,
    calm: 0,
    okay: 0,
    sad: 0,
    overwhelmed: 0,
  };
  monthlyEntries.forEach((entry) => {
    if (entry.mood) {
      moodStats[entry.mood] += 1;
    }
  });

  // 用藥統計
  const medicationStats = {
    daytime: {
      taken: 0,
      notTaken: 0,
    },
    nighttime: {
      taken: 0,
      notTaken: 0,
    },
    sleep: {
      taken: 0,
      missed: 0,
      notNeeded: 0,
    },
  };
  monthlyEntries.forEach((entry) => {
    if (entry.daytime_medication === true) {
      medicationStats.daytime.taken += 1;
    } else if (entry.daytime_medication === false) {
      medicationStats.daytime.notTaken += 1;
    }

    if (entry.nighttime_medication === true) {
      medicationStats.nighttime.taken += 1;
    } else if (entry.nighttime_medication === false) {
      medicationStats.nighttime.notTaken += 1;
    }

    const sleepStatus = entry.sleep_medication_status;
    if (Object.hasOwn(medicationStats.sleep, sleepStatus)) {
      medicationStats.sleep[sleepStatus] += 1;
    }
  });

  // 飲食統計
  const mealStats = {
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  };

  monthlyEntries.forEach((entry) => {
    if (entry.breakfast === true) {
      mealStats.breakfast += 1;
    }
    if (entry.lunch === true) {
      mealStats.lunch += 1;
    }
    if (entry.dinner === true) {
      mealStats.dinner += 1;
    }
  });

  // 事件紀錄的日期
  const eventEntries = monthlyEntries.filter((entry) =>
    entry.event_note?.trim(),
  );

  const currentDate = new Date();
  const today = getDateKey(currentDate);

  const isCurrentMonth =
    selectedMonth.getFullYear() === currentDate.getFullYear() &&
    selectedMonth.getMonth() === currentDate.getMonth();

  useEffect(() => {
    if (!userId) return;

    async function fetchMonthEntry() {
      try {
        setIsLoading(true);
        //清除前一個月份的資料
        setMonthlyEntries([]);

        const [year, monthNumber] = month.split("-");

        const startDate = getDateKey(
          new Date(Number(year), Number(monthNumber) - 1, 1),
        );

        const endDate = getDateKey(
          new Date(Number(year), Number(monthNumber), 1),
        );

        const { data, error } = await supabase
          .from("daily_checkins")
          .select(
            "id, record_date, mood, daytime_medication, nighttime_medication, sleep_medication_status, breakfast, lunch, dinner, event_note",
          )
          .eq("user_id", userId)
          .gte("record_date", startDate)
          .lt("record_date", endDate)
          .order("record_date", { ascending: false });

        if (error) throw error;

        setMonthlyEntries(data ?? []);
      } catch (error) {
        console.error("讀取月紀錄失敗：", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMonthEntry();
  }, [userId, month]);

  return (
    <main className="relative pt-12 page-style min-h-dvh">
      <div className="relative z-10 w-full px-4 py-10">
        <div className="mx-auto flex max-w-[500px] flex-col items-center gap-6 rounded-3xl md:max-w-[600px] md:px-6 lg:max-w-[800px]">
          <Link
            to="/history"
            className="self-start font-medium text-center transition-colors duration-200 border-b-4 cursor-pointer hover:text-clayPeach hover:border-peach dark:border-cream200 border-milkTeaDark dark:hover:text-peach dark:hover:border-peach text-dark dark:text-cream"
          >
            ← 返回歷史紀錄
          </Link>

          <p>
            {year} 年 {Number(monthNumber)} 月回顧
          </p>

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

          {isLoading ? (
            <p className="text-sm">讀取紀錄中...</p>
          ) : monthlyEntries.length > 0 ? (
            <>
              <p className="text-sm">
                {month}月已留下 {monthlyEntries.length} 天紀錄
              </p>

              <div className="flex flex-col items-start justify-between gap-3 p-2 border-b border-softPeach dark:border-softPeach/20">
                <h2>01 心情分布</h2>
                <div className="w-full">
                  {moodOptions.map((option) => (
                    <MoodStatItem
                      key={option.value}
                      emoji={option.emoji}
                      label={option.label}
                      count={moodStats[option.value]}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-start justify-between gap-3 p-2 border-b border-softPeach dark:border-softPeach/20">
                <h2>02 用藥統計</h2>
                <span>
                  白天用藥 {medicationStats.daytime.taken} 天
                </span>
                <span>
                  晚上用藥 {medicationStats.nighttime.taken} 天
                </span>
                <span>
                  睡眠用藥 {medicationStats.sleep.taken} 天
                </span>
              </div>

              <div className="flex flex-col items-start justify-between gap-3 p-2 border-b border-softPeach dark:border-softPeach/20">
                <h2>03 飲食統計</h2>
                有記得吃
                <span>早餐 {mealStats.breakfast} 天</span>
                <span>午餐 {mealStats.lunch} 天</span>
                <span>晚餐 {mealStats.dinner} 天</span>
              </div>

              <div className="flex flex-col items-start justify-between gap-3 p-2 border-b border-softPeach dark:border-softPeach/20">
                <h2>04 值得回顧的事件</h2>
                <ul>
                  {eventEntries.map((entry) => (
                    <li className="" key={entry.id}>
                      {entry.event_note}
                    </li>
                  ))}
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
