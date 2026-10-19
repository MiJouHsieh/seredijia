export function getMedicationStats(entries) {
  const medicationStats = {
    daytime: {
      taken: 0,
      notTaken: 0,
    },
    nighttime: {
      taken: 0,
      notTaken: 0,
    },
    sleep: {
      taken: 0,
      missed: 0,
      notNeeded: 0,
    },
  };

  entries.forEach((entry) => {
    if (entry.daytime_medication === true) {
      medicationStats.daytime.taken += 1;
    } else if (entry.daytime_medication === false) {
      medicationStats.daytime.notTaken += 1;
    }

    if (entry.nighttime_medication === true) {
      medicationStats.nighttime.taken += 1;
    } else if (entry.nighttime_medication === false) {
      medicationStats.nighttime.notTaken += 1;
    }

    const sleepStatus = entry.sleep_medication_status;

    if (Object.hasOwn(medicationStats.sleep, sleepStatus)) {
      medicationStats.sleep[sleepStatus] += 1;
    }
  });

  return medicationStats;
}