export function CheckInChecklist({ items }) {
  return (
    <div className="sticky top-[60px] z-10 mx-auto grid h-fit items-center justify-center self-start rounded-full p-4 drop-shadow-xl backdrop-blur-md lg:top-[80px]">
      <aside className="flex items-center gap-3 dark:text-cream/80 text-dark/80 lg:block lg:flex-col lg:space-y-6">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="lg:flex lg:items-center lg:gap-2"
          >
            <span
              className={`inline-block size-9 h-9 rounded-full text-center leading-9 ${item.isComplete ? "text-cream bg-rose-400/80" : "bg-cream/50 text-dark/80 ring-coral  ring-2"} `}
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
