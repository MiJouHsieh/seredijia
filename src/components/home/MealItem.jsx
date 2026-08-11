export function MealItem({
  mealName,
  mealInput,
  label,
  note,
  isSelected,
  isInputOpen,
  onMealChange,
  onOpenInput,
  onMealInputChange,
  onAddMealNote,
  onMealNoteChange,
  onDeleteMealNote,
}) {
  function getButtonClass(isSelected) {
    return `
      rounded-full px-4 py-3 transition w-full
      ${
        isSelected
          ? "bg-pink-400 text-white"
          : "bg-gray-200 text-gray-600"
      }
    `;
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        aria-pressed={isSelected}
        className={getButtonClass(isSelected)}
        onClick={() => onMealChange(mealName)}
      >
        {label}
      </button>

      {isSelected && !note && !isInputOpen && (
        <button
          type="button"
          aria-label={`新增${label}內容`}
          onClick={() => onOpenInput(mealName)}
          className="flex items-center justify-center text-xl bg-white rounded-full size-9"
        >
          +
        </button>
      )}

      {isSelected && isInputOpen && !note && (
        <input
          type="text"
          autoFocus
          placeholder={`${label}吃了什麼？`}
          value={mealInput}
          onChange={(event) =>
            onMealInputChange(event.target.value)
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onAddMealNote(mealName);
            }
          }}
          onBlur={() => {
            onAddMealNote(mealName);
          }}
          className="w-full px-3 py-2 text-sm border border-pink-300 outline-none rounded-2xl bg-white/80"
        />
      )}

      {isSelected && note && (
        <div className="flex items-center w-full gap-1 px-3 py-2 mt-2 border border-pink-400 rounded-full bg-white/50">
          <input
            type="text"
            value={note}
            onChange={(event) =>
              onMealNoteChange(mealName, event.target.value)
            }
            className="w-full min-w-0 bg-transparent outline-none"
          />

          <button
            type="button"
            aria-label={`刪除${label}紀錄`}
            onClick={() => onDeleteMealNote(mealName)}
            className="text-lg shrink-0"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}