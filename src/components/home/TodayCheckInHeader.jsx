export function TodayCheckInHeader({
  currentDate,
  hasTodayEntry,
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
        {hasTodayEntry
          ? "今天已經完成記錄了 ♡"
          : "記錄五項就好囉"}
      </p>
    </header>
  );
}
