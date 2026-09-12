import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FormInput } from "src/components/FormInput";
import { PasswordInput } from "src/components/PasswordInput";
import { useAuth } from "src/context/AuthContext";

export function Login() {
  const [isSubmittingDone, setIsSubmittingDone] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  useEffect(() => {
    if (isSubmittingDone) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isSubmittingDone, navigate]);

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={Yup.object({
        email: Yup.string()
          .email("請輸入有效的 Email")
          .required("請輸入 Email"),
        password: Yup.string()
          .min(8, "密碼至少需要 8 個字元")
          .required("請輸入密碼"),
      })}
      onSubmit={async (
        values,
        { setSubmitting, resetForm, setStatus },
      ) => {
        const { email, password } = values;

        const { error } = await signIn({ email, password });

        if (error) {
          setStatus("Email 或密碼不正確，請再確認一次");
          setSubmitting(false);
          return;
        }

        resetForm();
        setSubmitting(false);
        setIsSubmittingDone(true);
      }}
    >
      {({ isSubmitting, status }) => (
        <main className="relative flex flex-col items-center justify-center w-full px-6 py-12 overflow-hidden page-style min-h-dvh">
          <div className="flex flex-col items-center w-full max-w-md gap-y-8">
            <header className="text-center">
              <h1 className="text-3xl font-semibold text-dark dark:text-cream">
                登入
              </h1>

              <p className="mt-3 text-sm text-dark/60 dark:text-cream/60">
                記錄今天的狀態
              </p>
            </header>

            <Form className="flex flex-col w-full gap-y-5">
              <FormInput
                id="inputEmail"
                label="Email"
                name="email"
                type="email"
                placeholder="請輸入 Email"
                required
              />

              <PasswordInput
                id="inputPassword"
                label="密碼"
                name="password"
                placeholder="請輸入密碼"
                required
              />

              {status && (
                <div className="px-4 py-3 text-sm text-center text-red-600 border border-red-300 rounded-lg bg-red-50">
                  {status}
                </div>
              )}

              <button
                type="submit"
                className="mt-2 cta-btn-style disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting || isSubmittingDone}
              >
                {isSubmitting || isSubmittingDone
                  ? "登入中..."
                  : "登入"}
              </button>

              <p className="text-sm text-center text-dark/60 dark:text-cream/60">
                還沒有帳號？
                <Link
                  to="/signup"
                  className="ml-1 font-medium underline text-dark dark:text-cream"
                >
                  建立帳號
                </Link>
              </p>
            </Form>
          </div>
        </main>
      )}
    </Formik>
  );
}
