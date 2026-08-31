function formatTime(dateValue) {
  return new Date(dateValue).toLocaleTimeString("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function RecordItem({ label, value }) {
  return (
    <div className="flex justify-between gap-4 pb-3 border-b border-pink-200">
      <span className="dark:text-cream/80 shrink-0 text-slate-500">
        {label}
      </span>
      <span className="font-medium text-right text-slate-400">
        {value}
      </span>
    </div>
  );
}

function formatMedicationStatus(value) {
  if (value === true) return "有";
  if (value === false) return "沒有";

  return "未記錄";
}

const moodLabels = {
  happy: "開心",
  calm: "平靜",
  okay: "普通",
  sad: "難過",
  overwhelmed: "不堪負荷",
};

const sleepMedicationLabels = {
  taken: "有服用",
  notTaken: "需要但沒服用",
  notNeeded: "不需要服用",
};

export function TodayRecordCard({ entry, onEdit }) {
  const hasMealRecord =
    entry.meals.breakfast ||
    entry.meals.lunch ||
    entry.meals.dinner;

  return (
    <section className="w-full p-5 space-y-5 shadow-sm bg-cream/80 dark:bg-dark/50 dark:text-cream/80 rounded-3xl text-slate-500 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">今日紀錄</h2>
          <span className="text-xs">
            最後更新 {formatTime(entry.updatedAt)}
          </span>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="px-4 py-2 text-sm rounded-full font-regular text-cream bg-coral"
        >
          編輯
        </button>
      </div>

      <div className="space-y-3 text-sm text-cream/50">
        <RecordItem
          label="心情"
          value={moodLabels[entry.mood] ?? "未記錄"}
        />
        {entry.moodNote && (
          <RecordItem
            label="想記下什麼嗎？"
            value={entry.moodNote}
          />
        )}

        <div className="space-y-2">
          <p className="dark:text-cream/80 text-slate-500">
            用藥
          </p>
          <div className="pl-3 space-y-3">
            <RecordItem
              label="白天用藥"
              value={formatMedicationStatus(
                entry.daytimeMedication,
              )}
            />
            <RecordItem
              label="晚上用藥"
              value={formatMedicationStatus(
                entry.nighttimeMedication,
              )}
            />
            <RecordItem
              label="睡眠用藥"
              value={
                sleepMedicationLabels[entry.sleepMedication] ??
                "未記錄"
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="dark:text-cream/80 text-slate-500">
            三餐
          </p>
          {hasMealRecord ? (
            <div className="pl-3 space-y-3">
              {entry.meals.breakfast && (
                <RecordItem
                  label="早餐"
                  value={entry.mealNotes.breakfast || "未填寫"}
                />
              )}
              {entry.meals.lunch && (
                <RecordItem
                  label="午餐"
                  value={entry.mealNotes.lunch || "未填寫"}
                />
              )}
              {entry.meals.dinner && (
                <RecordItem
                  label="晚餐"
                  value={entry.mealNotes.dinner || "未填寫"}
                />
              )}
            </div>
          ) : (
            <p className="font-medium text-right">未記錄</p>
          )}
        </div>

        <RecordItem
          label="今天在意的事"
          value={entry.eventNote || "未記錄"}
        />
      </div>
    </section>
  );
}
