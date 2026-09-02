import Logo from "src/assets/favicon.svg?react";
import { RxHamburgerMenu } from "react-icons/rx";
import { LuSun, LuMoon } from "react-icons/lu";

export function Nav() {
  const toggleDarkMode = () => {
    window.document.documentElement.classList.toggle("dark");

    localStorage.setItem(
      "isDarkMode",
      window.document.documentElement.classList.contains("dark"),
    );
  };

  return (
    <nav className="fixed top-0 z-30 flex items-center w-full py-2 text-base leading-6">
      <div className="mx-auto flex w-[calc(100%-24px)] max-w-6xl items-center justify-between rounded-full bg-cream/20 px-5 py-3 backdrop-blur-[5px]">
        <a href="#">
          <Logo className="size-10" />
        </a>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label="切換深淺色模式"
            className="p-2 border border-transparent rounded-full text-milkTea dark:text-peach dark:hover:border-peach hover:border-milkTea"
          >
            <LuMoon className="size-6 dark:hidden" />
            <LuSun className="hidden size-6 dark:block" />
          </button>
          <button>
            <RxHamburgerMenu className="text-milkTea dark:text-peach size-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
