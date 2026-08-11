export function MoodSection({ formData, setFormData }) {
  const moodOptions = [
    { value: "happy", label: "開心", emoji: "😊" },
    { value: "calm", label: "平靜", emoji: "😌" },
    { value: "okay", label: "普通", emoji: "😐" },
    { value: "sad", label: "難過", emoji: "☹️" },
    { value: "overwhelmed", label: "不堪負荷", emoji: "😣" },
  ];

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
    <section className="rounded-[32px] bg-pink-50/90 p-5 shadow-lg">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-stone-700">
          今天心情怎麼樣？
        </h2>

        <p className="mt-1 text-sm text-stone-500">
          最接近現在的感受
        </p>
      </div>

      <div className="grid grid-cols-5 gap-2 mt-6">
        {moodOptions.map((option) => {
          const isSelected = formData.mood === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => handleMoodChange(option.value)}
              className="flex flex-col items-center gap-2"
            >
              <span
                className={`flex size-14 items-center justify-center rounded-full text-2xl transition ${
                  isSelected
                    ? "scale-105 bg-pink-400 shadow-md"
                    : "bg-stone-200 opacity-70"
                } `}
              >
                {option.emoji}
              </span>

              <span
                className={
                  isSelected
                    ? "text-sm font-semibold text-stone-800"
                    : "text-sm text-stone-500"
                }
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      <label className="block mt-6">
        <span className="text-sm font-medium text-stone-700">
          想記下什麼嗎？
          <span className="ml-1 font-normal text-stone-400">
            選填
          </span>
        </span>

        <textarea
          value={formData.moodNote ?? ""}
          onChange={handleNoteChange}
          placeholder="今天發生了什麼，或現在有什麼感受……"
          className="w-full p-4 mt-2 transition border border-pink-200 outline-none resize-none min-h-28 rounded-2xl bg-white/60 focus:border-pink-400"
        />
      </label>
    </section>
  );
}
