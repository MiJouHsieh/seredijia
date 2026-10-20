import { useEffect, useState } from "react";

import { supabase } from "src/supabaseClient";
import { useAuth } from "src/context/AuthContext";
import { getDateKey } from "src/utils/date";
import { getMedicationStats } from "src/utils/getMedicationStats";
import { getMealStats } from "src/utils/getMealStats";
import { formatDateLabel } from "src/utils/date";

const moodItems = [
  { value: "happy", label: "開心" },
  { value: "calm", label: "平靜" },
  { value: "okay", label: "普通" },
  { value: "sad", label: "低落" },
  { value: "overwhelmed", label: "不堪負荷" },
];

export function ReviewPage() {
  const { user } = useAuth();

  const today = getDateKey(new Date());

  //date input 現在選到哪一天
  const [selectedVisitDate, setSelectedVisitDate] = useState("");

  //現在畫面正在查看哪一天～今天
  const [reviewStartDate, setReviewStartDate] = useState(null);

  //Supabase 真正儲存的最近一次回診日
  const [lastVisitDate, setLastVisitDate] = useState(null);

  //已確認儲存的日期
  const [savedVisitDates, setSavedVisitDates] = useState([]);

  const [selectedEntries, setSelectedEntries] = useState([]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  //正在讀取最近一次回診日期
  const [isVisitLoading, setIsVisitLoading] = useState(true);
  const [visitLoadError, setVisitLoadError] = useState("");

  const userId = user?.id;

  function handleDateChange(nextDate) {
    if (nextDate > today) return;

    setSelectedVisitDate(nextDate);
    setSaveError("");
    setSaveMessage("");
  }

  //查看回顧
  function handlePreviewReview() {
    if (!selectedVisitDate) return;

    setReviewStartDate(selectedVisitDate);
  }

  //儲存回診日期
  async function handleSaveVisitDate() {
    if (!userId || !selectedVisitDate) return;

    try {
      setIsSaving(true);
      setSaveError("");
      setSaveMessage("");

      //已儲存 提示
      const { data: existingVisit, error: checkError } =
        await supabase
          .from("clinic_visits")
          .select("id, visit_date")
          .eq("user_id", userId)
          .eq("visit_date", selectedVisitDate)
          .maybeSingle();

      if (checkError) throw checkError;

      if (existingVisit) {
        setSavedVisitDates((prev) =>
          prev.includes(existingVisit.visit_date)
            ? prev
            : [...prev, existingVisit.visit_date],
        );
        setSaveMessage("這個回診日期已儲存。");
        return;
      }

      const { data, error } = await supabase
        .from("clinic_visits")
        .insert({
          user_id: userId,
          visit_date: selectedVisitDate,
        })
        .select()
        .single();

      if (error) throw error;

      setSavedVisitDates((prev) =>
        prev.includes(data.visit_date)
          ? prev
          : [...prev, data.visit_date],
      );

      setLastVisitDate((prev) =>
        !prev || data.visit_date > prev ? data.visit_date : prev,
      );
      setReviewStartDate(data.visit_date);
      setSaveMessage("回診日期已儲存。");
    } catch (error) {
      console.error("儲存回診日期失敗：", error);
      setSaveError("儲存日期失敗，請再試一次。");
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    let ignore = false;

    async function fetchReviewEntries() {
      // 沒有登入，沒有日期或選到未來，不查詢
      if (!userId || !reviewStartDate) {
        setSelectedEntries([]);
        setLoadError("");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setLoadError("");

        const { data, error } = await supabase
          .from("daily_checkins")
          .select("*")
          .eq("user_id", userId)
          .gte("record_date", reviewStartDate)
          .lte("record_date", today)
          .order("record_date", { ascending: true });

        if (error) throw error;
        if (!ignore) {
          setSelectedEntries(data ?? []);
        }
      } catch (error) {
        console.error("讀取回顧紀錄失敗：", error);
        if (!ignore) {
          setLoadError("讀取紀錄失敗，請重新整理再試一次。");
        }
      } finally {
        // 成功、沒有紀錄或失敗，都結束 loading
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }
    fetchReviewEntries();

    return () => {
      ignore = true;
    };
  }, [userId, reviewStartDate, today]);

  useEffect(() => {
    let ignore = false;

    async function fetchLastVisit() {
      // 清除上一次使用者的日期與提示
      setLastVisitDate(null);
      setSelectedVisitDate("");
      setReviewStartDate(null);
      setSavedVisitDates([]);
      setSaveMessage("");
      setSaveError("");
      setVisitLoadError("");

      if (!userId) {
        setIsVisitLoading(false);
        return;
      }

      // 開始查詢前
      setIsVisitLoading(true);

      try {
        const { data, error } = await supabase
          .from("clinic_visits")
          .select("id, visit_date")
          .eq("user_id", userId)
          .lte("visit_date", today)
          .order("visit_date", {
            ascending: false,
          })
          .limit(1)
          .maybeSingle();

        // 這次查詢已過期，就不再更新畫面
        if (ignore) return;
        if (error) throw error;

        if (data) {
          setLastVisitDate(data.visit_date);
          setSelectedVisitDate(data.visit_date);
          setReviewStartDate(data.visit_date);
          setSavedVisitDates([data.visit_date]);
        }
      } catch (error) {
        if (!ignore) {
          console.error("讀取回診日期失敗：", error);
          setVisitLoadError(
            "讀取回診日期失敗，請重新整理再試一次。",
          );
        }
      } finally {
        if (!ignore) {
          setIsVisitLoading(false);
        }
      }
    }

    fetchLastVisit();

    return () => {
      ignore = true;
    };
  }, [userId, today]);

  // 心情統計
  const moodStats = {
    happy: 0,
    calm: 0,
    okay: 0,
    sad: 0,
    overwhelmed: 0,
  };
  selectedEntries.forEach((entry) => {
    if (entry.mood) {
      moodStats[entry.mood] += 1;
    }
  });

  // 用藥統計
  const medicationStats = getMedicationStats(selectedEntries);
  // 飲食統計
  const mealStats = getMealStats(selectedEntries);
  //文字紀錄
  const eventEntries = selectedEntries.filter(
    (entry) =>
      entry.mood_note?.trim() || entry.event_note?.trim(),
  );

  return (
    <main className="relative pt-12 page-style min-h-dvh">
      <div className="relative z-10 w-full px-4 py-10">
        <div className="border-milkTea/80 mx-auto flex max-w-[500px] flex-col items-center gap-5 rounded-3xl border-2 md:max-w-[600px] md:px-6 lg:max-w-[800px]">
          {/* 時間 */}
          <div className="flex flex-col items-center gap-5 mx-auto font-medium text-milkTeaDark dark:text-cream">
            <div className="flex flex-col items-center justify-center">
              <h1>近期狀態回顧</h1>

              {reviewStartDate ? (
                <p>
                  {reviewStartDate} - {today}
                </p>
              ) : (
                <p>選擇日期後，就能整理這段期間的狀態紀錄。</p>
              )}
            </div>
            <div className="flex items-end w-full gap-3">
              <span className="flex flex-col items-start gap-1 text-milkTeaDark dark:text-cream">
                <label htmlFor="last-clinic-date">
                  回顧起始日期
                </label>
                <input
                  id="last-clinic-date"
                  type="date"
                  value={selectedVisitDate}
                  max={today}
                  onChange={(e) =>
                    handleDateChange(e.target.value)
                  }
                  className="h-10 px-3 py-1 border-2 rounded-lg cursor-pointer bg-milkTea dark:bg-purple100 focus:ring-peach dark:border-cream200 border-dark text-cream focus:outline-none focus:ring-2 dark:bg-cream/20"
                  disabled={isSaving || isVisitLoading}
                />
              </span>
              <span className="flex items-center h-10">→</span>{" "}
              <div className="flex flex-col items-start gap-1">
                <p>今天</p>
                <p className="flex items-center h-10">{today}</p>
              </div>
            </div>
            <button
              type="button"
              className="w-full px-3 py-1 border-2 rounded-full cursor-pointer bg-milkTeaBrown border-milkTeaDark enabled:hover:bg-milkTeaBrown/50 dark:border-cream200 dark:enabled:hover:bg-cream200 text-cream enabled:hover:text-dark disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handlePreviewReview}
              disabled={selectedVisitDate === ""}
            >
              查看這段期間
            </button>

            <div className="flex flex-col items-center w-full gap-1 p-3 bg-dark/5 dark:bg-cream/5 dark:text-cream">
              {isVisitLoading ? (
                <p className="text-sm">讀取回診日期中...</p>
              ) : visitLoadError ? (
                <p className="text-sm text-red-500">
                  {visitLoadError}
                </p>
              ) : lastVisitDate ? (
                <p className="text-sm dark:text-cream200 text-dark">
                  最近一次已儲存回診：
                  {lastVisitDate}
                </p>
              ) : (
                <p className="text-sm dark:text-cream100 text-dark">
                  尚未設定上次回診日，可先選擇回顧起始日期。
                </p>
              )}

              {selectedVisitDate &&
                selectedVisitDate !== lastVisitDate &&
                !savedVisitDates.includes(selectedVisitDate) && (
                  <button
                    className="px-3 py-1 text-xs border-2 rounded-full cursor-pointer bg-milkTea hover:bg-cream200 border-dark text-cream hover:text-dark disabled:cursor-not-allowed disabled:opacity-50 dark:border-cream"
                    type="button"
                    onClick={handleSaveVisitDate}
                    disabled={isSaving}
                  >
                    {isSaving
                      ? "儲存中..."
                      : `將 ${selectedVisitDate} 儲存為回診日期`}
                  </button>
                )}

              {saveMessage && (
                <p className="text-sm text-milkTea">
                  {saveMessage}
                </p>
              )}
              {saveError && (
                <p className="text-sm text-red-500">
                  {saveError}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center border-t-2 border-milkTeaBrown text-milkTeaDark dark:text-cream200">
            <p className="p-3 text-sm">
              整理這段期間的情緒、用藥、飲食與重要事件，
              方便回診時查看。
            </p>
            {/* <p>下次回診 10/25</p> */}

            {isLoading && (
              <p className="text-sm text-milkTeaDark">
                讀取中...
              </p>
            )}
            {loadError && (
              <p className="text-sm text-red-500">{loadError}</p>
            )}

            {reviewStartDate &&
              !isLoading &&
              !loadError &&
              selectedEntries.length !== 0 && (
                <div className="flex flex-col items-center text-sm font-medium">
                  <p>這段回顧期間</p>
                  <p>
                    {reviewStartDate} ~ {today}
                  </p>
                  <p>共留下{selectedEntries.length} 天紀錄</p>
                </div>
              )}
          </div>
          {reviewStartDate &&
            !isLoading &&
            !loadError &&
            selectedEntries.length !== 0 && (
              <section className="flex flex-col items-center w-10/12 p-3 dark:text-cream200 bg-milkTea/10 rounded-2xl text-dark/90 sm:w-full">
                {/* 情緒 */}
                <div className="flex flex-col w-full py-2 border-b-2 border-milkTeaDark/30">
                  <h2 className="pb-3 font-semibold">
                    01 心情分佈
                  </h2>
                  <ul>
                    {moodItems.map((option) => (
                      <MoodStatItem
                        key={option.value}
                        label={option.label}
                        count={moodStats[option.value]}
                      />
                    ))}
                  </ul>
                </div>
                {/* 用藥 */}
                <div className="flex flex-col w-full py-2 border-b-2 border-milkTeaDark/30">
                  <h2 className="pb-3 font-semibold">
                    02 用藥統計
                  </h2>
                  <p>
                    白天已服藥：{medicationStats.daytime.taken} 天
                  </p>
                  <p>
                    晚上已服藥：{medicationStats.nighttime.taken}{" "}
                    天
                  </p>
                  <div>
                    <p>睡眠藥物</p>
                    <p className="text-sm">
                      服用 {medicationStats.sleep.taken} 天 · 漏服{" "}
                      {medicationStats.sleep.missed} 天 · 不需要{" "}
                      {medicationStats.sleep.notNeeded} 天
                    </p>
                  </div>
                </div>
                {/* 飲食 */}
                <div className="flex flex-col justify-start w-full py-2 border-b-2 border-milkTeaDark/30">
                  <h2 className="pb-3 font-semibold">
                    03 飲食狀況
                  </h2>

                  <StatItem
                    label="早餐"
                    count={mealStats.breakfast}
                    total={selectedEntries.length}
                  />
                  <StatItem
                    label="午餐"
                    count={mealStats.lunch}
                    total={selectedEntries.length}
                  />
                  <StatItem
                    label="晚餐"
                    count={mealStats.dinner}
                    total={selectedEntries.length}
                  />
                </div>
                {/* 重要事件 */}
                <div className="flex flex-col w-full py-2">
                  <h2 className="pb-3 font-semibold">
                    04 值得回顧的紀錄
                  </h2>
                  <ul className="w-full space-y-6 dark:text-cream100/90">
                    {eventEntries.map((entry) => (
                      <li
                        className="flex flex-col md:flex-row md:gap-4"
                        key={entry.id}
                      >
                        <span className="font-semibold dark:text-cream200 md:w-24 md:shrink-0">
                          {formatDateLabel(entry.record_date)}
                        </span>

                        <div className="md:w-4/5 md:shrink-0">
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
                  {eventEntries.length === 0 && (
                    <p className="py-8 text-center">
                      這段期間沒有文字紀錄
                    </p>
                  )}
                </div>
              </section>
            )}
          {reviewStartDate &&
            !isLoading &&
            !loadError &&
            selectedEntries.length === 0 && (
              <p className="py-8 text-center">這段期間尚無紀錄</p>
            )}
        </div>
      </div>
    </main>
  );
}

function MoodStatItem({ label, count }) {
  return (
    <li className="grid w-full grid-cols-[120px_1fr_60px] items-center">
      <span>{label}</span>
      <span>{count} 天</span>
    </li>
  );
}

export function StatItem({ label, count, total }) {
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-start gap-10">
        <span className="dark:text-cream100 text-dark/80">
          {label}
        </span>
        <span>
          {count} / {total} 天
        </span>
      </div>
    </div>
  );
}
