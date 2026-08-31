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
    const trimmedInput = mealInput.trim();

    if (trimmedInput) {
      handleMealNoteChange(mealName, trimmedInput);
    }
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
    <section className="section-style">
      <h2 className="text-xl font-semibold text-center">
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
