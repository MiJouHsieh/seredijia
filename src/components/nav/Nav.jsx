import Logo from "src/assets/favicon.svg?react";
import { RxHamburgerMenu } from "react-icons/rx";
import { LuSun, LuMoon } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { PiShootingStarBold } from "react-icons/pi";

import { Link, useLocation, useNavigate } from "react-router"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "src/context/AuthContext"
import { NavItem } from "src/components/nav/NavItem";

const ROUTES = [
  { id: "", label: "首頁" },
  { id: "today-record", label: "今日紀錄" },
  { id: "history-record", label: "歷史紀錄" },
  { id: "report-record", label: "分析報告" },
];

export function Nav() {
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation()
  const navRef = useRef(null)
  const handleClick = () => {
    setShowMenu((prev) => !prev);
  };
  const { user, signOut } = useAuth()
  const displayName = user?.user_metadata?.name

  let navigate = useNavigate()
  async function handleSignOut() {
    await signOut()
    setShowMenu(false)
    navigate("/login")
  }
  
  useEffect(() => {
    function handleOutsideClick(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }
    if (showMenu) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    }
  })
  
  const toggleDarkMode = () => {
    window.document.documentElement.classList.toggle("dark");

    localStorage.setItem(
      "isDarkMode",
      window.document.documentElement.classList.contains("dark"),
    );
  };

  return (
    <nav className="fixed top-0 z-30 flex items-center w-full py-2 text-base leading-6 text-milkTea dark:text-peach">
      <div className="mx-auto flex w-[calc(100%-24px)] max-w-6xl items-center justify-between rounded-full bg-cream/20 px-5 py-3 backdrop-blur-[5px]">
        <Link href="/">
          <Logo className="size-10" />
        </Link>
        {user && (
          <ul className="items-center justify-end hidden gap-4 list-none md:flex">
            {ROUTES.map(({ id, label }) => {
              return (
                <NavItem
                  key={id}
                  id={id}
                  label={label}
                  pathname={location.pathname}
                />
              );
            })}
            <NavItem
              id="signout"
              label="登出"
              pathname={location.pathname}
              onClick={handleSignOut}
              to="/"
            />
          </ul>)}
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
          <button className="md:hidden">
            <RxHamburgerMenu
              className="text-milkTea dark:text-peach hover:text-peach size-6 hover:dark:text-cream"
              onClick={handleClick}
            />
          </button>
        </div>
      </div>
      {/* mobile menu */}
      {showMenu && (
        <div
          ref={navRef}
          className="text-milkTea dark:text-peach bg-milkTeaBrown/10 fixed right-0 top-0 z-20 h-screen w-[67%] max-w-[736px] pl-8 backdrop-blur-3xl dark:bg-softPurple/10 md:hidden"
        >
          <div className="flex justify-end p-4">
            <IoMdClose
              onClick={handleClick}
              className="w-10 h-10 cursor-pointer hover:text-peach"
            />
          </div>
          <ul className="flex flex-col gap-y-9">
            {user ? (
              <>
                <h3 className="flex items-center text-2xl">
                  <span>嗨，</span>
                  <span className="font-medium text-milkTeaBrown dark:text-softPeach">
                    {displayName}
                  </span>

                  <PiShootingStarBold className="ml-2" />
                </h3>
                {ROUTES.map(({ id, label }) => {
                  return (
                    <NavItem
                      key={id}
                      id={id}
                      label={label}
                      pathname={location.pathname}
                    />
                  );
                })}
                <NavItem
                  id="signout"
                  label="登出"
                  pathname={location.pathname}
                  onClick={handleSignOut}
                  to="/"
                />
              </>
            ) : (
              <>
                <NavItem
                  id="login"
                  label="登入"
                  pathname={location.pathname}
                  to="/login"
                />
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
