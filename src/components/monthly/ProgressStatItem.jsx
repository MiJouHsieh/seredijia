export function ProgressStatItem({ label, count, total }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <span className="dark:text-cream100 text-dark/80">
          {label}
        </span>

        <span>
          {count} / {total} 天
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-clayPeach/30">
        <div
          className="h-full rounded-full bg-milkTeaDark dark:bg-milkTea"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}
