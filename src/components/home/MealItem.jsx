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
          ? "bg-softPeach/80 text-stone-500 shadow-md dark:text-purple100"
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
          className="flex items-center justify-center text-xl rounded-full ring-peach size-9 ring-1 dark:bg-transparent"
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
          className="inputItem"
        />
      )}

      {isSelected && note && (
        <div className="flex items-center w-full gap-1 px-3 py-2 rounded-full focus-within:ring-peach bg-cream100 dark:bg-cream200/20 focus-within:ring-1">
          <input
            type="text"
            value={note}
            onChange={(event) =>
              onMealNoteChange(mealName, event.target.value)
            }
            className="mealItem"
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
