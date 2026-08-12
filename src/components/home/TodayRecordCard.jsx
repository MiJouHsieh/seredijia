function formatTime(dateValue) {
  return new Date(dateValue).toLocaleTimeString("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function RecordItem({ label, value }) {
  return (
    <div className="flex justify-between gap-4 pb-3 border-b border-slate-100">
      <span className="shrink-0 text-slate-500">{label}</span>
      <span className="font-medium text-right">{value}</span>
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
    <section className="p-5 space-y-5 shadow-sm rounded-3xl bg-white/80 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-700">
            今日紀錄
          </h2>
          <span className="text-xs text-slate-500">
            最後更新 {formatTime(entry.updatedAt)}
          </span>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="px-4 py-2 text-sm font-medium text-pink-700 bg-pink-100 rounded-full"
        >
          編輯
        </button>
      </div>

      <div className="space-y-3 text-sm text-slate-700">
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
          <p className="text-slate-500">用藥</p>
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
          <p className="text-slate-500">三餐</p>
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
