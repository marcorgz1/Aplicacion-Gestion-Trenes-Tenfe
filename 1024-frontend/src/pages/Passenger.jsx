import { Header } from "../components/Header";
import { PassengerForm } from "../components/PassengerForm";
import { Footer } from "../components/Footer"
import { TicketPurchaseForm } from "../components/TicketPurchaseForm";

function Passenger () {
    return (
        <main>
            <Header />
            <PassengerForm className="bg-gray-100"/>
            <TicketPurchaseForm />
            <Footer />
        </main>
    )
}

export default Passenger