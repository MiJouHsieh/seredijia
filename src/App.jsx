import { Routes, Route } from "react-router";
import { AuthProvider } from "src/context/AuthContext";

import { HomePage } from "src/pages/HomePage";
import { ReportPage } from "src/pages/ReportPage";
import { HistoryPage } from "src/pages/HistoryPage";
import { Nav } from "src/components/Nav";
import { Login } from "src/pages/Auth/Login";
import { SignUp } from "src/pages/Auth/SignUp";

function App() {
  return (
    <section className="mx-auto w-full min-w-[375px]">
      <AuthProvider>
        <Nav />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </AuthProvider>
    </section>
  );
}

export default App;
