import { useState } from "react";

import { TodayCheckInHeader } from "src/components/records/TodayCheckInHeader";
import { RecordForm } from "src/components/records/RecordForm";
import { RecordCard } from "src/components/records/RecordCard";
import { useAuth } from "src/context/AuthContext";

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

export function TodayRecordPage() {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.name;
  const [formData, setFormData] = useState(initialFormData);

  const [moodEntries, setMoodEntries] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const currentDate = new Date();

  const todayEntry = moodEntries.find(
    (entry) =>
      getDateKey(entry.createdAt) === getDateKey(currentDate),
  );

  const shouldShowForm = isEditing || !todayEntry;

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
        <div className="mx-auto flex max-w-[500px] flex-col items-center gap-8 rounded-3xl md:max-w-[600px] md:px-6 lg:max-w-[800px]">
          <TodayCheckInHeader
            currentDate={currentDate}
            hasTodayEntry={Boolean(todayEntry)}
            isEditing={isEditing}
          />
        </div>
        {displayName && (
          <p className="w-full my-3 text-center font-mdmedium text-milkTea">
            嗨，{displayName} 我們來看看今天吧 ♡
          </p>
        )}
        {shouldShowForm ? (
          <RecordForm
            formData={formData}
            setFormData={setFormData}
            isEditing={isEditing}
            onSave={handleSaveEntry}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <RecordCard
            entry={todayEntry}
            onEdit={handleEditEntry}
          />
        )}
      </div>
    </main>
  );
}
