import { Link } from "react-router-dom";

import { Header } from "../../components/Header";
import { Wizard } from "../../components/Wizard";
import { ChooseTrip } from "../../components/ChooseTrip";
import { Footer } from "../../components/Footer";
import { Background } from "../../components/Background";

export function BuyingChooseTrip () {

  return (
    <>
      <Background />
      <Header />
      <div className="flex flex-col items-center w-full">
        <Wizard inStep={0}/>
        <ChooseTrip />
      </div>
      <div className="flex items-center mb-6">
        <Link to="/" className="text-white bg-red-600 hover:bg-red-800 transition-colors font-semibold py-2 px-4 m-4 rounded-lg">Cancelar</Link>
      </div>
      <Footer />
    </>
  )
}
