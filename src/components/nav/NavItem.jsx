import { Link } from "react-router"

export function NavItem({ to, label, onClick, pathname, matchPath }) {
  const isActive =
    matchPath === "/"
      ? pathname === "/"
      : pathname.startsWith(matchPath);

  return (
    <li className="list-none">
      <Link
        to={to}
        className="cursor-pointer"
        onClick={onClick}
      >
        <span
          className={`text-milkTeaDark dark:text-peach dark:text-peach hover:border-peach active:hover:border-peach inline-block items-center border-b-4 border-transparent text-2xl dark:hover:border-cream md:text-base ${
            isActive ? "border-b-peach" : ""
          }`}
        >
          {label}
        </span>
      </Link>
    </li>
  );
}