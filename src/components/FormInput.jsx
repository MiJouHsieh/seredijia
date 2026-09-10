import { useField } from "formik";

export function FormInput({ label, id, ...props }) {
  const [field, meta] = useField(props);
  const hasError = meta.touched && meta.error;

  return (
    <div className="flex flex-col gap-y-2">
      <label htmlFor={id} className="font-semibold text-orange">
        {label}
      </label>
      <input
        {...field}
        {...props}
        id={id}
        className={`auth-input auth-input-field ${hasError ? "border-red" : ""} `}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
      />
      {hasError ? (
        <span id={`${id}-error`} className="text-sm text-red">
          {meta.error}
        </span>
      ) : null}
    </div>
  );
}
