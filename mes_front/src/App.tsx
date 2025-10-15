import { BrowserRouter, Routes, Route } from "react-router-dom";
import CommonLayout from "./main/pages/CommonLayout";
import RoutingViewPage from "./masterData/routings/pages/RoutingViewPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CommonLayout />}>
          <Route path="/routing" element={<RoutingViewPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
