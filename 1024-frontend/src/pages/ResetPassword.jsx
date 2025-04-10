import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom"; // Usamos useSearchParams
import { Header } from "../components/Header";
import { resetPassword } from "../services/api";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token"); // Extrae el token de la URL
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        try {
            await resetPassword(token, newPassword);
            alert("Contraseña actualizada correctamente");
            navigate("/login"); // Redirigir al login
        } catch (error) {
            console.error("Error al actualizar la contraseña:", error);
        }
    };

    useEffect(() => {
        console.log("Token recibido:", token); // Para depuración
    }, [token]);

    return (
        <main>
            <Header />
            <section className="grid place-content-center min-h-screen gap-6">
                <h1 className="text-4xl text-black">Restablecer Contraseña</h1>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <input
                        className="border-[1px] border-black p-2"
                        type="password"
                        placeholder="Nueva contraseña"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <input
                        className="border-[1px] border-black p-2"
                        type="password"
                        placeholder="Confirmar contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button className="text-white p-2 font-semibold bg-[#3a9956] rounded hover:bg-green-800 transition-all">
                        Cambiar Contraseña
                    </button>
                </form>
            </section>
        </main>
    );
};

export default ResetPassword;