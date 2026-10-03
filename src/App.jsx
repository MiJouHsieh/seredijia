import { Routes, Route } from "react-router";
import { AuthProvider } from "src/context/AuthContext";

import { HomePage } from "src/pages/HomePage";
import { RecordPage } from "src/pages/RecordPage";
import { ReportPage } from "src/pages/ReportPage";
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
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/records/:date" element={<RecordPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route
            path="/weekly-review"
            element={<WeeklyReviewPage />}
          />
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </AuthProvider>
    </section>
  );
}

export default App;
