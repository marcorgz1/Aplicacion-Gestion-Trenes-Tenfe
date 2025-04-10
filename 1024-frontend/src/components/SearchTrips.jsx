import { useEffect, useState } from 'react'
import { Calendar, MapPin, Users } from 'lucide-react'
import { TrainIcon } from '../components/Icons'
import passengerValidations from "/src/utils/passengerValidations";
import { useNavigate } from "react-router-dom";
import { usePurchase } from '../context/PurchaseContext';
import { getAvailableOrigins, getAvailableDestinations, getTrains } from '../services/api'


export function SearchTrips() {
  const navigate = useNavigate()
  
  const purchaseContext = usePurchase()
  
  const [availableOrigins, setAvailableOrigins] = useState([])
  const [availableDestinations, setAvailableDestinations] = useState([])  
  const [tripInfo, setTripInfo] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    arrivalDate: "",
    passengersNumber: 1    
  })
  const [loading, setLoading] = useState(false)
  const [passengerValidationErrorMessage, setPassengerValidationErrorMessage] = useState(null);
  
  const [error, setError] = useState('')

  const getOrigins = async () => {
    const response = await getAvailableOrigins()
    setAvailableOrigins(response)
  }

  const getDestinations = async () => {
    const response = await getAvailableDestinations()
    console.log('Available destinations:', response)
    setAvailableDestinations(response)
  }

  useEffect(() => {
    getOrigins() 
    getDestinations()
  }, [])


  const showFormError = (field, message) => {
    if (field === "passengerNumber") {
      setPassengerValidationErrorMessage(message);
      setTimeout(() => {
        setPassengerValidationErrorMessage(null);
      }, 3000);
    }
  };

  const handleFormChange = (e) => {
    const formItem = e.target

    // Decrease and Increase Passengers
    if (formItem.name === "decreasePassengers") {
      const passengerNumberValidation =
        passengerValidations.validatePassengersNumber(
          tripInfo.passengersNumber - 1
        );
      if (passengerNumberValidation.validationResult) {
        setTripInfo({
          ...tripInfo,
          passengersNumber: tripInfo.passengersNumber - 1,
        });
      } else {
        showFormError("passengerNumber", passengerNumberValidation.message);
      }
      return;
    } else if (formItem.name === "increasePassengers") {
      const passengerNumberValidation =
        passengerValidations.validatePassengersNumber(
          tripInfo.passengersNumber + 1
        );
      if (passengerNumberValidation.validationResult) {
        setTripInfo({
          ...tripInfo,
          passengersNumber: tripInfo.passengersNumber + 1,
        });
      } else {
        showFormError("passengerNumber", passengerNumberValidation.message);
      }
      return;
    }
  
    // Other fields
    setTripInfo({
      ...tripInfo,
      [formItem.name]: formItem.value,
    });

  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ['origin', 'destination', 'departureDate', 'passengersNumber'];
    const missingFields = requiredFields.filter(field => !tripInfo[field]);
  
    if (missingFields.length > 0) {
      setError('Error: Por favor, rellena todos los campos.');
      return;
    }
    
    const { origin, destination, departureDate, arrivalDate, passengersNumber } = tripInfo
    
    purchaseContext.updatePurchaseData({
      origin,
      destination,
      departureDate, 
      arrivalDate,
      passengersNumber
    })

    setLoading(true)
    setError('')

    try {
      const { departureTrains, arrivalTrains } = await getTrains(tripInfo)
      // Valida si el usuario ha proporcionado una fecha de ida
      if (!departureTrains || departureTrains.length === 0) {
        setError('No se encontraron trenes de ida disponibles para los criterios seleccionados.')
        setLoading(false)
        return
      }
      
      // Valida si el usuario ha proporcionado una fecha de vuelta
      if (!arrivalTrains || arrivalTrains.length === 0) {
        setError('No se encontraron trenes de vuelta disponibles para los criterios seleccionados.')
        setLoading(false)
        return
      }

      purchaseContext.updatePurchaseData({
        departureTrains,
        arrivalTrains
      })

      navigate('/choose-trip')
    } catch (error) {
      console.error('Error searching for trains:', error)
      setError('Ha ocurrido un error al buscar trenes. Por favor, inténtalo de nuevo.')
      setLoading(false)
    }
  };

  return (
    <main className="flex justify-center items-center bg-gray-50 mt-12 mb-10 rounded-lg">
      <div className="w-full mx-auto shadow-lg p-8">
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-4">
            <TrainIcon />
            <h3 className="text-2xl font-semibold text-gray-900">
              Reserva tu viaje
            </h3>
          </div>
          <p className="text-sm text-gray-500">
            Encuentra el viaje perfecto para tu próxima aventura.
          </p>
        </div>
        <div>
          <form className="space-y-6">
            <div className="space-y-4">
              <section className="flex items-center gap-8">
                <div>
                  <label
                    htmlFor="origin"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4"
                  >
                    <MapPin className="w-4 h-4 text-green-500" />
                    Origen
                  </label>
                  <select
                    id="origin"
                    name="origin"
                    value={tripInfo.origin}
                    onChange={handleFormChange}
                    className="w-full px-2 py-1 border-gray-200 focus:outline-none focus:border-green-500 focus:rounded focus:ring-2 focus:ring-green-500"
                  >
                    <option value="" disabled>Selecciona ciudad de origen</option>
                    {
                    availableOrigins.map((city) => <option key={city} value={city}>{city}</option>)
                    }
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="destination"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4"
                  >
                    <MapPin className="w-4 h-4 text-green-500" />
                    Destino
                  </label>

                  <select
                    id="destination"
                    name="destination"
                    value={tripInfo.destination}
                    onChange={handleFormChange}
                    className="w-full px-2 py-1 border-gray-200 focus:outline-none focus:border-green-500 focus:rounded focus:ring-2 focus:ring-green-500"
                  >
                    <option value="" disabled>Selecciona ciudad de destino</option>
                    {
                    availableDestinations.map((city) => <option key={city} value={city}>{city}</option>)
                    }
                  </select>
                </div>
              </section>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="w-4 h-4 text-green-500" />
                    Ida
                  </label>
                  <input
                    type="date"
                    name="departureDate"
                    className="w-full border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent focus:rounded-md mb-4"
                    onChange={handleFormChange}
                    />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="w-4 h-4 text-green-500" />
                    Vuelta
                  </label>
                  <input
                    type="date"
                    name="arrivalDate"
                    className="w-full border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    onChange={handleFormChange}
                    value={tripInfo.arrivalDate}
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4">
                  <Users className="w-4 h-4 text-green-500" />
                  Pasajeros
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    name="decreasePassengers"
                    className="h-10 w-10 rounded-full text-white bg-green-500 hover:bg-green-700 transition-colors"
                    onClick={handleFormChange}
                  >
                    -
                  </button>
                  <span className="text-gray-700 min-w-[2rem] text-center">
                    {tripInfo.passengersNumber}
                  </span>
                  <button
                    type="button"
                    name="increasePassengers"
                    className="h-10 w-10 rounded-full text-white bg-green-500 hover:bg-green-700 transition-colors"
                    onClick={handleFormChange}
                  >
                    +
                  </button>
                </div>
                <div className='mt-4'>
                {
                passengerValidationErrorMessage && (
                  <strong className='text-sm text-red-600'>{passengerValidationErrorMessage}</strong>
                  )
                }
                </div>
              </div>
            </div>            
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              ) : (
                "Buscar"
              )}
            </button>
          </form>
        </div>
        {error && (
            <p className="text-sm text-center text-red-700 font-semibold mt-8">{error}</p>
        )}
      </div>
    </main>
  );
};
