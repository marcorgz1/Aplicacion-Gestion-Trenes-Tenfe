import TenfeLogo from '../assets/LogoTenfe.svg'
import { usePurchase } from '../context/PurchaseContext'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTrains } from '../services/api'
import { format } from '@formkit/tempo'
import { TrainIcon } from '../components/Icons'

export function ChooseTrip() {
  // Obtener info del viaje del contexto
  const { purchaseData, updatePurchaseData } = usePurchase()

  const [availableDepartureTrains, setAvailableDepartureTrains] = useState([])
  const [availableArrivalTrains, setAvailableArrivalTrains] = useState([])

  const navigate = useNavigate()

  const getWeekdayFromDate = (dateStr) => {
    const date = new Date(dateStr)

    const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

    return daysOfWeek[date.getDay()]
  }

  // Función para obtener únicamente la hora de la fecha en formato ISO de la BBDD
  const getTimeFromDate = (dateTimeToStr) => {
    if (!dateTimeToStr) return ''

    const newDate = new Date(dateTimeToStr)

    return newDate.getHours().toString().padStart(2, '0') + ':' +
      newDate.getMinutes().toString().padStart(2, '0');
  }

  // Función para obtener un número de tren con sólo números y con una longitud de 5 caracteres en base al train id de la base de datos
  const getTrainNumber = (id) => {
    const numericPart = id.replace(/\D/g, '');
    return numericPart.slice(-5) || id.slice(-5);
  }

  // Función para formatear la duración del tren en horas y minutos
  const trainDurationFormatted = (durationInMinutes) => {
    const hours = Math.floor(durationInMinutes / 60)
    const minutes = durationInMinutes % 60

    return `${hours}h ${minutes.toString().padStart(2, '0')}m`
  }

  useEffect(() => {
    const fetchAvailableTrains = async () => {

      const { departureTrains, arrivalTrains } = await getTrains(purchaseData)

      const departureTrainsWithCorrectFormattedDates = departureTrains.map((departureTrain) => ({
        ...departureTrain,
        departureDayOfWeek: getWeekdayFromDate(departureTrain.departureDateTime || purchaseData.departureDate),
        departureDate: format(departureTrain.departureDate, 'medium'),
        arrivalDate: format(departureTrain.departureDate, 'medium'),
        departureTime: getTimeFromDate(departureTrain.departureDate),
        arrivalTime: getTimeFromDate(departureTrain.arrivalDate),
        trainDurationFormatted: trainDurationFormatted(departureTrain.duration),
        trainNumber: getTrainNumber(departureTrain._id),
        price: parseFloat(departureTrain.price).toFixed(2)
      }
      ))

      const arrivalTrainsWithCorrectFormattedDates = arrivalTrains.map((arrivalTrain) => ({
        ...arrivalTrain,
        departureDayOfWeek: getWeekdayFromDate(arrivalTrain.departureDateTime || purchaseData.departureDate),
        departureDateWithoutTime: format(arrivalTrain.departureDate, 'medium'),
        arrivalDateWithoutTime: format(arrivalTrain.departureDate, 'medium'),
        departureTimeWithoutDate: getTimeFromDate(arrivalTrain.departureDate),
        arrivalTimeWithoutDate: getTimeFromDate(arrivalTrain.arrivalDate),
        trainDurationFormatted: trainDurationFormatted(arrivalTrain.duration),
        trainNumber: getTrainNumber(arrivalTrain._id),
        price: parseFloat(arrivalTrain.price).toFixed(2)
      }
      ))

      console.log('Available arrival trains:', arrivalTrains)
      console.log('Available arrival trains with formatted dates:', arrivalTrainsWithCorrectFormattedDates)

      setAvailableDepartureTrains(departureTrainsWithCorrectFormattedDates)
      setAvailableArrivalTrains(arrivalTrainsWithCorrectFormattedDates)
    }

    fetchAvailableTrains()

  }, [purchaseData])

  const onSelectedTrain = (id) => {
    updatePurchaseData({ trainId: id })

    navigate('/passenger')
  }

  return (
    <>
      <div className='flex flex-col gap-10 bg-gray-100 max-w-full m-5 p-12 rounded-lg'>
        <div className='flex items-center gap-4'>
          <TrainIcon />
          <span className='text-xl text-green-500 font-semibold'>{purchaseData.origin}</span>
          <span className='text-xl text-black font-semibold'>a</span>
          <span className='text-xl text-green-500 font-semibold'>{purchaseData.destination}</span>
        </div>
        <section className='flex justify-center items-center gap-12 bg-gray-50 w-full py-8 rounded-md'>
          {
            availableDepartureTrains.map((availableTrain) => (
              <div key={availableTrain._id} className='flex flex-col gap-4 text-center bg-gray-100 shadow-lg hover:shadow-xl p-4 rounded-lg'>
                <span>{availableTrain.departureDate}</span>
                <span>{availableTrain.departureDayOfWeek}</span>
                <span className='text-2xl text-yellow-400 font-semibold'>{availableTrain.price} €</span>
              </div>
            ))
          }
        </section>

        <section className='flex flex-col gap-12 bg-gray-50 w-full py-4 mb-8'>
          {
            availableDepartureTrains.map((availableDepartureTrain) => (
              <div key={availableDepartureTrain._id} className='flex gap-32 text-center bg-gray-100 shadow-lg hover:shadow-xl p-4 rounded-lg'>
                <div className='flex flex-col items-center gap-2 border-r-2 border-gray-200 p-4'>
                  <img src={TenfeLogo} alt="Logo Tenfe" className='size-24' />
                  <span>Tenfe</span>
                </div>
                <div className='flex items-center gap-24 border-r-2 border-slate-600'>
                  <div className='flex flex-col items-center gap-4'>
                    <span>{availableDepartureTrain.departureTime}</span>
                    <span>{availableDepartureTrain.origin}</span>
                  </div>
                  <div className='flex flex-col items-center gap-4'>
                    <span>Nº {availableDepartureTrain.trainNumber}</span>
                    <TrainIcon />
                    <span>{availableDepartureTrain.trainDurationFormatted}</span>
                  </div>
                  <div className='flex flex-col items-center gap-4'>
                    <span>{availableDepartureTrain.arrivalTime}</span>
                    <span>{availableDepartureTrain.destination}</span>
                  </div>
                </div>
                <div className='flex items-center gap-8'>
                  <span className='text-4xl text-yellow-400 font-semibold'>{availableDepartureTrain.price} €</span>
                  <div className='flex flex-col items-center gap-6'>
                    <span className='text-sm'>{availableDepartureTrain.selectedSeats} asientos disponibles</span>
                    <button className='text-white font-bold bg-green-500 hover:bg-green-700 rounded-lg px-4 py-2' onClick={() => onSelectedTrain(availableDepartureTrain._id)}>Seleccionar</button>
                  </div>
                </div>
              </div>
            ))
          }
        </section>

        <div className='flex items-center gap-4'>
          <TrainIcon />
          <span className='text-xl text-green-500 font-semibold'>{purchaseData.destination}</span>
          <span className='text-xl text-black font-semibold'>a</span>
          <span className='text-xl text-green-500 font-semibold'>{purchaseData.origin}</span>
        </div>
        <section className='flex justify-center items-center gap-12 bg-gray-50 w-full py-8 rounded-md'>
          {
            availableArrivalTrains.map((availableArrivalTrain) => (
              <div key={availableArrivalTrain._id} className='flex flex-col gap-4 text-center bg-gray-100 shadow-lg hover:shadow-xl p-4 rounded-lg'>
                <span>{availableArrivalTrain.departureDateWithoutTime}</span>
                <span>{availableArrivalTrain.departureDayOfWeek}</span>
                <span className='text-2xl text-yellow-400 font-semibold'>{availableArrivalTrain.price} €</span>
              </div>
            ))
          }
        </section>

        <section className='flex flex-col gap-12 bg-gray-50 w-full py-4'>
          {
            availableArrivalTrains.map((availableArrivalTrain) => (
              <div key={availableArrivalTrain._id} className='flex gap-32 text-center bg-gray-100 shadow-lg hover:shadow-xl p-4 rounded-lg'>
                <div className='flex flex-col items-center gap-2 border-r-2 border-gray-200 p-4'>
                  <img src={TenfeLogo} alt="Logo Tenfe" className='size-24' />
                  <span>Tenfe</span>
                </div>
                <div className='flex items-center gap-24 border-r-2 border-slate-600'>
                  <div className='flex flex-col items-center gap-4'>
                    <span>{availableArrivalTrain.departureTimeWithoutDate}</span>
                    <span>{availableArrivalTrain.origin}</span>
                  </div>
                  <div className='flex flex-col items-center gap-4'>
                    <span>Nº {availableArrivalTrain.trainNumber}</span>
                    <TrainIcon />
                    <span>{availableArrivalTrain.trainDurationFormatted}</span>
                  </div>
                  <div className='flex flex-col items-center gap-4'>
                    <span>{availableArrivalTrain.arrivalTimeWithoutDate}</span>
                    <span>{availableArrivalTrain.destination}</span>
                  </div>
                </div>
                <div className='flex items-center gap-8'>
                  <span className='text-4xl text-yellow-400 font-semibold'>{availableArrivalTrain.price} €</span>
                  <div className='flex flex-col items-center gap-6'>
                    <span className='text-sm'>{availableArrivalTrain.selectedSeats} asientos disponibles</span>
                    <button className='text-white font-bold bg-green-500 hover:bg-green-700 rounded-lg px-4 py-2' onClick={() => onSelectedTrain(availableArrivalTrain._id)}>Seleccionar</button>
                  </div>
                </div>
              </div>
            ))
          }
        </section>
      </div>
    </>
  )
}
