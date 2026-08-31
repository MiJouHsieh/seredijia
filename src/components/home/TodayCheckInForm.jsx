import { CheckInChecklist } from "./CheckInChecklist";
import { MoodSection } from "./MoodSection";
import { MedicationSection } from "./MedicationSection";
import { SleepMedicationSection } from "./SleepMedicationSection";
import { MealsSection } from "./MealsSection";
import { DailyEventSection } from "./DailyEventSection";

export function TodayCheckInForm({
  formData,
  setFormData,
  onSave,
  isEditing,
}) {
  function handleSubmit(event) {
    event.preventDefault();
    onSave();
  }

  const checkInItems = [
    {
      id: "mood",
      label: "今日心情",
      isComplete: formData.mood !== null,
    },
    {
      id: "medication",
      label: "按時吃藥",
      isComplete:
        formData.daytimeMedication !== null &&
        formData.nighttimeMedication !== null,
    },
    {
      id: "sleepMedication",
      label: "助眠藥",
      isComplete: formData.sleepMedication !== null,
    },
    {
      id: "meals",
      label: "今日飲食",
      isComplete:
        formData.meals.breakfast ||
        formData.meals.lunch ||
        formData.meals.dinner,
    },
    {
      id: "event",
      label: "今日在意的事",
      isComplete: formData.eventNote.trim() !== "",
      optional: true,
    },
  ];

  return (
    <form
      className="relative mx-auto grid w-full min-w-[345px] justify-items-center gap-0 space-y-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:space-y-0"
      onSubmit={handleSubmit}
    >
      <CheckInChecklist items={checkInItems} />

      <div className="w-full max-w-xl space-y-4">
        <MoodSection
          formData={formData}
          setFormData={setFormData}
        />

        <MedicationSection
          formData={formData}
          setFormData={setFormData}
        />

        <SleepMedicationSection
          formData={formData}
          setFormData={setFormData}
        />

        <MealsSection
          formData={formData}
          setFormData={setFormData}
        />

        <DailyEventSection
          value={formData.eventNote}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              eventNote: event.target.value,
            }))
          }
        />

        <button
          type="submit"
          className="w-full rounded-full bg-purple py-4 font-semibold text-cream hover:bg-softPurple dark:bg-[#30194b] hover:dark:bg-[#422266]"
        >
          ♡ {isEditing ? "更新今天記錄" : "儲存今天記錄"}
        </button>
      </div>
    </form>
  );
}
