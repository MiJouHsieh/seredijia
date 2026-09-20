import { Link } from "react-router";

export function TodayStatusCard({ displayName, todayEntry }) {
  const currentDate = new Date();

  function getGreeting(date = new Date()) {
    const hour = date.getHours();

    if (hour < 12) {
      return "早安";
    }

    if (hour < 18) {
      return "午安";
    }

    return "晚安";
  }

  return (
    <section className="w-full">
      {displayName && (
        <p className="w-full py-6 text-lg font-medium text-milkTeaDark dark:text-cream100 text-start">
          {getGreeting(currentDate)}，{displayName} ♡
        </p>
      )}

      <p className="text-milkTeaDark dark:text-cream100">
        {currentDate.toLocaleDateString("zh-TW", {
          month: "long",
          day: "numeric",
          weekday: "long",
        })}
      </p>
      <div className="relative overflow-hidden rounded-2xl">
        <div className="aspect-[6/3] w-full">
          <img
            src="/src/assets/wave.jpg"
            alt=""
            className="object-cover w-full h-full"
          />
        </div>

        <div className="bg-cream100/50 dark:bg-milkTeaDark/30 absolute bottom-0 right-0 flex h-[35%] w-[65%] items-center justify-end rounded-xl py-3 pr-5 opacity-90 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center gap-3 text-dark dark:text-cream">
            <p className="text-sm">
              {todayEntry
                ? "今天的紀錄已保存"
                : "今天想留下些什麼？"}
            </p>
            <Link
              to="/today-record"
              className="font-medium transition-colors duration-200 border-b-4 hover:border-peach dark:border-cream200 border-milkTeaDark hover:text-cream"
            >
              {todayEntry
                ? "查看或編輯今日紀錄"
                : "開始今日紀錄"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
