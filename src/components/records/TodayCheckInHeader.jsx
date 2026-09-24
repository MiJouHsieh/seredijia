export function TodayCheckInHeader({
  currentDate,
  hasEntry,
  isEditing,
  displayName,
}) {
  const formattedDate = currentDate.toLocaleDateString("zh-TW", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  const isToday =
    currentDate.toDateString() === new Date().toDateString();

  const dateLabel = isToday ? "今天" : "這一天";

  return (
    <header className="w-full text-sm text-center text-milkTeaDark dark:text-cream/80">
      <time dateTime={currentDate.toISOString()}>
        {formattedDate}
      </time>

      <p>
        {isEditing
          ? `編輯${dateLabel}的紀錄 ♡`
          : hasEntry
            ? `${dateLabel}的紀錄已儲存 ♡`
            : `留下${dateLabel}的紀錄 ♡`}
      </p>

      {displayName && (
        <p className="w-full my-3 text-center font-mdmedium text-milkTea">
          嗨，{displayName} 我們來看看{dateLabel}吧 ♡
        </p>
      )}
    </header>
  );
}
