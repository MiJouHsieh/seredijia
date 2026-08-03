export function MealsSection({ formData, setFormData }) {

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
        [mealName]: !prev.meals[mealName]
      }
    }))
  }

  return (
    <section className="space-y-4 rounded-[32px] bg-pink-200/80 p-5 shadow-lg">
      <h2>今天有吃飯嗎？</h2>

      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          aria-pressed={formData.meals.breakfast}
          className={getButtonClass(
            formData.meals.breakfast
          )}
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
    </section>
  );
}
