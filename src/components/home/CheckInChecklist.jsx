export function CheckInChecklist({ items }) {
  return (
    <div className="sticky top-[60px] z-10 mx-auto grid h-fit items-center justify-center self-start p-0 drop-shadow-xl backdrop-blur-md lg:top-[90px] lg:mx-0 lg:rounded-none">
      <aside className="flex items-center gap-5 text-dark dark:text-cream/80 lg:flex-col lg:items-start">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="lg:flex lg:items-center lg:gap-3"
          >
            <span
              className={`inline-block size-9 rounded-full text-center leading-9 ${item.isComplete ? "bg-milkTeaBrown text-cream100" : "dark:text-cream200 dark:ring-cream200/50 ring-cream100 bg-cream text-dark ring-1 dark:bg-cream/5"} `}
            >
              {item.isComplete ? "✓" : index + 1}
            </span>
            <span className="hidden lg:block">{item.label}</span>
          </div>
        ))}
      </aside>
    </div>
  );
}
