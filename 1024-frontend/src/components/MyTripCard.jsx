import { MapPin, Calendar, Users, CreditCard, TrainFront } from 'lucide-react';

export function MyTripCard({ ticketId, originCity, destinationCity, passengersNumber, departureDate, returnDate, price }) {
    return (
        <section className="w-full mx-auto mb-12 bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="flex flex-col items-center gap-4 bg-[#3a9956] text-white p-6 sm:flex-row sm:justify-between">
                <div className="flex items-center gap-3">
                    <TrainFront size={32} />
                    <h2 className="text-xl font-semibold">Detalles del Viaje</h2>
                </div>
                <div className="text-sm">
                    <span className="block opacity-75">Nº billete:</span>
                    <span className="font-mono">{ticketId || 'No disponible'}</span>
                </div>
            </div>

            <section className="p-6">
                <div className="space-x-6">
                    {/* Sección de Detalles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Primera Columna */}
                        <div className="space-y-6">
                            {/* Origen */}
                            <div className="p-4 bg-green-50 rounded-lg flex items-center justify-center md:justify-start">
                                <MapPin className="text-green-600 mr-4" aria-hidden="true" />
                                <div className="text-center md:text-left">
                                    <span className="block text-sm text-gray-600">Origen</span>
                                    <p className="font-semibold text-gray-900">{originCity || 'No especificado'}</p>
                                </div>
                            </div>

                            {/* Salida */}
                            <div className="p-4 bg-green-50 rounded-lg flex items-center justify-center md:justify-start">
                                <Calendar className="text-green-600 mr-4" aria-hidden="true" />
                                <div className="text-center md:text-left">
                                    <span className="block text-sm text-gray-600">Salida</span>
                                    <p className="font-semibold text-gray-900">{departureDate || 'No especificada'}</p>
                                </div>
                            </div>

                            {/* Pasajeros */}
                            <div className="p-4 bg-green-50 rounded-lg flex items-center justify-center md:justify-start">
                                <Users className="text-green-600 mr-4" aria-hidden="true" />
                                <div className="text-center md:text-left">
                                    <span className="block text-sm text-gray-600">Pasajeros</span>
                                    <p className="font-semibold text-gray-900">{passengersNumber || 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Segunda Columna */}
                        <div className="space-y-6">
                            {/* Destino */}
                            <div className="p-4 bg-green-50 rounded-lg flex items-center justify-center md:justify-start">
                                <MapPin className="text-green-600 mr-4" aria-hidden="true" />
                                <div className="text-center md:text-left">
                                    <span className="block text-sm text-gray-600">Destino</span>
                                    <p className="font-semibold text-gray-900">{destinationCity || 'No especificado'}</p>
                                </div>
                            </div>

                            {/* Regreso */}
                            <div className="p-4 bg-green-50 rounded-lg flex items-center justify-center md:justify-start">
                                <Calendar className="text-green-600 mr-4" aria-hidden="true" />
                                <div className="text-center md:text-left">
                                    <span className="block text-sm text-gray-600">Regreso</span>
                                    <p className="font-semibold text-gray-900">{returnDate || 'No especificada'}</p>
                                </div>
                            </div>

                            {/* Precio Total */}
                            <div className="p-4 bg-green-50 rounded-lg flex items-center justify-center md:justify-start">
                                <CreditCard className="text-green-600 mr-4" aria-hidden="true" />
                                <div className="text-center md:text-left">
                                    <span className="block text-sm text-gray-600">Precio Total</span>
                                    <p className="font-semibold text-gray-900">{price ? `${price} €` : '0 €'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    )
}
