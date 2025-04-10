import { Link, useLocation } from 'react-router-dom';
import { MyTripCard } from './MyTripCard';
import { TrainFrontIcon, ArrowRightIcon } from 'lucide-react'

export function MyTrips() {
    const tripsData = [
        {
            ticketId: "Nº918317",
            originCity: "Madrid",
            destinationCity: "Barcelona",
            passengersNumber: 2,
            departureDate: "10-09-2025",
            returnDate: "21-09-2025",
            price: "102,55"
        },
        {
            ticketId: "Nº839212",
            originCity: "Madrid",
            destinationCity: "Berlín",
            passengersNumber: 4,
            departureDate: "12-09-2025",
            returnDate: "28-09-2025",
            price: "124,75"
        }
    ];

    const location = useLocation()
    // Comprobar si estamos en la ruta "/my-trips" para mostrar el enlace o no en el componente
    const isOnMyTripsPage = location.pathname === '/my-trips'

    // Usuario está en página "Mis viajes" -> mostrar todos los viajes
    // Usuario está en página "Home" -> mostrar solamente el primero
    const tripsToShow = isOnMyTripsPage ? tripsData : [tripsData[0]]

    return (
        <main className="mx-auto flex flex-col mt-14 mb-12 p-10 w-8/12 bg-white rounded-lg shadow-md">
            <section className='flex flex-col gap-8 items-center mb-16 sm:flex-row sm:justify-between'>
                <div className='flex items-center gap-4'>
                    <TrainFrontIcon className='text-[#3a9956] size-10' />
                    <h1 className="text-4xl font-bold text-gray-800">Mis Viajes</h1>
                </div>
                {/* NO mostrar el enlace si ya estamos en la página de "Mis viajes" */}
                {
                !isOnMyTripsPage && (
                    <div className='flex items-center gap-2'>
                        <Link to="/my-trips" className='text-green-600 hover:underline'>
                            Mis viajes
                        </Link>
                        <ArrowRightIcon className='text-green-600' />
                    </div>
                )
                }
            </section>
            <span className='text-gray-400 text-center mb-8'>Estos viajes son inventados</span>
            <div className="flex flex-col gap-6">
            {
                tripsToShow.map((trip, index) => (
                    <MyTripCard
                        key={index}
                        ticketId={trip.ticketId}
                        originCity={trip.originCity}
                        destinationCity={trip.destinationCity}
                        passengersNumber={trip.passengersNumber}
                        departureDate={trip.departureDate}
                        returnDate={trip.returnDate}
                        price={trip.price}
                    />
                ))
            }               
            </div>
        </main>
    );
}
