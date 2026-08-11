export function MedicationSection({ formData, setFormData }) {

  function getButtonClass(isSelected) {
    return `
      rounded-full px-4 py-3 transition
      ${
        isSelected
          ? "bg-pink-400 text-white"
          : "bg-gray-200 text-gray-600"
      }
    `;
  }

  function handleMedicationChange(medicationType, value) {
    setFormData((prev) => ({
      ...prev,
      [medicationType]: value,
    }));
  }

  return (
    <section className="space-y-4 rounded-[32px] bg-pink-200/80 p-5 shadow-lg">
      <h2 className="text-xl font-semibold text-center text-stone-700">
        今天有按時吃藥嗎？
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          aria-pressed={formData.daytimeMedication === true}
          className={getButtonClass(
            formData.daytimeMedication === true,
          )}
          onClick={() =>
            handleMedicationChange("daytimeMedication", true)
          }
        >
          白天有吃藥
        </button>

        <button
          type="button"
          aria-pressed={formData.daytimeMedication === false}
          className={getButtonClass(
            formData.daytimeMedication === false,
          )}
          onClick={() =>
            handleMedicationChange("daytimeMedication", false)
          }
        >
          白天沒吃藥
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          aria-pressed={formData.nighttimeMedication === true}
          className={getButtonClass(
            formData.nighttimeMedication === true,
          )}
          onClick={() =>
            handleMedicationChange("nighttimeMedication", true)
          }
        >
          晚上有吃藥
        </button>

        <button
          type="button"
          aria-pressed={formData.nighttimeMedication === false}
          className={getButtonClass(
            formData.nighttimeMedication === false,
          )}
          onClick={() =>
            handleMedicationChange("nighttimeMedication", false)
          }
        >
          晚上沒吃藥
        </button>
      </div>
    </section>
  );
}
