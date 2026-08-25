export function DailyEventSection({
  value,
  onChange,
}) {
  return (
    <section className="section-style">
      <div className="text-center">
        <h2 className="text-xl font-semibold">
          今天有什麼讓你在意的事嗎？
        </h2>
        <p className="mt-1 text-sm text-stone-400">選填</p>
      </div>

      <textarea
        value={value}
        onChange={onChange}
        placeholder="任何在意的事都可以記下來"
        rows={4}
        className="textarea-style"
      />
    </section>
  );
}