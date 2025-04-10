import { useState } from "react";

import { Header } from "../components/Header";
import { Wizard } from "../components/Wizard";
import { ChooseTrip } from "../components/ChooseTrip";
import { PassengerForm } from "../components/PassengerForm";
import ReserveSeat from "../components/ReserveSeat";
import { TicketPurchaseForm } from "../components/TicketPurchaseForm";
import PurchaseConfirm from "../components/PurchaseConfirm";

// TODO Obsoleto. Eliminar

const actions = [
  {
    index: 0,
    component: <ChooseTrip />,
  },
  {
    index: 1,
    component: <PassengerForm />,
  },
  {
    index: 2,
    component: <ReserveSeat />,
  },
  {
    index: 3,
    component: <TicketPurchaseForm />,
  },
  {
    index: 4,
    component: <PurchaseConfirm />,
  },
];

export function BuyTrip() {
  const [step, setStep] = useState(0);

  return (
    <main>
      <Header />
      <Wizard onClickToStep={setStep} />
      {actions.map((action) => {
        return (
          <div
            key={action.index}
            style={{
              display: action.index === step ? "block" : "none",
              width: "100%",
            }}
          >
            {action.component}
          </div>
        );
      })}
    </main>
  );
}
