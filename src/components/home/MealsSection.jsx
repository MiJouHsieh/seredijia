import {useState} from "react"

export function MealsSection({ formData, setFormData }) {
  const [openMealInput, setOpenMealInput] = useState(null);
  const [mealInput, setMealInput] = useState("");

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

  function handleMealChange(mealName) {
    setFormData((prev) => ({
      ...prev,
      meals: {
        ...prev.meals,
        [mealName]: !prev.meals[mealName],
      },
    }));
  }

  function handleMealNoteChange(mealName, value) {
    setFormData((prev) => ({
      ...prev,
      mealNotes: {
        ...prev.mealNotes,
        [mealName]: value,
      },
    }));
  }

  //確認新增
  function handleAddMealNote(mealName) {
    if (!mealInput.trim()) return;

    handleMealNoteChange(mealName, mealInput.trim());

    setMealInput("");
    setOpenMealInput(null);
  }

  function handleDeleteMealNote(mealName) {
    setFormData((prev) => ({
      ...prev,
      mealNotes: {
        ...prev.mealNotes,
        [mealName]: "",
      },
    }));
  }

  return (
    <section className="space-y-4 rounded-[32px] bg-pink-200/80 p-5 shadow-lg">
      <h2 className="text-xl font-semibold text-center text-stone-700">
        今天有吃飯嗎？
      </h2>

      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          aria-pressed={formData.meals.breakfast}
          className={getButtonClass(formData.meals.breakfast)}
          onClick={() => handleMealChange("breakfast")}
        >
          早餐
        </button>

        <button
          type="button"
          aria-pressed={formData.meals.lunch}
          className={getButtonClass(formData.meals.lunch)}
          onClick={() => handleMealChange("lunch")}
        >
          午餐
        </button>

        <button
          type="button"
          aria-pressed={formData.meals.dinner}
          className={getButtonClass(formData.meals.dinner)}
          onClick={() => handleMealChange("dinner")}
        >
          晚餐
        </button>
      </div>

      {formData.meals.lunch && (
        <div className="mt-4">
          {!formData.mealNotes.lunch &&
            openMealInput !== "lunch" && (
              <button
                type="button"
                onClick={() => setOpenMealInput("lunch")}
                className="flex items-center justify-center ml-auto text-xl bg-white rounded-full h-9 w-9"
              >
                +
              </button>
            )}

          {openMealInput === "lunch" &&
            !formData.mealNotes.lunch && (
              <input
                type="text"
                autoFocus
                placeholder="午餐吃了什麼？"
                value={mealInput}
                onChange={(event) =>
                  setMealInput(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleAddMealNote("lunch");
                  }
                }}
                onBlur={() => {
                  handleAddMealNote("lunch");
                }}
                className="w-full px-4 py-3 border border-pink-300 outline-none rounded-2xl bg-white/80"
              />
            )}

          {formData.mealNotes.lunch && (
            <div className="inline-flex items-center gap-2 px-4 py-2 mt-2 border border-pink-400 rounded-full bg-white/50">
              <input
                type="text"
                value={formData.mealNotes.lunch}
                onChange={(event) =>
                  handleMealNoteChange(
                    "lunch",
                    event.target.value,
                  )
                }
                className="w-auto bg-transparent outline-none"
              />

              <button
                type="button"
                aria-label="刪除午餐紀錄"
                onClick={() => handleDeleteMealNote("lunch")}
                className="flex items-center justify-center text-lg"
              >
                ×
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
