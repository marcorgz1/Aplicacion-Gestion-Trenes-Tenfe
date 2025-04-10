// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const API_BASE_URL = "http://localhost:3000"; 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export async function createUser(data) {
  try {
    const response = await window.fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const userData = await response.json();
    console.log('User data:', userData)

    return userData;
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    throw new Error("Hubo un error al crear el usuario.");
  }
}

export async function loginUser(data) {
  try {
    const response = await window.fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw new Error("Hubo un error al iniciar sesión.");
  }
}

export async function getUsers() {
  try {
    const response = await window.fetch(API_BASE_URL, {
      headers: {
        usersorization: `${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error(data.message);
    }
    console.log("response from service api", data);
    return data;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    throw new Error("Hubo un error al obtener los usuarios.");
  }
}

export async function getPrefixes(data) {
  try {
    const response = await window.fetch(`${API_BASE_URL}/prefix`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const countryPrefix = await response.json();
    return countryPrefix;
  } catch (error) {
    console.error("Error al obtener los prefijos:", error);
    throw new Error("Hubo un error al obtener los prefijos.");
  }
}

export async function getTrains(tripInfo) {
  try {
    const { origin, destination, departureDate, arrivalDate } = tripInfo
    const searchParams = {
      origin,
      destination,
      departureDate,
      arrivalDate
    }

    const queryParams = new URLSearchParams(searchParams).toString();
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/trains/?${queryParams}`
    );

    const data = await response.json()
    return data
  } catch (err) {
    throw new Error("Error al obtener los trenes", err.message);
  }
}

export const requestPasswordReset = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/request-reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en requestPasswordReset:", err);
    throw err;
  }
};

//     return response.json(); // Devuelve el resetLink
//   } catch (err) {
//     throw new Error("Error al solicitar reseteo", err.message);
//   }
// };

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    return response.json();
  } catch (err) {
    throw new Error("Error al cambiar la contraseña", err.message);
  }
};

export const getTicketsById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al obtener los tickets");
    }

  } catch (err) {
    throw new Error("Error al obtener los tickets", err.message);
  }
}


export const addPassengerData = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/passenger`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    const passengerData = await response.json();

    if (!response.ok) {
      throw new Error(passengerData.message || "Error al agregar los datos del pasajero");
    }

    return passengerData;
  } catch (err) {
    throw new Error("Error al agregar los datos del pasajero", err.message);
  }
}

export const addTicketData = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ticket`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    const ticketData = await response.json();

    console.log('Ticket data:', ticketData);

    if (!response.ok) {
      throw new Error(ticketData.message || "Error al agregar los datos del billete");
    }

    return ticketData;
  } catch (err) {
    throw new Error("Error al agregar los datos del billete", err.message);
  }
}

export const getTrips = async (tripData) => {
  try {
    // Si se proporciona tripData, estamos guardando un viaje
    if (tripData) {
      console.log("Procesando datos del viaje en el servidor:", tripData);
      
      // Verificar y preparar los datos antes de enviarlos
      const processedData = {
        ...tripData,  // Mantener todos los datos originales
        
        // Asegurar que estos campos sean arrays válidos
        passengers: Array.isArray(tripData.passengers) ? tripData.passengers : [],
        selectedSeats: Array.isArray(tripData.selectedSeats) ? tripData.selectedSeats : []
      };
      
      // Almacenar en localStorage como respaldo (datos completos)
      localStorage.setItem("lastTripData", JSON.stringify(processedData));
      
      // Si en el futuro se implementa un endpoint para guardar viajes, se puede usar:
      /*
      const response = await fetch(`${API_BASE_URL}/trips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(processedData),  // Enviar datos completos procesados
      });

      const savedTripData = await response.json();
      if (!response.ok) {
        throw new Error(savedTripData.message || "Error al guardar el viaje");
      }
      return savedTripData;
      */
      
      // Por ahora, simulamos una respuesta exitosa
      return {
        success: true,
        message: "Viaje guardado con éxito",
        data: processedData
      };
    } 
    // Si no hay tripData, obtenemos los viajes del usuario
    else {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No hay sesión activa. Por favor, inicie sesión");
      }
      
      const response = await fetch(`${API_BASE_URL}/trips`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener los viajes");
      }

      return data;
    }
  } catch (err) {
    console.error("Error en getTrips:", err);
    throw new Error(err.message || "Error al procesar los viajes");
  }
}
  
export const getAvailableOrigins = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/trains/origins`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener los origenes:", error);
    throw new Error("Hubo un error al obtener los origenes.");
  }
}

export const getAvailableDestinations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/trains/destinations`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener los destinos:", error);
    throw new Error("Hubo un error al obtener los destinos.");
  }
}

// export const validateCard = async (cardNumber, internetCode) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/card/validate`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ cardNumber, internetCode }),
//     });

//     // Verificar si la respuesta es JSON antes de intentar parsearla
//     const contentType = response.headers.get("content-type");
//     if (!contentType || !contentType.includes("application/json")) {
//       throw new Error("Respuesta del servidor no es JSON. Verifica la URL de la API.");
//     }

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || "Error en la validación de la tarjeta");
//     }

//     return { success: true, message: data.message };
//   } catch (error) {
//     console.error("Error en validateCard:", error);
//     return { success: false, message: error.message };
//   }
// };
