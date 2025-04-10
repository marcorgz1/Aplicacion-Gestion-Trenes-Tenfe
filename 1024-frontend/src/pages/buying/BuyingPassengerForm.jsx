import { useNavigate } from "react-router-dom";

import { Header } from "../../components/Header";
import { Wizard } from "../../components/Wizard";
import { PassengerForm } from "../../components/PassengerForm";
import { BuyingProcessButtons } from "../../components/BuyingProcessButtons";
import { Footer } from "../../components/Footer";

const routes = [
  "/choose-trip/",
  "/passenger",
  "/reserve-seat/",
  "/buy-trip",
  "/buy-confirmation"
]

export function BuyingPassengerForm () {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col items-center gap-20">
        <Wizard inStep={1}/>
        <PassengerForm />
        <BuyingProcessButtons prevAction={() => navigate(routes[0])} nextAction={() => navigate(routes[2])} />
      </div>
      <Footer />
    </main>
  )
}
