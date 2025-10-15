import CommonLayout from "./main/pages/CommonLayout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RawViewPage from "./masterData/items/pages/RawViewPage";
import OrderViewPage from "./masterData/items/pages/OrderViewPage";
import RoutingLookupPage from "./masterData/routings/pages/RoutingViewPage";
import BusinessPartnerViewPage from "./masterData/companies/pages/BusinessPartnerViewPage";
import OrderInViewPage from "./orders/inbound/pages/OrderInViewPage";
import InboundHistoryPage from "./orders/inbound/pages/InboundHistoryPage";
import OrderOutViewPage from "./orders/outbound/pages/OrderOutViewPage";
import RawInViewPage from "./rawMaterials/inbound/pages/RawInViewPage";
import RawOutViewPage from "./rawMaterials/outbound/pages/RawOutViewPage";
import RawMaterialInventoryStatus from "./rawMaterials/inventory/pages/RawMaterialInventoryStatus";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CommonLayout />}>
            {/* 수주 대상 관리 - 3계층 */}
            <Route path="orders/inbound/items" element={<OrderInViewPage />} />
            <Route
              path="orders/inbound/history"
              element={<InboundHistoryPage />}
            />

            {/* 수주 대상 관리 - 2계층 */}
            <Route path="orders/outbound" element={<OrderOutViewPage />} />

            {/* 원자재 관리 */}
            <Route path="raw-materials/inbound" element={<RawInViewPage />} />
            <Route path="raw-materials/outbound" element={<RawOutViewPage />} />
            <Route
              path="raw-materials/inventory"
              element={<RawMaterialInventoryStatus />}
            />

            {/* 기준 정보 관리 */}
            <Route path="items/order/view" element={<OrderViewPage />} />
            <Route path="items/raw/view" element={<RawViewPage />} />
            <Route path="routings" element={<RoutingLookupPage />} />
            <Route path="companies" element={<BusinessPartnerViewPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
