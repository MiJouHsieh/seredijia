export function TodayCheckInHeader({
  currentDate,
  hasEntry,
  isEditing,
  displayName,
  dayLabel,
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
          ? `編輯${dayLabel}的紀錄 ♡`
          : hasEntry
            ? `${dayLabel}的紀錄已儲存 ♡`
            : `留下${dayLabel}的紀錄 ♡`}
      </p>

      {displayName && (
        <p className="w-full my-3 text-center font-mdmedium text-milkTea">
          嗨，{displayName} 我們來看看{dayLabel}吧 ♡
        </p>
      )}
    </header>
  );
}
