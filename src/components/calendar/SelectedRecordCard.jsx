import { Link } from "react-router";

const moodLabels = {
  happy: "開心",
  calm: "平靜",
  okay: "普通",
  sad: "難過",
  overwhelmed: "不堪負荷",
};

const moodEmojis = {
  happy: "🙂",
  calm: "😌",
  okay: "😐",
  sad: "😔",
  overwhelmed: "😣",
};

function formatDateLabel(dateString) {
  const date = new Date(`${dateString}T00:00:00`);

  const month = date.getMonth() + 1;
  const day = date.getDate();

  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const weekday = weekdays[date.getDay()];

  return `${month}/${day}（${weekday}）`;
}

export function SelectedRecordCard({ entry }) {
  if (!entry) return null;
  const hasNotes = entry.mood_note || entry.event_note;

  return (
    <section className="w-full p-5 mt-4 space-y-3 rounded-3xl bg-cream/80 dark:bg-cream/10">
      {/* 日期 */}
      <p className="text-sm font-medium text-dark/60 dark:text-cream/60">
        {formatDateLabel(entry.record_date)}
      </p>

      {/* 心情 */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">
          {moodEmojis[entry.mood] ?? "♡"}
        </span>

        <div>
          <p className="text-sm text-dark/60 dark:text-cream/60">
            心情
          </p>

          <p className="font-semibold text-dark dark:text-cream">
            {moodLabels[entry.mood] ?? "未記錄"}
          </p>
        </div>
      </div>

      {/* 心情備註 */}
      {entry.mood_note && (
        <div>
          <p className="mb-1 text-sm text-dark/60 dark:text-cream/60">
            想記下什麼嗎？
          </p>

          <p className="text-dark dark:text-cream">
            {entry.mood_note}
          </p>
        </div>
      )}

      {/* 事件 */}
      {entry.event_note && (
        <div>
          <p className="mb-1 text-sm text-dark/60 dark:text-cream/60">
            那天在意的事
          </p>

          <p className="text-dark dark:text-cream">
            {entry.event_note}
          </p>
        </div>
      )}

      {/* 只有 mood，沒有文字紀錄 */}
      {!hasNotes && (
        <p className="text-sm text-dark/50 dark:text-cream/50">
          這天沒有留下其他文字紀錄
        </p>
      )}

      {/* 完整紀錄 */}
      <div className="flex justify-end">
        <Link
          to={`/records/${entry.record_date}`}
          className="font-medium underline transition-colors duration-200 hover:text-clayPeach dark:hover:text-peach underline-offset-4"
        >
          查看完整紀錄 →
        </Link>
      </div>
    </section>
  );
}
