import { useField } from "formik";

export function FormInput({ label, id, ...props }) {
  const [field, meta] = useField(props);
  const hasError = meta.touched && meta.error;

  return (
    <div className="flex flex-col gap-y-2 text-dark dark:text-cream">
      <label htmlFor={id} className="font-semibold">
        {label}
      </label>
      <input
        {...field}
        {...props}
        id={id}
        className={`auth-input text-milkTea auth-input-field ${hasError ? "border-red" : ""} `}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
      />
      {hasError ? (
        <span
          id={`${id}-error`}
          className="text-sm font-extralight text-dark/90 dark:text-cream/60"
        >
          {meta.error}
        </span>
      ) : null}
    </div>
  );
}
