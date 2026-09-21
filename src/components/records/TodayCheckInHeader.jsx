export function TodayCheckInHeader({
  currentDate,
  hasTodayEntry,
  isEditing,
}) {
  const formattedDate = currentDate.toLocaleDateString("zh-TW", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <header className="w-full text-sm text-center text-milkTeaDark dark:text-cream/80">
      <time dateTime={currentDate.toISOString()}>
        {formattedDate}
      </time>

      <p>
        {isEditing
          ? "編輯今天的紀錄 ♡"
          : hasTodayEntry
            ? "今天的紀錄已儲存 ♡"
            : "留下今天的紀錄 ♡"}
      </p>
    </header>
  );
}
