import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router";

import { HomePage } from "src/pages/HomePage";
import { ReportPage } from "src/pages/ReportPage";
import { HistoryPage } from "src/pages/HistoryPage";
import { Nav } from "src/components/Nav";

function App() {
  return (
    <section className="mx-auto w-full min-w-[375px]">
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </Router>
    </section>
  );
}

export default App;
