
import { TodayStatusCard } from "src/components/home/TodayStatusCard";
import { RecordOverview } from "src/components/home/RecordOverview";
import { useEffect, useState } from "react";
import { supabase } from "src/supabaseClient";
import { useAuth } from "src/context/AuthContext";

//今天日期
function getDateKey(dateValue) {
  const date = new Date(dateValue);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function HomePage() {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.name;

  const [moodEntries, setMoodEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [weeklyEntries, setWeeklyEntries] = useState([]);

  const currentDate = new Date();
  const todayKey = getDateKey(currentDate);
  const userId = user?.id
  const today = getDateKey(new Date());
  
  //今天有無紀錄 //今天日期===近期日期
   const todayEntry = moodEntries.find(
     (entry) =>
       entry.userId === userId && entry.recordDate === todayKey,
   );

  useEffect(() => {
    let ignore = false
    
    async function fetchTodayEntry() {
      // 查詢 Supabase 的程式……

      setMoodEntries([]);
      setLoadError("");

      if (!userId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        // 1. 找到「這位使用者、今天」的紀錄
        const { data, error } = await supabase
          .from("daily_checkins")
          .select("*")
          .eq("user_id", userId)
          .eq("record_date", todayKey)
          .maybeSingle();

        if (error) throw error;

        // 已離開頁面，或已切換使用者，就忽略舊結果
        if (ignore) return;

        // 2. 今天沒有紀錄，保持空陣列
        if (!data) {
          setMoodEntries([]);
          return;
        }

        // 3. 把資料庫格式轉成目前元件使用的格式
        // 確認沒有錯誤，而且 data 有資料後
        const entry = {
          id: data.id,
          userId: data.user_id,
          recordDate: data.record_date,
          createdAt: data.created_at,
          updatedAt: data.updated_at,

          mood: data.mood,
          moodNote: data.mood_note ?? "",

          daytimeMedication: data.daytime_medication,
          nighttimeMedication: data.nighttime_medication,
          sleepMedication: data.sleep_medication_status,

          // 三餐
          meals: {
            breakfast: data.breakfast ?? false,
            lunch: data.lunch ?? false,
            dinner: data.dinner ?? false,
          },

          // 三餐備註
          mealNotes: {
            breakfast: data.breakfast_note ?? "",
            lunch: data.lunch_note ?? "",
            dinner: data.dinner_note ?? "",
          },

          // 今日事件
          eventNote: data.event_note ?? "",
        };

        // 4. 放進 state，React 就會更新畫面
        setMoodEntries([entry]);
      } catch (error) {
        if (ignore) return;

        console.error("讀取今日紀錄失敗：", error);
        setLoadError("讀取紀錄失敗，請重新整理再試一次。");
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    fetchTodayEntry();

    return () => {
      ignore = true;
    };
  }, [userId, todayKey])
  
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
  
  return (
    <main className="relative pt-12 page-style min-h-dvh">
      <div className="relative z-10 w-full px-4 py-10">
        <div className="mx-auto flex max-w-[500px] flex-col items-center gap-8 rounded-3xl md:max-w-[600px] md:px-6 lg:max-w-[800px]">
          {/* 今日已紀錄的話顯示 */}
          {/* 今日狀態＋主要操作按鈕*/}

          {isLoading ? (
            <p role="status">正在讀取今日紀錄…</p>
          ) : loadError ? (
            <p role="alert" className="text-red-600">
              {loadError}
            </p>
          ) : (
            <TodayStatusCard
              displayName={displayName}
              todayEntry={todayEntry}
              today={today}
            />
          )}

          {/*累積紀錄摘要 */}
          <RecordOverview
            entries={moodEntries}
            notedDays={weeklyEntries.length}
            moods7Days={moods7Days}
          />
        </div>
      </div>
    </main>
  );
}
