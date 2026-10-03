import { useState, useEffect } from "react";
import { useAuth } from "src/context/AuthContext";
import { supabase } from "src/supabaseClient";
import { Link } from "react-router";

//今天日期
function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateLabel(dateString) {
  const date = new Date(`${dateString}T00:00:00`);

  const month = date.getMonth() + 1;
  const day = date.getDate();

  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
  const weekDay = weekDays[date.getDay()];

  return `${month}/${day}（${weekDay}）`;
}

const moodOptions = [
  { value: "happy", label: "開心", emoji: "😊" },
  { value: "calm", label: "平靜", emoji: "😌" },
  { value: "okay", label: "普通", emoji: "😐" },
  { value: "sad", label: "難過", emoji: "☹️" },
  { value: "overwhelmed", label: "不堪負荷", emoji: "😣" },
];

export function WeeklyReviewPage() {
  const [weeklyEntries, setWeeklyEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const userId = user?.id;

  const currentDate = new Date();
  const today = getDateKey(currentDate);

  useEffect(() => {
    if (!userId) return;
    async function fetchWeeklyEntries() {
      try {
        setIsLoading(true);
        //清除前一次查詢結果
        setWeeklyEntries([]);

        const currentDate = new Date();
        //先複製一份，再修改複製品
        const sevenDaysAgoDate = new Date(currentDate);
        sevenDaysAgoDate.setDate(currentDate.getDate() - 6);

        const sevenDaysAgo = getDateKey(sevenDaysAgoDate);
        const today = getDateKey(currentDate);

        const { data, error } = await supabase
          .from("daily_checkins")
          .select(
            "id, record_date, mood, daytime_medication, nighttime_medication, sleep_medication_status, breakfast, lunch, dinner",
          )
          .eq("user_id", userId)
          .gte("record_date", sevenDaysAgo)
          .lte("record_date", today)
          .order("record_date", { ascending: true });

        if (error) throw error;

        setWeeklyEntries(data ?? []);
      } catch (error) {
        console.error("讀取一週紀錄失敗：", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWeeklyEntries();
  }, [userId]);

  // emoji
  const last7Days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();

    date.setDate(date.getDate() - (6 - index));

    return getDateKey(date);
  });

  const moods7Days = last7Days.map((date) => {
    const entry = weeklyEntries.find((item) => {
      return item.record_date === date;
    });

    return entry ? entry.mood : null;
  });

  const weeklyEntries2 = last7Days.map((date) => {
    const entry = weeklyEntries.find((item) => {
      return item.record_date === date;
    });

    const option = moodOptions.find((moodOption) => {
      return moodOption.value === entry?.mood;
    });

    return {
      record_date: date,
      emoji: option ? option.emoji : "-",
      hasEntry: Boolean(entry),
    };
  });

  return (
    <main className="relative pt-12 page-style min-h-dvh">
      <div className="relative z-10 w-full px-4 py-10">
        <div className="mx-auto flex max-w-[500px] flex-col items-center gap-8 rounded-3xl md:max-w-[600px] md:px-6 lg:max-w-[800px]">
          <p className="text-sm">最近 7 天紀錄</p>
          {isLoading ? (
            <p className="text-sm">讀取紀錄中...</p>
          ) : moods7Days.length > 0 ? (
            <>
              <div className="w-full p-6 space-y-3 text-sm rounded-3xl bg-cream/80 dark:bg-cream/10">
                <WeeklyItem label="日期" mood="心情" isHeader />
                <div>
                  {weeklyEntries2.map((item) => {
                    return (
                      <WeeklyItem
                        key={item.record_date}
                        label={item.record_date}
                        mood={item.emoji}
                        url={
                          item.hasEntry
                            ? `/records/${item.record_date}`
                            : null
                        }
                      />
                    );
                  })}
                </div>
                <p className="text-sm dark:text-cream200 text-dark/70">
                  已記錄
                  <span className="font-semibold">
                    {" "}
                    {weeklyEntries.length} / 7{" "}
                  </span>
                  天
                </p>
              </div>
              <WeeklyStat data={weeklyEntries} />
            </>
          ) : (
            <EmptyWeeklyReviewState today={today} />
          )}
        </div>
      </div>
    </main>
  );
}

function WeeklyItem({ label, mood, url, isHeader = false }) {
  const textClass = isHeader
    ? "font-medium dark:text-cream200 text-dark"
    : "dark:text-cream100 text-dark/60";

  return (
    <div className="grid items-center justify-around grid-cols-3 gap-4 p-2 border-b border-softPeach dark:border-softPeach/20">
      {label === "日期" ? (
        <span className={textClass}>{label}</span>
      ) : (
        <span className={textClass}>
          {formatDateLabel(label)}
        </span>
      )}
      <span className={`text-center font-black ${textClass}`}>
        {mood}
      </span>
      <div className="text-right">
        {isHeader ? (
          <span className={textClass}>查看紀錄</span>
        ) : url ? (
          <Link
            to={url}
            className="font-medium transition-colors duration-200 hover:text-peach dark:text-cream100 dark:hover:text-peach text-dark/70"
          >
            查看 →
          </Link>
        ) : (
          <span
            className={`pr-6 text-center font-black ${textClass}`}
          >
            -
          </span>
        )}
      </div>
    </div>
  );
}

function WeeklyStat({ data }) {
  const notedDays = data.length;
  const breakfastCount = data.filter(
    (item) => item.breakfast,
  ).length;
  const lunchCount = data.filter((item) => item.lunch).length;
  const dinnerCount = data.filter((item) => item.dinner).length;

  const daytimeMedicationCount = data.filter(
    (item) => item.daytime_medication,
  ).length;
  const nighttimeMedicationCount = data.filter(
    (item) => item.nighttime_medication,
  ).length;

  const sleepTakenCount = data.filter(
    (item) => item.sleep_medication_status === "taken",
  ).length;
  const sleepMissedCount = data.filter(
    (item) => item.sleep_medication_status === "missed",
  ).length;
  const sleepNotNeededCount = data.filter(
    (item) => item.sleep_medication_status === "notNeeded",
  ).length;

  return (
    <div className="flex flex-col w-full gap-3 p-6 space-y-3 text-sm dark:text-cream100 rounded-3xl bg-cream/80 text-dark/85 dark:bg-cream/10">
      <div className="pb-6 border-b border-softPeach dark:border-softPeach/20">
        <p className="mb-2 font-semibold">飲食</p>
        <ul>
          <li>
            早餐：
            <span className="font-semibold">
              {" "}
              {breakfastCount}{" "}
              {breakfastCount > 0 && <>{`/ ${notedDays}`}</>}{" "}
            </span>
            天
          </li>
          <li>
            午餐：
            <span className="font-semibold">
              {" "}
              {lunchCount}{" "}
              {lunchCount > 0 && <>{`/ ${notedDays}`}</>}{" "}
            </span>
            天
          </li>
          <li>
            晚餐：
            <span className="font-semibold">
              {" "}
              {dinnerCount}{" "}
              {dinnerCount > 0 && <>{`/ ${notedDays}`}</>}{" "}
            </span>
            天
          </li>
        </ul>
      </div>
      <div className="pb-6 border-b border-softPeach dark:border-softPeach/20">
        <p className="mb-2 font-semibold">用藥</p>
        <ul>
          <li>
            白天：
            <span className="font-semibold">
              {" "}
              {daytimeMedicationCount}{" "}
              {daytimeMedicationCount > 0 && (
                <>{`/ ${notedDays}`}</>
              )}{" "}
            </span>
            天
          </li>
          <li>
            晚間：
            <span className="font-semibold">
              {" "}
              {nighttimeMedicationCount}{" "}
              {nighttimeMedicationCount > 0 && (
                <>{`/ ${notedDays}`}</>
              )}{" "}
            </span>
            天
          </li>
        </ul>
      </div>
      <div className="pb-6 border-b border-softPeach dark:border-softPeach/20">
        <p className="mb-2 font-semibold">睡眠藥物</p>
        <ul>
          <li>
            服用
            <span className="font-semibold">
              {" "}
              {sleepTakenCount}{" "}
              {sleepTakenCount > 0 && (
                <>{`/ ${notedDays}`}</>
              )}{" "}
            </span>
            天
          </li>
          <li>
            未服用
            <span className="font-semibold">
              {" "}
              {sleepMissedCount}{" "}
              {sleepMissedCount > 0 && (
                <>{`/ ${notedDays}`}</>
              )}{" "}
            </span>
            天
          </li>
          <li>
            不需要
            <span className="font-semibold">
              {" "}
              {sleepNotNeededCount}
              {sleepNotNeededCount > 0 && (
                <>{`/ ${notedDays}`}</>
              )}{" "}
            </span>
            天
          </li>
        </ul>
      </div>

      <p className="text-xs dark:text-cream200 text-dark/60">
        *依 {notedDays} 天已填寫紀錄統計
      </p>
    </div>
  );
}

function EmptyWeeklyReviewState({ today }) {
  return (
    <div className="flex flex-col items-center w-full gap-14">
      <p className="text-sm text-center">
        最近 7 天還沒有留下紀錄
      </p>

      <Link
        to={`/records/${today}`}
        className="font-medium transition-colors duration-200 border-b-4 hover:text-clayPeach hover:border-peach hover:dark:border-peach dark:border-cream200 border-milkTeaDark"
      >
        開始今日紀錄
      </Link>
    </div>
  );
}