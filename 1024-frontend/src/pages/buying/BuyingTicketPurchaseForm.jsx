import { useNavigate } from "react-router-dom";

import { Header } from "../../components/Header";
import { Wizard } from "../../components/Wizard";
import { TicketPurchaseForm } from "../../components/TicketPurchaseForm";
import { BuyingProcessButtons } from "../../components/BuyingProcessButtons";
import { Footer } from "../../components/Footer";

const routes = [
    "/choose-trip/",
    "/passenger",
    "/reserve-seat/",
    "/buy-trip",
    "/buy-confirmation"
]

export function BuyingTicketPurchaseForm () {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="flex flex-col items-center gap=20">
        <Wizard inStep={3}/>
        <TicketPurchaseForm />
        <BuyingProcessButtons prevAction={() => navigate(routes[2])} next ={false} />
      </div>
      <Footer />
    </>
  )
}