import { Header } from "../components/Header";
import ReserveSeat from '../components/ReserveSeat'
import { Footer } from "../components/Footer";

function ReserveSeatPage () {
    return (
        <main className="bg-gray-100">
            <Header />
            <ReserveSeat />
            <Footer />
        </main>
    )
}

export default ReserveSeatPage