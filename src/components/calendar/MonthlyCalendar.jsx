import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "src/components/calendar/MonthlyCalendar.css";
import { Link } from "react-router";
import { SelectedRecordCard } from "src/components/calendar/SelectedRecordCard";

export function MonthlyCalendar({
  monthlyEntries = [],
  selectedMonth,
  onMonthChange,
}) {
  //「主動點選」的日期
  const [selectedDate, setSelectedDate] = useState(null);

  // 當切換月份：
  function handleMonthChange({ activeStartDate }) {
    onMonthChange(activeStartDate);
    setSelectedDate(null);
  }

  function getDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function formatDateLabel(dateString) {
    const date = new Date(`${dateString}T00:00:00`);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${month}/${day}`;
  }

  function getMoodEmoji(mood) {
    const moodMap = {
      happy: "🙂",
      calm: "😌",
      okay: "😐",
      sad: "😔",
      overwhelmed: "😣",
    };

    return moodMap[mood] ?? "";
  }

  function getTileClassName({ date, view }) {
    if (view !== "month") return "";

    const todayKey = getDateKey(new Date());
    const dateKey = getDateKey(date);
    const selectedKey = selectedDate
      ? getDateKey(selectedDate)
      : null;

    const classes = [];

    if (dateKey === todayKey) {
      classes.push("calendar-today");
    }

    if (dateKey === selectedKey) {
      classes.push("calendar-selected");
    }

    return classes.join(" ");
  }

  function renderTileContent({ date, view }) {
    if (view !== "month") return null;

    const dateKey = getDateKey(date);
    const todayKey = getDateKey(new Date());

    const entry = monthlyEntries.find(
      (entry) => entry.record_date === dateKey,
    );

    // 未來日期不顯示 +
    if (dateKey > todayKey) {
      return null;
    }

    // 有紀錄
    if (entry) {
      return (
        <span className="calendar-mood flex w-full items-center justify-center text-[34px]">
          {getMoodEmoji(entry.mood) || "♡"}
        </span>
      );
    }

    // 沒有紀錄
    return (
      <span className="calendar-add-icon">
        <FiPlus />
      </span>
    );
  }

  const selectedEntry = selectedDate
    ? monthlyEntries.find(
        (entry) => entry.record_date === getDateKey(selectedDate),
      )
    : null;

  return (
    <div>
      <Calendar
        activeStartDate={selectedMonth}
        onActiveStartDateChange={handleMonthChange}
        formatDay={(locale, date) => date.getDate()}
        value={selectedDate}
        onChange={setSelectedDate}
        maxDate={new Date()}
        calendarType="iso8601"
        tileContent={renderTileContent}
        tileClassName={getTileClassName}
        showNeighboringMonth={true}
        prev2Label={null}
        next2Label={null}
      />

      {selectedEntry && (
        <SelectedRecordCard entry={selectedEntry} />
      )}

      {selectedDate && !selectedEntry && (
        <div className="flex justify-end mt-3 underline underline-offset-4">
          <Link
            to={`/records/${getDateKey(selectedDate)}`}
            className="flex items-center gap-1 font-medium transition-colors duration-200 cursor-pointer hover:text-clayPeach border-milkTeaDark dark:hover:text-peach text-dark dark:text-cream"
          >
            <FiPlus />
            新增{formatDateLabel(getDateKey(selectedDate))}的紀錄
            →
          </Link>
        </div>
      )}
    </div>
  );
}
