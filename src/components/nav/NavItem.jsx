import { Link } from "react-router"

export function NavItem({ id, label, onClick, pathname, to = `/${id}` }) {
  const isActive = id === "" ? pathname === "/" : pathname.startsWith(`/${id}`)

  return (
    <li className="list-none">
      <Link
        key={id}
        to={to}
        className="cursor-pointer"
        onClick={onClick}
      >
        <span
          className={`text-milkTeaDark dark:text-peach dark:text-peach hover:border-peach inline-block items-center border-b-4 border-transparent text-2xl dark:hover:border-cream md:text-base ${
            isActive
              ? "border-peach scale-[1.1]"
              : ""
          }`}
        >
          {label}
        </span>
      </Link>
    </li>
  );
}