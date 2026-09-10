import { useState, useCallback } from "react";
import { GoEye } from "react-icons/go";
import { RxEyeClosed } from "react-icons/rx";
import { useField } from "formik";

export function PasswordInput({ label, id, ...props }) {
  const [field, meta] = useField(props);
  const [passwordShow, setPasswordShow] = useState(false);

  const handlePasswordChange = useCallback(
    (e) => {
      field.onChange(e);
    },
    [field],
  );

  const togglePasswordVisibility = () => {
    setPasswordShow((prev) => !prev);
  };

  const hasPassword = field.value?.trim().length > 0;

  return (
    <div className="relative flex flex-col gap-y-2">
      <label htmlFor={id} className="font-semibold text-orange">
        {label}
      </label>
      <input
        {...field}
        {...props}
        id={id}
        type={passwordShow ? "text" : "password"}
        className="relative tracking-wider auth-input auth-input-field outline"
        onChange={handlePasswordChange}
        onBlur={field.onBlur}
        aria-describedby={
          meta.touched && meta.error ? `${id}-error` : undefined
        }
      />

      {hasPassword && (
        <span
          className="relative cursor-pointer text-yellow300"
          onClick={togglePasswordVisibility}
          aria-label="Toggle password visibility"
        >
          {passwordShow ? (
            <GoEye className="absolute z-20 bottom-9 right-6" />
          ) : (
            <RxEyeClosed className="absolute z-20 bottom-9 right-6" />
          )}
        </span>
      )}
      {meta.touched && meta.error && (
        <div id={id + "-error"} className="text-sm text-red">
          {meta.error}
        </div>
      )}
    </div>
  );
}
