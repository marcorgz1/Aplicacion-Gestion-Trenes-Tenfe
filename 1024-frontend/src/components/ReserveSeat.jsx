import { useState } from "react";
import { SlArrowLeftCircle, SlArrowRightCircle } from "react-icons/sl";
import { usePurchase } from '../context/PurchaseContext';

const seatsPerPage = 40;
const totalSeats = 80;

const ReserveSeat = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { purchaseData, updatePurchaseData } = usePurchase();

  const startIndex = (currentPage - 1) * seatsPerPage;
  const endIndex = startIndex + seatsPerPage;
  const seatsToDisplay = Array.from({ length: totalSeats })
    .map((_, index) => index + 1)
    .slice(startIndex, endIndex);

  const seatSelection = (seatNumber) => {
    if (!purchaseData.passengers?.length) {
      alert("Primero debes agregar pasajeros");
      return;
    }

    setSelectedSeats((prev) => {
      const isSelected = prev.includes(seatNumber);
      if (isSelected) {
        const newSeats = prev.filter((seat) => seat !== seatNumber);
        updatePurchaseData({
          ...purchaseData,
          selectedSeats: newSeats
        });
        return newSeats;
      } else {
        if (prev.length >= purchaseData.passengers.length) {
          alert("Ya has seleccionado el máximo de asientos permitidos");
          return prev;
        }
        const newSeats = [...prev, seatNumber];
        updatePurchaseData({
          ...purchaseData,
          selectedSeats: newSeats
        });
        return newSeats;
      }
    });
  };

  const goToNextPage = () => {
    if (endIndex < totalSeats) setCurrentPage((prev) => prev + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const arrowBaseStyle = "text-5xl cursor-pointer";
  const arrowNotAllowStyle = "opacity-20 cursor-not-allowed";

  return (
    <div className="flex flex-col items-center gap-5 bg-gray-100 min-h-screen w-full py-10">
      <h1 className="text-2xl font-bold">Reserva tu asiento</h1>
      <div className="flex justify-between items-center w-full max-w-[600px] gap-2">
        <SlArrowLeftCircle className={`${arrowBaseStyle} ${currentPage === 1 ? arrowNotAllowStyle : ""}`} onClick={goToPreviousPage} />
        <div className="relative w-full">
          <div className="grid grid-cols-10 gap-2 p-4 border rounded-2xl border-green-600 bg-white">
            {seatsToDisplay.map((seatNumber, index) => {
              const isSelected = selectedSeats.includes(seatNumber);
              const rowIndex = Math.floor(index / 10);

              return (
                <div key={seatNumber} className="contents">
                  {rowIndex === 2 && index % 10 === 0 && (
                      <div className="col-span-10 h-6"></div>
                  )}
                  <button onClick={() => seatSelection(seatNumber)}
                          className={`text-white font-semibold w-10 h-10 flex items-center justify-center rounded-lg transition ${isSelected ? "bg-yellow-500" : "bg-green-500 hover:bg-green-600"}`}
                  >
                    {seatNumber}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <SlArrowRightCircle className={`${arrowBaseStyle} ${endIndex >= totalSeats ? arrowNotAllowStyle : ""}`} onClick={goToNextPage} />
      </div>

      <div className="border rounded-2xl border-green-600 px-10 py-4 text-lg font-semibold bg-white">
        {selectedSeats.length > 0 ? 
            <p>
              Asientos seleccionados:{" "}
              {selectedSeats.map((seat, index) => (
                  <span key={seat}>
                      {seat}{index !== selectedSeats.length - 1 ? ", " : ""}
                  </span>
              ))}
            </p>
          : <p> Asiento aleatorio </p>
        }
      </div>
    </div>
  );
};

export default ReserveSeat;
