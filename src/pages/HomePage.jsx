
import { TodayStatusCard } from "src/components/home/TodayStatusCard";
import { RecordOverview } from "src/components/home/RecordOverview";

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

  const moodEntries = []

  const currentDate = new Date();
  //今天有無紀錄 //今天日期===近期日期
  const todayEntry = moodEntries.find((entry) => {
    return (
      getDateKey(entry.createdAt) === getDateKey(currentDate)
    );
  });

  return (
    <main className="relative pt-12 page-style min-h-dvh">
      <div className="relative z-10 w-full px-4 py-10">
        <div className="mx-auto flex max-w-[500px] flex-col items-center gap-8 rounded-3xl md:max-w-[600px] md:px-6 lg:max-w-[800px]">
          
          {/* 今日已紀錄的話顯示 */}
          {/* 今日狀態＋主要操作按鈕*/}
          <TodayStatusCard
            displayName={displayName}
            todayEntry={todayEntry}
          />
          {/*累積紀錄摘要 */}
          <RecordOverview entries={moodEntries} />
        </div>
      </div>
    </main>
  );
}
