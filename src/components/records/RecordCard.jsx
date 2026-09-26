function RecordItem({ label, value }) {
  return (
    <div className="flex justify-between gap-4 pb-3 border-b border-softPeach">
      <span className="dark:text-cream200 shrink-0 text-dark">
        {label}
      </span>
      <span className="font-medium text-right dark:text-cream100 text-dark/60">
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
  missed: "需要但沒服用",
  notNeeded: "不需要服用",
};

export function RecordCard({ entry, onEdit, dayLabel }) {
  const hasMealRecord =
    entry.meals.breakfast ||
    entry.meals.lunch ||
    entry.meals.dinner;

  // 紀錄所屬日期：用本地時間解析
  const recordDate = new Date(`${entry.recordDate}T00:00:00`);

  const isToday =
    recordDate.toDateString() === new Date().toDateString();

  const formattedRecordDate = recordDate.toLocaleDateString(
    "zh-TW",
    {
      month: "long",
      day: "numeric",
      weekday: "long",
    },
  );

  const title = isToday
    ? "今日紀錄"
    : `${formattedRecordDate}的紀錄`;

  // 更新
  const updatedAt = new Date(entry.updatedAt);

  const formattedUpdatedAt = updatedAt.toLocaleString("zh-TW", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  return (
    <section className="flex flex-col w-full gap-8">
      <div className="flex items-start justify-between text-dark dark:text-cream">
        <div>
          <h2 className="mb-2 text-lg font-bold">{title}</h2>
          <p className="text-sm">
            最後更新
            <time className="ml-2" dateTime={entry.updatedAt}>
              {formattedUpdatedAt}
            </time>
          </p>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="px-4 py-2 text-sm rounded-full font-regular bg-milkTeaBrown text-cream"
        >
          編輯
        </button>
      </div>

      <div className="p-6 space-y-3 text-sm rounded-3xl bg-cream/80 dark:bg-cream/10">
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
          <p className="text-milkTeaBrown dark:text-cream/80">
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
          <p className="text-milkTeaBrown dark:text-cream/80">
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
          label={`${dayLabel}在意的事`}
          value={entry.eventNote || "未記錄"}
        />
      </div>

      <div className="flex justify-center gap-4 px-10 py-6 ark:bg-cream/20 rounded-3xl bg-cream/80 dark:bg-cream/10">
        <div className="flex flex-col font-semibold text-center">
          <p className="text-milkTeaBrown dark:text-peach">
            感謝你紀錄{dayLabel}的自己
          </p>
          <p className="dark:text-cream100 text-dark">
            你正在一步步照顧自己，好棒！
          </p>
        </div>

        <div className="text-4xl text-milkTeaBrown dark:text-peach">
          ♡
        </div>
      </div>
    </section>
  );
}
