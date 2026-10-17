import { useEffect, useState } from "react";

import { supabase } from "src/supabaseClient";
import { useAuth } from "src/context/AuthContext";
import { getDateKey } from "src/utils/date";

export function ReviewPage() {
  const { user } = useAuth();

  const today = getDateKey(new Date());
  //date input 現在選到哪一天
  const [selectedVisitDate, setSelectedVisitDate] = useState("");
  //現在畫面正在查看哪一天～今天
  const [reviewStartDate, setReviewStartDate] = useState(null);
  //Supabase 真正儲存的最近一次回診日
  const [lastVisitDate, setLastVisitDate] = useState(null);

  const [selectedEntries, setSelectedEntries] = useState([]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const userId = user?.id;

  function handleDateChange(nextDate) {
    if (!nextDate || nextDate > today) return;

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

      setLastVisitDate(data.visit_date);
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
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setLoadError("");

        const { data, error } = await supabase
          .from("daily_checkins")
          .select("*")
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
    async function fetchLastVisit() {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from("clinic_visits")
          .select("id, visit_date")
          .lte("visit_date", today)
          .order("visit_date", {
            ascending: false,
          })
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setLastVisitDate(data.visit_date);
          setSelectedVisitDate(data.visit_date);
          setReviewStartDate(data.visit_date);
          
          console.log("review data", data);
        }
      } catch (error) {
        console.error("讀取回診日期失敗：", error);
      }
    }

    fetchLastVisit();
  }, [userId, today]);

  console.log("selectedEntries", selectedEntries);

  return (
    <main className="relative pt-12 page-style min-h-dvh">
      <div className="relative z-10 w-full px-4 py-10">
        <div className="mx-auto flex max-w-[500px] flex-col items-center gap-5 rounded-3xl outline md:max-w-[600px] md:px-6 lg:max-w-[800px]">
          {/* 時間 */}
          <div className="flex flex-col items-center gap-5 mx-auto font-medium text-milkTeaDark dark:text-cream">
            <div className="flex flex-col items-center justify-center">
              <h1>近期狀態回顧</h1>

              {lastVisitDate ? (
                <p>
                  {reviewStartDate} - {today}
                </p>
              ) : (
                <p>選擇日期後，就能整理這段期間的狀態紀錄。</p>
              )}
            </div>
            <div className="flex items-center w-full">
              <span className="flex flex-col items-start text-milkTeaDark">
                <label htmlFor="last-clinic-date ">
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
                  className="px-2 py-1 border-2 rounded-lg cursor-pointer bg-milkTea dark:bg-purple100 focus:ring-peach border-dark text-cream focus:outline-none focus:ring-2"
                />
              </span>
              <span className="p-2">→</span>{" "}
              <p className="flex flex-col items-start">
                <span>今天</span>
                <span>{today}</span>
              </p>
            </div>
            <button
              type="button"
              className="w-full px-3 py-1 border-2 rounded-full cursor-pointer bg-milkTeaBrown border-milkTeaDark hover:bg-milkTeaBrown/50 text-cream hover:text-dark"
              onClick={handlePreviewReview}
            >
              查看這段期間
            </button>

            <div className="flex flex-col items-center w-full gap-1 p-3 bg-dark/5">
              {lastVisitDate && (
                <p className="text-sm text-dark">
                  最近一次已儲存回診：
                  {lastVisitDate}
                </p>
              )}

              {/* {selectedVisitDate === lastVisitDate ? (
                <p className="text-xs">{`✓ ${lastVisitDate}已儲存為回診日期`}</p>
              ) : ( */}
              {selectedVisitDate !== lastVisitDate && (
                <button
                  className="px-3 py-1 text-xs border-2 rounded-full cursor-pointer bg-milkTea hover:bg-cream200 border-dark text-cream hover:text-dark"
                  type="button"
                  onClick={handleSaveVisitDate}
                  disabled={!selectedVisitDate || isSaving}
                >
                  {isSaving
                    ? "儲存中..."
                    : `將 ${selectedVisitDate} 儲存為回診日期`}
                </button>
              )}

              <p>
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
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center bg-milkTeaBrown/50 text-dark">
            <p className="p-3 text-sm">
              整理這段期間的情緒、用藥、飲食與重要事件，
              方便回診時快速回顧。
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

            {lastVisitDate && !isLoading && !loadError && (
              <div className="flex flex-col items-center">
                <p>這段回顧期間</p>
                <p>
                  {selectedVisitDate} ~ {today}
                </p>
                <p>共留下{selectedEntries.length} 天紀錄</p>
              </div>
            )}
          </div>

          {/* 情緒 */}
          {/* 用藥 */}
          {/* 飲食 */}
          {/* 重要事件 */}
          {/* 過去回顧 */}
        </div>
      </div>
    </main>
  );
}
