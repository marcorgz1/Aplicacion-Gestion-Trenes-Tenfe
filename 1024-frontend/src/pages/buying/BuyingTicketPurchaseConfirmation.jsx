// import { useNavigate } from "react-router-dom";

import { Header } from "../../components/Header";
import { Wizard } from "../../components/Wizard";
// import { BuyingProcessButtons } from "../../components/BuyingProcessButtons";
import { Footer } from "../../components/Footer";
import { PurchaseConfirm } from "../../components/PurchaseConfirm";
// const routes = [
//     "/choose-trip/",
//     "/passenger",
//     "/reserve-seat/",
//     "/buy-trip",
//     "/buy-confirmation"
// ]

export function BuyingTicketPurchaseConfirmation () {
  // const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="flex flex-col items-center gap=20">
        <Wizard inStep={4}/>
        <PurchaseConfirm />
        {/* <BuyingProcessButtons next={false} prevAction={() => navigate(routes[3])} /> */}
      </div>
      <Footer />
    </>
  )
}