import { useState } from "react";

import { TodayCheckInHeader } from "src/components/home/TodayCheckInHeader";
import { TodayCheckInForm } from "src/components/home/TodayCheckInForm";
import { TodayRecordCard } from "src/components/home/TodayRecordCard";

//今天日期
function getDateKey(dateValue) {
  const date = new Date(dateValue);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const initialFormData = {
  mood: null,
  moodNote: "",
  daytimeMedication: null,
  nighttimeMedication: null,
  sleepMedication: null,
  meals: {
    breakfast: false,
    lunch: false,
    dinner: false,
  },
  mealNotes: {
    breakfast: "",
    lunch: "",
    dinner: "",
  },
  eventNote: "",
};

export function HomePage() {
  const [formData, setFormData] = useState(initialFormData);
  const [moodEntries, setMoodEntries] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const shouldShowForm = isEditing || isFormOpen;

  const currentDate = new Date();
  //今天有無紀錄 //今天日期===近期日期
  const todayEntry = moodEntries.find((entry) => {
    return (
      getDateKey(entry.createdAt) === getDateKey(currentDate)
    );
  });

  function handleSaveEntry() {
    const now = new Date();
    const newEntry = {
      id: todayEntry?.id ?? crypto.randomUUID(),
      ...formData,
      createdAt: todayEntry?.createdAt ?? now.toISOString(),
      updatedAt: now.toISOString(),
    };

    setMoodEntries((prevEntries) => {
      const otherEntries = prevEntries.filter(
        (entry) =>
          getDateKey(entry.createdAt) !== getDateKey(now),
      );

      return [newEntry, ...otherEntries];
    });

    setIsEditing(false);
    setIsFormOpen(false);
  }

  function handleEditEntry() {
    if (!todayEntry) return;

    setFormData({
      mood: todayEntry.mood,
      moodNote: todayEntry.moodNote ?? "",
      daytimeMedication: todayEntry.daytimeMedication,
      nighttimeMedication: todayEntry.nighttimeMedication,
      sleepMedication: todayEntry.sleepMedication,
      meals: {
        ...initialFormData.meals,
        ...todayEntry.meals,
      },
      mealNotes: {
        ...initialFormData.mealNotes,
        ...todayEntry.mealNotes,
      },
      eventNote: todayEntry.eventNote ?? "",
    });

    setIsEditing(true);
  }

  return (
    <main className="relative pt-12 page-style min-h-dvh">
      <div className="relative z-10 w-full px-4 py-10">
        <div className="mx-auto flex max-w-[500px] flex-col items-center space-y-4 rounded-3xl md:max-w-[600px] md:px-6 lg:max-w-[800px]">
          <h1 className="w-full mt-2 text-4xl text-center text-coral">
            SereDijia
          </h1>
          <TodayCheckInHeader
            currentDate={currentDate}
            hasTodayEntry={Boolean(todayEntry)}
          />
          {shouldShowForm ? (
            <TodayCheckInForm
              formData={formData}
              setFormData={setFormData}
              isEditing={isEditing}
              onSave={handleSaveEntry}
            />
          ) : todayEntry ? (
            <TodayRecordCard
              entry={todayEntry}
              onEdit={handleEditEntry}
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="w-full rounded-full bg-purple py-4 font-semibold text-cream hover:bg-softPurple dark:bg-[#30194b] hover:dark:bg-[#422266] ring-slate-100/10 ring-1"
            >
              開始今日紀錄
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
