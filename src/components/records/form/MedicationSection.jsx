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
      focus-visible:ring-peach/50 transition-colors duration-700
      ${
        isSelected
          ? "bg-softPeach/80 text-stone-500 shadow-md dark:text-purple100"
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
