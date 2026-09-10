import { Link } from "react-router";
import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FormInput } from "src/components/FormInput";
import { PasswordInput } from "src/components/PasswordInput";
import { useAuth } from "src/context/AuthContext";

export function SignUp() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { signUp } = useAuth();

  return (
    <>
      {isSubmitted ? (
        <main className="relative flex flex-col items-center justify-center w-full px-6 overflow-hidden page-style min-h-dvh">
          <div className="flex flex-col items-center max-w-md text-center gap-y-6">
            <div className="text-4xl">♡</div>

            <h1 className="text-3xl font-semibold">註冊完成</h1>

            <p className="leading-7 opacity-80">
              歡迎來到 seredijia ♡
              <br />
              從今天開始，慢慢記下每天的心情與生活吧。
            </p>

            <Link
              to="/"
              className="inline-block mt-4 text-center cta-btn-style"
            >
              開始今日紀錄
            </Link>
          </div>
        </main>
      ) : (
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={Yup.object({
            name: Yup.string()
              .required("請輸入名稱")
              .min(2, "名稱至少需要 2 個字元")
              .max(20, "名稱不能超過 20 個字元"),

            email: Yup.string()
              .email("Email 格式不正確")
              .required("請輸入 Email"),

            password: Yup.string()
              .min(8, "密碼至少需要 8 個字元")
              .required("請輸入密碼"),

            confirmPassword: Yup.string()
              .oneOf(
                [Yup.ref("password")],
                "兩次輸入的密碼不一致",
              )
              .required("請再次輸入密碼"),
          })}
          onSubmit={async (
            values,
            { setSubmitting, resetForm, setStatus },
          ) => {
            const { name, email, password } = values;

            const { error } = await signUp({
              name,
              email,
              password,
            });

            if (error) {
              setStatus("註冊失敗，請確認 Email 是否已經被使用");
              setSubmitting(false);
              return;
            }

            setIsSubmitted(true);
            resetForm();
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, status }) => (
            <main className="relative flex items-center justify-center w-full px-6 py-16 overflow-hidden page-style min-h-dvh">
              <div className="flex flex-col w-full max-w-md">
                <header className="mb-10 text-center">
                  <div className="mb-4 text-3xl">♡</div>

                  <h1 className="mb-3 text-4xl font-semibold">
                    建立帳號
                  </h1>

                  <p className="text-sm opacity-70">
                    開始記錄屬於你的每一天
                  </p>
                </header>

                <Form className="flex flex-col gap-y-5">
                  <FormInput
                    id="inputName"
                    label="名稱"
                    name="name"
                    type="text"
                    placeholder="輸入你的名稱"
                    required
                  />

                  <FormInput
                    id="inputEmail"
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="example@email.com"
                    required
                  />

                  <PasswordInput
                    id="inputPassword"
                    label="密碼"
                    name="password"
                    type="password"
                    placeholder="至少 8 個字元"
                    required
                  />

                  <PasswordInput
                    id="inputConfirmPassword"
                    label="確認密碼"
                    name="confirmPassword"
                    type="password"
                    placeholder="再次輸入密碼"
                    required
                  />

                  {status && (
                    <p
                      className="text-sm text-red-400"
                      aria-live="polite"
                    >
                      {status}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="mt-3 cta-btn-style"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "建立帳號中..." : "建立帳號"}
                  </button>

                  <p className="mt-2 text-sm text-center opacity-70">
                    已經有帳號了嗎？{" "}
                    <Link
                      className="font-medium underline underline-offset-4"
                      to="/login"
                    >
                      登入
                    </Link>
                  </p>
                </Form>
              </div>
            </main>
          )}
        </Formik>
      )}
    </>
  );
}
