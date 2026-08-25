const medicationGroups = [
  {
    key: "daytimeMedication",
    options: [
      { label: "白天有吃藥", value: true },
      { label: "白天沒吃藥", value: false },
    ],
  },
  {
    key: "nighttimeMedication",
    options: [
      { label: "晚上有吃藥", value: true },
      { label: "晚上沒吃藥", value: false },
    ],
  },
];

export function MedicationSection({ formData, setFormData }) {
  function getButtonClass(isSelected) {
    return `
      rounded-full px-4 py-3 focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-coral/50 transition-colors duration-700
      ${
        isSelected
          ? "bg-coral/80 text-stone-500 shadow-md dark:text-stone-300"
          : "bg-stone-300/40 text-stone-400 dark:bg-stone-600/40 dark:text-stone-400/90"
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
    <section className="section-style">
      <h2 className="text-xl font-semibold text-center">
        今天有按時吃藥嗎？
      </h2>

      {/* <div className="grid grid-cols-2 gap-3">
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
      </div> */}

      {medicationGroups.map((group) => (
        <div key={group.key} className="grid grid-cols-2 gap-3">
          {group.options.map((option) => {
            const isSelected =
              formData[group.key] === option.value;

            return (
              <button
                key={String(option.value)}
                type="button"
                aria-pressed={isSelected}
                className={getButtonClass(isSelected)}
                onClick={() =>
                  handleMedicationChange(group.key, option.value)
                }
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ))}
    </section>
  );
}
