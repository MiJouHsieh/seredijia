import { Link } from "react-router";

export function RecordOverview() {
  return (
    <section className="flex flex-col w-full gap-8">
      <div>
        <h4 className="text-milkTeaDark dark:text-cream100">
          最近的自己
        </h4>

        <div className="relative overflow-hidden bg-center bg-cover rounded-2xl">
          <div className="aspect-[6/3] w-full">
            <img
              src="/src/assets/cosmos.jpg"
              alt=""
              className="object-cover w-full h-full"
            />
          </div>
          <div className="bg-cream100/80 dark:bg-milkTeaDark/30 425:w-[75%] 500:w-[65%] absolute bottom-[0%] right-0 flex h-[40%] w-[85%] items-center justify-end gap-5 rounded-xl px-5 py-3 opacity-90 backdrop-blur-sm">
            <div className="flex flex-col gap-1 text-sm text-dark dark:text-cream">
              <p>過去 7 天</p>
              <p>😊😊😊😊😊😊😊</p>
              <p>已留下 23 天紀錄</p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                to="/history?range=7d"
                className="flex justify-center font-medium transition-colors duration-200 border-b-4 hover:border-peach dark:border-cream200 border-milkTeaDark text-dark dark:text-cream"
              >
                查看一週紀錄
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h4 className="dark:text-cream100 text-milkTeaDark">
          快速入口
        </h4>
        <div className="relative overflow-hidden rounded-2xl">
          <div className="aspect-[6/3] w-full">
            <img
              src="/src/assets/farm.jpg"
              alt=""
              className="object-cover w-full h-full"
            />
          </div>
          <div className="bg-cream100/50 dark:bg-milkTeaDark/30 absolute bottom-[0%] right-0 flex h-[35%] w-[65%] items-center justify-end rounded-xl py-3 pr-5 opacity-90 backdrop-blur-sm">
            <div className="flex justify-between gap-5">
              <Link
                to="/history"
                aria-label="Seredijia 歷史紀錄頁"
                className="flex justify-center font-medium transition-colors duration-200 border-b-4 hover:border-peach dark:border-cream200 border-milkTeaDark text-dark dark:text-cream"
              >
                歷史紀錄
              </Link>

              <Link
                to="/report"
                aria-label="Seredijia 狀態回顧頁"
                className="flex justify-center font-medium transition-colors duration-200 border-b-4 hover:border-peach dark:border-cream200 border-milkTeaDark text-dark dark:text-cream"
              >
                狀態回顧
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
