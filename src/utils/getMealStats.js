export function getMealStats(entries) {
  const mealStats = {
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  };

  entries.forEach((entry) => {
    if (entry.breakfast === true) {
      mealStats.breakfast += 1;
    }
    if (entry.lunch === true) {
      mealStats.lunch += 1;
    }
    if (entry.dinner === true) {
      mealStats.dinner += 1;
    }
  });

  return mealStats;
}