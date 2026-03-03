import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { ProductsPage } from "./pages/ProductsPage";
import { RawMaterialsPage } from "./pages/RawMaterialsPage";
import { DashboardPage } from "./pages/DashboardPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path='/' element={<DashboardPage />} />
          <Route path='/products' element={<ProductsPage />} />
          <Route path='/raw-materials' element={<RawMaterialsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
