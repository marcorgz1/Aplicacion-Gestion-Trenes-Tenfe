import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "./pages/HomePage";
import Login from "./pages/Login";
import RememberPassword from "./pages/RememberPassword";
import ResetPassword from "./pages/ResetPassword";
import { Register } from "./pages/Register";
import { RegisterOkPage } from "./pages/RegisterOkPage";
import { UsersList } from "./pages/UsersList";
import { BuyingChooseTrip } from "./pages/buying/BuyingChooseTrip";
import { BuyingPassengerForm } from "./pages/buying/BuyingPassengerForm";
import { BuyingReserveSeat } from "./pages/buying/BuyingReserveSeat";
import { BuyingTicketPurchaseForm } from "./pages/buying/BuyingTicketPurchaseForm";
import { BuyingTicketPurchaseConfirmation } from "./pages/buying/BuyingTicketPurchaseConfirmation";
import { MyTripsPage } from './pages/MyTripsPage'
import { MyAccountPage } from "./pages/MyAccountPage";
import { ChangePassword } from "./pages/ChangePassword";
import { HelpFormPage } from "./pages/HelpFormPage";
import { BlogPage } from "./pages/BlogPage";
import { ChangeUserPasswordOkPage } from "./pages/ChangeUserPasswordOkPage";

import { AuthProvider } from "./context/AuthContext";
import { PurchaseProvider } from "./context/PurchaseContext";

function App() {
  return (
    <main className="relative">
      <PurchaseProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/my-account" element={<MyAccountPage />} />
              <Route
                path="/my-account/change-password"
                element={<ChangePassword />}
              />
              <Route path="/login" element={<Login />} />
              <Route
                path="/login/remember-password"
                element={<RememberPassword />}
              />
              <Route path="/login/reset-password" element={<ResetPassword />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register-ok" element={<RegisterOkPage />} />
              <Route
                path="/my-account/change-password/change-password-ok"
                element={<ChangeUserPasswordOkPage />}
              />
              <Route path="/users" element={<UsersList />} />
              <Route path="/choose-trip" element={<BuyingChooseTrip />} />
              <Route path="/my-trips" element={<MyTripsPage />} />
              <Route path="/reserve-seat" element={<BuyingReserveSeat />} />
              <Route path="/passenger" element={<BuyingPassengerForm />} />
              <Route path="/buy-trip" element={<BuyingTicketPurchaseForm />} />
              <Route
                path="/buy-confirmation"
                element={<BuyingTicketPurchaseConfirmation />}
              />
              <Route path="/help" element={<HelpFormPage />} 
              />
              <Route path="/blog" element={<BlogPage />} 
              />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </PurchaseProvider>
    </main>
  );
}

export default App;
