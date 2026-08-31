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
      rounded-full px-4 py-3 w-full transition-colors
      ${
        isSelected
          ? "bg-coral/80 text-stone-500 shadow-md dark:text-stone-300"
          : "bg-stone-300/40 text-stone-400 dark:bg-stone-600/40 dark:text-stone-400/90"
      }
    `;
  }

  return (
    <div className="flex flex-col items-center gap-5 text-base">
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
          className="flex items-center justify-center text-xl rounded-full ring-coral size-9 ring-1 dark:bg-transparent"
        >
          +
        </button>
      )}

      {isSelected && isInputOpen && !note && (
        <input
          type="text"
          autoFocus
          placeholder={`${label}吃什麼？`}
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
          className="w-full px-3 py-2 text-sm rounded-full outline-none ring-coral/50 bg-softPurple/10 h-11 text-stone-700 ring-1 dark:text-stone-400/90"
        />
      )}

      {isSelected && note && (
        <div className="flex items-center w-full gap-1 px-3 py-2 rounded-full bg-softPurple/20 focus-within:ring-coral focus-within:ring-1">
          <input
            type="text"
            value={note}
            onChange={(event) =>
              onMealNoteChange(mealName, event.target.value)
            }
            className="w-full min-w-0 bg-transparent outline-none text-stone-700 dark:text-stone-300"
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
