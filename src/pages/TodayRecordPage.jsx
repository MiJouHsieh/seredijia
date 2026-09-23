import { useState, useEffect } from "react";

import { TodayCheckInHeader } from "src/components/records/TodayCheckInHeader";
import { RecordForm } from "src/components/records/RecordForm";
import { RecordCard } from "src/components/records/RecordCard";
import { useAuth } from "src/context/AuthContext";
import { supabase } from "src/supabaseClient";

//今天日期
function getDateKey(dateValue) {
  const date = new Date(dateValue);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const initialFormData = {
  mood: null,
  moodNote: "",
  daytimeMedication: null,
  nighttimeMedication: null,
  sleepMedication: null,
  meals: {
    breakfast: false,
    lunch: false,
    dinner: false,
  },
  mealNotes: {
    breakfast: "",
    lunch: "",
    dinner: "",
  },
  eventNote: "",
};

export function TodayRecordPage() {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.name;
  const [formData, setFormData] = useState(initialFormData);

  const [moodEntries, setMoodEntries] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  
  const currentDate = new Date();
  const todayKey = getDateKey(currentDate);
  const userId = user?.id

  const todayEntry = moodEntries.find(
    (entry) =>
      entry.userId === userId && entry.recordDate === todayKey,
  );

  const shouldShowForm = isEditing || !todayEntry;

  useEffect(() => {
    let ignore = false;

    async function fetchTodayEntry() {
      // 開始讀取：顯示 loading、清除之前的錯誤與紀錄
      setIsLoading(true);
      setLoadError("");
      setMoodEntries([]);
      setIsEditing(false);
      setFormData(initialFormData);
      setSaveError("");

      // 沒有登入，不查詢資料庫
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("daily_checkins")
          .select("*")
          .eq("user_id", userId)
          .eq("record_date", todayKey)
          .maybeSingle();

        if (error) throw error;

        // 離開頁面或切換帳號後，不使用舊的查詢結果
        if (ignore) return;

        // 今天沒有紀錄，保持空陣列，稍後顯示表單
        if (!data) return;

        // 把資料庫欄位轉成前端元件使用的格式
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

          meals: {
            breakfast: data.breakfast ?? false,
            lunch: data.lunch ?? false,
            dinner: data.dinner ?? false,
          },

          mealNotes: {
            breakfast: data.breakfast_note ?? "",
            lunch: data.lunch_note ?? "",
            dinner: data.dinner_note ?? "",
          },

          eventNote: data.event_note ?? "",
        };

        setMoodEntries([entry]);
      } catch (error) {
        if (ignore) return;

        console.error("讀取今日紀錄失敗：", error);

        // 讀取失敗：設定畫面上的錯誤訊息
        setLoadError("讀取紀錄失敗，請重新整理再試一次。");
      } finally {
        // 成功、沒有紀錄或失敗，都結束 loading
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    fetchTodayEntry();

    return () => {
      ignore = true;
    };
  }, [userId, todayKey]);
  
  async function handleSaveEntry() {
    // 已經在儲存，就不要重複送出
    if (isSaving) return;

    // 確認登入後，才能使用 user.id
    if (!user) {
      setSaveError("請先登入，再儲存紀錄。");
      return;
    }

    setIsSaving(true);
    setSaveError("");
    
    try {
      const now = new Date();

      // 1. 整理要送到資料庫的資料
      const payload = {
        // 這筆紀錄屬於誰、哪一天
        user_id: user.id,
        record_date: getDateKey(now),

        // 心情
        mood: formData.mood,
        mood_note: formData.moodNote,

        // 藥物
        daytime_medication: formData.daytimeMedication,
        nighttime_medication: formData.nighttimeMedication,
        sleep_medication_status: formData.sleepMedication,

        // 三餐
        breakfast: formData.meals.breakfast,
        lunch: formData.meals.lunch,
        dinner: formData.meals.dinner,

        // 三餐備註
        breakfast_note: formData.mealNotes.breakfast,
        lunch_note: formData.mealNotes.lunch,
        dinner_note: formData.mealNotes.dinner,

        // 今日事件
        event_note: formData.eventNote,

        updated_at: now.toISOString(),
      };

      // 2. 送出資料，等待資料庫回覆
      const { data, error } = await supabase
        .from("daily_checkins")
        .upsert(payload, {
          onConflict: "user_id,record_date",
        })
        .select()
        .single();

      // 3. 如果失敗，跳到下方 catch
      if (error) {
        throw error;
      }
      // 4. 儲存成功，才整理畫面要顯示的紀錄
      const newEntry = {
        ...formData,
        id: data.id,
        userId: data.user_id,
        recordDate: data.record_date,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      // 只讀取今天的一筆資料
      setMoodEntries([newEntry]);

      // 成功後，才離開編輯畫面
      setIsEditing(false);
      
    } catch (error) {
      console.error("儲存紀錄失敗：", error);
      setSaveError("儲存失敗，請稍後再試一次。");
    } finally {
      // 成功或失敗，都結束「儲存中」
      setIsSaving(false);
    }
  }
  
  function handleEditEntry() {
    if (!todayEntry) return;

    setFormData({
      mood: todayEntry.mood,
      moodNote: todayEntry.moodNote ?? "",
      daytimeMedication: todayEntry.daytimeMedication,
      nighttimeMedication: todayEntry.nighttimeMedication,
      sleepMedication: todayEntry.sleepMedication,
      meals: {
        ...initialFormData.meals,
        ...todayEntry.meals,
      },
      mealNotes: {
        ...initialFormData.mealNotes,
        ...todayEntry.mealNotes,
      },
      eventNote: todayEntry.eventNote ?? "",
    });

    setIsEditing(true);
  }

  return (
    <main className="relative pt-12 page-style min-h-dvh">
      <div className="relative z-10 w-full px-4 py-10">
        <div className="mx-auto flex max-w-[500px] flex-col items-center gap-8 rounded-3xl md:max-w-[600px] md:px-6 lg:max-w-[800px]">
          <TodayCheckInHeader
            currentDate={currentDate}
            hasTodayEntry={Boolean(todayEntry)}
            isEditing={isEditing}
          />
        </div>
        {displayName && (
          <p className="w-full my-3 text-center font-mdmedium text-milkTea">
            嗨，{displayName} 我們來看看今天吧 ♡
          </p>
        )}

        {isLoading ? (
          <p role="status" className="text-center">
            正在讀取今日紀錄…
          </p>
        ) : loadError ? (
          <p role="alert" className="text-center text-red-600">
            {loadError}
          </p>
        ) : shouldShowForm ? (
          <RecordForm
            formData={formData}
            setFormData={setFormData}
            isEditing={isEditing}
            isSaving={isSaving}
            saveError={saveError}
            onSave={handleSaveEntry}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <RecordCard
            entry={todayEntry}
            onEdit={handleEditEntry}
          />
        )}
      </div>
    </main>
  );
}
