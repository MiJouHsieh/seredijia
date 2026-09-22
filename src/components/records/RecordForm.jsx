import { CheckInChecklist } from "src/components/records/form/CheckInChecklist";
import { MoodSection } from "src/components/records/form/MoodSection";
import { MedicationSection } from "src/components/records/form/MedicationSection";
import { SleepMedicationSection } from "src/components/records/form/SleepMedicationSection";
import { MealsSection } from "src/components/records/form/MealsSection";
import { DailyEventSection } from "src/components/records/form/DailyEventSection";

export function RecordForm({
  formData,
  setFormData,
  onSave,
  isEditing,
  onCancel,
  isSaving,
  saveError,
}) {
  async function handleSubmit(event) {
    event.preventDefault();

    if (isSaving) return;
    await onSave();
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
      className="relative mx-auto grid w-full min-w-[345px] justify-items-center gap-4 lg:max-w-[820px] lg:grid-cols-[180px_minmax(0,576px)] lg:items-center"
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
        
        {saveError && (
          <p role="alert" className="text-center text-red-600">
            {saveError}
          </p>
        )}
        
        <button
          type="submit"
          disabled={isSaving}
          className="cta-btn-style dark:text-purple100"
        >
          {isSaving
            ? "儲存中…"
            : `♡ ${isEditing ? "儲存修改" : "儲存今天記錄"}`}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="block px-4 py-3 mx-auto mt-5 underline text-milkTeaDark dark:text-milkTea underline-offset-8"
          >
            取消編輯
          </button>
        )}
      </div>
    </form>
  );
}
