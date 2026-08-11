import { useState } from "react";
import { MealItem } from "src/components/home/MealItem";

export function MealsSection({ formData, setFormData }) {
  const [openMealInput, setOpenMealInput] = useState(null);
  const [mealInput, setMealInput] = useState("");

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

  const mealOptions = [
    {
      name: "breakfast",
      label: "早餐",
    },
    {
      name: "lunch",
      label: "午餐",
    },
    {
      name: "dinner",
      label: "晚餐",
    },
  ];

  return (
    <section className="space-y-4 rounded-[32px] bg-pink-200/80 p-5 shadow-lg">
      <h2 className="text-xl font-semibold text-center text-stone-700">
        今天有吃飯嗎？
      </h2>

      <div className="grid items-start grid-cols-3 gap-3">
        {mealOptions.map((meal) => (
          <MealItem
            key={meal.name}
            mealName={meal.name}
            label={meal.label}
            isSelected={formData.meals[meal.name]}
            note={formData.mealNotes[meal.name]}
            isInputOpen={openMealInput === meal.name}
            mealInput={mealInput}
            onMealChange={handleMealChange}
            onOpenInput={setOpenMealInput}
            onMealInputChange={setMealInput}
            onAddMealNote={handleAddMealNote}
            onMealNoteChange={handleMealNoteChange}
            onDeleteMealNote={handleDeleteMealNote}
          />
        ))}
      </div>
    </section>
  );
}
