import { useEffect, useRef, useState } from "react";
import { usePurchase } from "../context/PurchaseContext";
import { Document, Page, PDFDownloadLink, Text } from "@react-pdf/renderer";

const TicketDocument = ({purchaseData}) => {

    if (!purchaseData || !purchaseData.schedule) {
        return (
            <Document>
            <Page>
                <Text>Error al generar el ticket</Text>
            </Page>
            </Document>
        )
      }
    
    return (
        <Document>
        <Page>
            <View >
                <Text >Tickect de Viaje</Text>
                <Text >Estado: Confrimado</Text>
                <Text >Fecha: {new Date().toLocaleDateString()}</Text>
            </View>

            <View >
                <Text >Detalles del viaje</Text>
                <Text >Horario: {purchaseData.schedule?.departure} - {purchaseData.schedule?.arrival} </Text>
                <Text >Duración: {purchaseData.schedule?.duration} </Text>
                <Text >Pasajeros: {purchaseData.passengers?.length} </Text>
                <Text >Asientos: {purchaseData.selectedSeats?.join(", ")} </Text>
                <Text >Precio Total: {purchaseData.schedule?.price * purchaseData.passengers?.length} € </Text>
                <Text >Método de Pago: Tarjeta terminada en {purchaseData.paymentInfo?.cardNumber.slice(-4)} </Text>
            </View>
        </Page>
    </Document>
    )
}

export function DownloadTickets ({onDownloadComplete}) {
    const {purchaseData } = usePurchase ();
    const linkRef = useRef (null);
    const [isReady, setIsReady] = useState(false);


    useEffect(() => {
        if (purchaseData && purchaseData.schedule) {
          setIsReady(true);
        }
      }, [purchaseData]);


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold text-green-700 text-center mb-4">Generando Ticket...</h2>
                <p className="text-gray-600 text-center mb-4">Por favor, espera mientras se genera tu ticket de viaje en PDF.</p>
                <div className="flex justify-center">
            <div className="h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>

        {isReady && (
          <PDFDownloadLink
            document={<TicketDocument purchaseData={purchaseData} />}
            fileName="ticket-viaje.pdf"
            className="hidden"
            ref={linkRef}
          >
            {({ loading }) => {
              if (!loading) {
                setTimeout(() => {
                  if (linkRef.current) {
                    linkRef.current.click();
                    onDownloadComplete();
                  }
                }, 1000);
              }
              return null;
            }}
          </PDFDownloadLink>
        )}

      </div>
    </div>
  );
}
