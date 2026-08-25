const moodOptions = [
  { value: "happy", label: "開心", emoji: "😊" },
  { value: "calm", label: "平靜", emoji: "😌" },
  { value: "okay", label: "普通", emoji: "😐" },
  { value: "sad", label: "難過", emoji: "☹️" },
  { value: "overwhelmed", label: "不堪負荷", emoji: "😣" },
];

export function MoodSection({ formData, setFormData }) {
  const handleMoodChange = (mood) => {
    setFormData((prev) => ({
      ...prev,
      mood,
    }));
  };

  const handleNoteChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      moodNote: event.target.value,
    }));
  };

  return (
    <section className="section-style">
      <div className="text-center">
        <h2 className="text-xl font-semibold">
          今天心情還好嗎？
        </h2>

        <p className="mt-1 text-sm text-stone-400">
          最接近現在的感受
        </p>
      </div>

      <div className="grid grid-cols-5 gap-1 mt-6">
        {moodOptions.map((option) => {
          const isSelected = formData.mood === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => handleMoodChange(option.value)}
              className="flex flex-col items-center gap-2 focus-visible:ring-coral/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-900"
            >
              <span
                className={`flex size-14 items-center justify-center rounded-full text-2xl transition ${
                  isSelected
                    ? "bg-coral/80 scale-105 shadow-md"
                    : "bg-stone-300/40 opacity-70 dark:bg-stone-600/40"
                } `}
              >
                {option.emoji}
              </span>

              <span
                className={
                  isSelected
                    ? "text-sm font-semibold text-stone-500 dark:text-stone-400"
                    : "text-sm text-stone-400 dark:text-stone-400/90"
                }
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      <label className="block mt-6">
        <span className="text-sm font-semibold text-stone-500 dark:text-stone-400">
          想記下什麼嗎？
          <span className="ml-2 font-normal text-stone-400 dark:text-stone-500">
            選填
          </span>
        </span>

        <textarea
          value={formData.moodNote ?? ""}
          onChange={handleNoteChange}
          placeholder="今天發生的事，或現在有什麼感受……"
          className="textarea-style"
        />
      </label>
    </section>
  );
}
