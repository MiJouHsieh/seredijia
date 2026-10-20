import { ProtectedRoute } from "src/components/auth/ProtectedRoute";

import { Routes, Route } from "react-router";
import { AuthProvider } from "src/context/AuthContext";

import { HomePage } from "src/pages/HomePage";
import { RecordPage } from "src/pages/RecordPage";
import { ReviewPage } from "src/pages/ReviewPage";
import { MonthlyReviewPage } from "src/pages/MonthlyReviewPage";
import { HistoryPage } from "src/pages/HistoryPage";
import { WeeklyReviewPage } from "src/pages/WeeklyReviewPage";

import { Nav } from "src/components/nav/Nav";
import { Login } from "src/pages/Auth/Login";
import { SignUp } from "src/pages/Auth/SignUp";

function App() {
  return (
    <section className="page-style mx-auto min-w-[375px]">
      <AuthProvider>
        <Nav />
        <Routes>
          {/* 公開路由 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/records/:date" element={<RecordPage />} />

          {/* 需要登入的路由 */}
          <Route element={<ProtectedRoute />}>
            <Route path="/history" element={<HistoryPage />} />
            <Route
              path="/weekly-review"
              element={<WeeklyReviewPage />}
            />
            <Route
              path="/monthly-review/:month"
              element={<MonthlyReviewPage />}
            />
            <Route path="/reviews" element={<ReviewPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </section>
  );
}

export default App;
