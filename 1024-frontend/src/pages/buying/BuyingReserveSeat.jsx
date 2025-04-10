import { useNavigate } from "react-router-dom";

import { Header } from "../../components/Header";
import { Wizard } from "../../components/Wizard";
import ReserveSeat from "../../components/ReserveSeat";
import { BuyingProcessButtons } from "../../components/BuyingProcessButtons";
import { Footer } from "../../components/Footer";

const routes = [
  "/choose-trip/",
  "/passenger",
  "/reserve-seat/",
  "/buy-trip",
  "/buy-confirmation"
]

export function BuyingReserveSeat () {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="flex flex-col items-center gap=20">
        <Wizard inStep={2} />
        <ReserveSeat />
        <BuyingProcessButtons prevAction={() => navigate(routes[1])} nextAction={() => navigate(routes[3])} />
      </div>
      <Footer />
    </>
  )
}