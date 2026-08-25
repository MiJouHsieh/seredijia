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

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              aria-pressed={isSelected}
              className={`rounded-2xl px-3 py-4 transition ${
                isSelected
                  ? "bg-coral/80 scale-105 text-stone-500 shadow-md dark:text-stone-300"
                  : "bg-stone-300/40 text-stone-400 dark:bg-stone-600/40 dark:text-stone-400/90"
              } `}
            >
              <span
                className={`${!isSelected ? "opacity-70" : ""} block text-2xl`}
              >
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
