export function SleepMedicationSection({ formData, setFormData }) {
  const options = [
    {
      value: "taken",
      label: "有服用",
      emoji: "🌙",
    },
    {
      value: "missed",
      label: "需要但沒服用",
      emoji: "💭",
    },
    {
      value: "notNeeded",
      label: "不需要服用",
      emoji: "✨",
    },
  ];

  const handleSelect = (value) => {
    setFormData((prev) => ({
      ...prev,
      sleepMedication: value,
    }));
  };
  
  return (
    <section className="section-style">
      <div className="mb-4 text-center">
        <h2 className="text-xl font-semibold">
          今天有服用助眠藥嗎？
        </h2>

        <p className="mt-1 text-sm text-stone-400">
          記錄睡前的用藥狀況
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {options.map((option) => {
          const isSelected =
            formData.sleepMedication === option.value;

          const hasSelection = formData.sleepMedication !== null;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`rounded-2xl px-3 py-4 transition ${
                isSelected
                  ? "text-cream bg-rose-400 shadow-md"
                  : hasSelection
                    ? "dark:bg-softCoral/20 text-stone-400"
                    : "bg-cream/90 border border-coral text-stone-700"
              } `}
            >
              <span className="block text-2xl">
                {option.emoji}
              </span>

              <span className="block mt-2 text-sm font-medium">
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
