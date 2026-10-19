import { useState, useEffect } from "react";
import { useAuth } from "src/context/AuthContext";
import { supabase } from "src/supabaseClient";
import { Link, useParams, useNavigate } from "react-router";

import { moodOptions } from "src/constants/moodOptions";
import { ProgressStatItem } from "src/components/monthly/ProgressStatItem";
import { formatDateLabel } from "src/utils/date";
import { getMedicationStats } from "src/utils/getMedicationStats";
import { getMealStats } from "src/utils/getMealStats";

function EmptyMonthState({ isCurrentMonth, today }) {
  return (
    <div className="flex flex-col items-center w-full gap-14">
      {isCurrentMonth ? (
        <>
          <p className="text-sm text-center">
            這個月沒有留下紀錄
          </p>
          <Link
            to={`/records/${today}`}
            className="font-medium transition-colors duration-200 border-b-4 hover:text-clayPeach hover:border-peach hover:dark:border-peach dark:border-cream200 border-milkTeaDark"
          >
            開始今日紀錄
          </Link>
        </>
      ) : (
        <p className="text-sm text-center">這個月沒有留下紀錄</p>
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

function getMonthKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

function MoodStatItem({ emoji, label, count, maxCount }) {
  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

  return (
    <div className="grid w-full grid-cols-[120px_1fr_60px] items-center gap-4 py-3">
      <div className="flex items-center gap-3">
        <span>{emoji}</span>
        <span className="dark:text-cream100 text-dark/80">
          {label}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-clayPeach/30">
        <div
          className="h-full rounded-full bg-milkTeaDark dark:bg-milkTea"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <span className="font-medium dark:text-cream200 text-dark/80">
        {count} 天
      </span>
    </div>
  );
}

export function MonthlyReviewPage() {
  const { user } = useAuth();
  const userId = user?.id;

  const { month } = useParams();
  const navigate = useNavigate();

  const [year, monthNumber] = month.split("-");

  const selectedMonth = new Date(
    Number(year),
    Number(monthNumber) - 1,
    1,
  );

  const currentDate = new Date();
  const today = getDateKey(currentDate);

  const isCurrentMonth =
    selectedMonth.getFullYear() === currentDate.getFullYear() &&
    selectedMonth.getMonth() === currentDate.getMonth();

  const [monthlyEntries, setMonthlyEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  function handlePrevMonth() {
    const prevMonth = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() - 1,
      1,
    );
    navigate(`/monthly-review/${getMonthKey(prevMonth)}`);
  }
  function handleNextMonth() {
    if (isCurrentMonth) return;

    const nextMonth = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() + 1,
      1,
    );
    navigate(`/monthly-review/${getMonthKey(nextMonth)}`);
  }

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
  const maxMoodCount = Math.max(...Object.values(moodStats));

  // 用藥統計
  const medicationStats = getMedicationStats(monthlyEntries);

  // 飲食統計
  const mealStats = getMealStats(monthlyEntries);

  // 事件紀錄的日期
  const eventEntries = monthlyEntries.filter(
    (entry) =>
      entry.mood_note?.trim() || entry.event_note?.trim(),
  );

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
            "id, record_date, mood, daytime_medication, nighttime_medication, sleep_medication_status, breakfast, lunch, dinner, event_note, mood_note, user_id",
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
        <div className="dark:text-cream200 mx-auto flex max-w-[500px] flex-col items-center gap-6 rounded-3xl md:max-w-[600px] md:px-6 lg:max-w-[800px]">
          <Link
            to="/history"
            className="self-start font-medium text-center transition-colors duration-200 border-b-4 cursor-pointer hover:text-clayPeach hover:border-peach dark:border-cream200 border-milkTeaDark dark:hover:text-peach dark:hover:border-peach text-dark dark:text-cream"
          >
            ← 返回歷史紀錄
          </Link>

          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrevMonth}
              className="p-2 text-sm border rounded-md text-milkTeaBrown border-peach hover:bg-peach/20 justify-self-start"
            >
              ← 上個月
            </button>
            <p>
              {year} 年 {Number(monthNumber)} 月回顧
            </p>

            <button
              onClick={handleNextMonth}
              disabled={isCurrentMonth}
              className="p-2 text-sm border rounded-md border-peach text-milkTeaBrown hover:bg-peach/20 justify-self-end disabled:cursor-not-allowed disabled:opacity-40"
            >
              下個月 →
            </button>
          </div>

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
                {year} 年 {Number(monthNumber)} 月已留下{" "}
                {monthlyEntries.length} 天紀錄
              </p>

              <div className="flex flex-col items-start w-full gap-3 p-4 pl-3 rounded-md bg-clayPeach/5">
                <h2 className="font-semibold">01 心情分佈</h2>
                <div className="w-full">
                  {moodOptions.map((option) => (
                    <MoodStatItem
                      key={option.value}
                      emoji={option.emoji}
                      label={option.label}
                      count={moodStats[option.value]}
                      maxCount={maxMoodCount}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-start w-full gap-3 p-4 pl-3 rounded-md bg-clayPeach/5">
                <h2 className="font-semibold">02 用藥統計</h2>
                <ProgressStatItem
                  label="白天用藥"
                  count={medicationStats.daytime.taken}
                  total={monthlyEntries.length}
                />

                <ProgressStatItem
                  label="晚上用藥"
                  count={medicationStats.nighttime.taken}
                  total={monthlyEntries.length}
                />
                <div className="space-y-2">
                  <p className="dark:text-cream100 text-dark/80">
                    睡眠藥物
                  </p>
                  <p className="text-sm dark:text-cream200 text-dark">
                    服用 {medicationStats.sleep.taken} 天 · 漏服{" "}
                    {medicationStats.sleep.missed} 天 · 不需要{" "}
                    {medicationStats.sleep.notNeeded} 天
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start w-full gap-3 p-4 pl-3 rounded-md bg-clayPeach/5">
                <h2 className="font-semibold">03 飲食狀況</h2>
                <ProgressStatItem
                  label="早餐"
                  count={mealStats.breakfast}
                  total={monthlyEntries.length}
                />
                <ProgressStatItem
                  label="午餐"
                  count={mealStats.lunch}
                  total={monthlyEntries.length}
                />
                <ProgressStatItem
                  label="晚餐"
                  count={mealStats.dinner}
                  total={monthlyEntries.length}
                />
              </div>

              <div className="flex flex-col items-start w-full gap-3 p-4 pl-3 rounded-md bg-clayPeach/5">
                <h2 className="font-semibold">
                  04 值得回顧的紀錄
                </h2>
                <ul className="w-full space-y-4 dark:text-cream100/80 text-dark/90">
                  {eventEntries.map((entry) => (
                    <li
                      className="flex flex-col md:flex-row md:gap-4"
                      key={entry.id}
                    >
                      <span className="font-semibold md:w-24 md:shrink-0">
                        {formatDateLabel(entry.record_date)}
                      </span>

                      <div>
                        {entry.mood_note && (
                          <p>{entry.mood_note}</p>
                        )}

                        {entry.event_note && (
                          <p>{entry.event_note}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <EmptyMonthState
              isCurrentMonth={isCurrentMonth}
              today={today}
            />
          )}
        </div>
      </div>
    </main>
  );
}
