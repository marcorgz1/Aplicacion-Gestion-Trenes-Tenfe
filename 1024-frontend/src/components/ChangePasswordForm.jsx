import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaCheck, FaTimes } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

export function ChangePasswordForm() {
  const [userData, setUserData] = useState({})

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });

  const strengthMessages = {
    length: "Al menos 8 caracteres",
    uppercase: "Al menos 1 letra mayúscula",
    lowercase: "Al menos 1 letra minúscula",
    number: "Al menos 1 número"
  }

  const navigate = useNavigate()

  useEffect(() => {
    // Si existe el token
    // Obtener token del localStorage
    const token = localStorage.getItem('token')

    if (token) {
      try {
        // Intentar decodificarlo para obtener la info del usuario
        const decodedInfoUser = jwtDecode(token)

        // console.log(decodedInfoUser)

        const { id, name, email, phone } = decodedInfoUser

        // Guardar info extraída en el estado "userData"
        setUserData({ id, name, email, phone })
        console.log(userData)

      } catch (err) {
        console.error('Error al decodificar el token:', err)
      }
    }

    if (!token) {
      console.error('Error: No hay ningún token almacenado')
    }

  }, [])

  const validatePassword = (password) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password)
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (name === "newPassword") {
      validatePassword(value);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const userToken = localStorage.getItem('token')
    const userId = userData.id

    try {
      const response = await fetch(`http://localhost:3000/users/update-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },

        body: JSON.stringify({
          userId,        
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      })

      console.log('Current password:', formData.currentPassword)
      console.log('New password:', formData.newPassword)
      console.log('Confirm password:', formData.confirmPassword)
      
      if (!response.ok) {
        console.error('Error al cambiar la contraseña.')
      } else {
        console.log('La contraseña ha sido actualizada correctamente.')
        navigate('/my-account/change-password/change-password-ok')
      }

      const data = await response.json()


      // Limpiar datos del formulario cuando ya se ha realizado la petición
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })

      return data

    } catch (err) {
      console.error('Error al cambiar la contraseña:', err.message)
      setErrors({ submit: "Failed to change password. Please try again.", err })
    }
  };

  const isFormValid = () => {
    const requiredChars = ['length', 'uppercase', 'lowercase', 'number']
    const passwordSyncRequiredChars = requiredChars.every(requiredChar => passwordStrength[requiredChar])

    return (
      formData.currentPassword &&
      formData.newPassword &&
      formData.confirmPassword &&
      passwordSyncRequiredChars &&
      formData.newPassword === formData.confirmPassword
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mt-6 mb-8">Cambiar contraseña</h1>
      <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-sm">
        {isSuccess ? (
          <div className="text-center">
            <div className="text-green-500 text-4xl mb-4">✓</div>
            <h2 className="text-heading font-heading mb-4">La contraseña ha sido mmodificada correctamente!</h2>
            <button
              onClick={() => setIsSuccess(false)}
              className="w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-body font-body mb-2" htmlFor="currentPassword">
                  Contraseña Actual
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Introduce tu contraseña actual"
                    autoComplete="current-password"
                  />
                  <button
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute top-8 right-3 -translate-y-1/2 text-accent"
                  >
                    {showPasswords.current ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-destructive mt-1 text-sm">{errors.currentPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-body font-body mb-2" htmlFor="newPassword">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Introduce tu contraseña nueva"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-8 -translate-y-1/2 text-accent"
                  >
                    {showPasswords.new ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-destructive mt-1 text-sm">{errors.newPassword}</p>
                )}

                <div className="mt-4 space-y-2">
                  {Object.entries(passwordStrength).map(([key, isValid]) => {
                    if (strengthMessages[key]) {
                      return (
                        <div key={key} className="flex items-center gap-2 text-sm">
                          {isValid ? (
                            <FaCheck className="text-green-500" />
                          ) : (
                            <FaTimes className="text-red-600 text-destructive" />
                          )}
                          <span className={isValid ? "text-green-500" : "text-destructive"}>
                            {strengthMessages[key]}
                          </span>
                        </div>
                      )
                    }
                  })}
                </div>
              </div>

              <div>
                <label className="block text-body font-body mb-2" htmlFor="confirmPassword">
                  Confirmar nueva contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full mt-2 mb-4 px-4 py-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Repite tu contraseña nueva"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute top-5 right-4 text-accent"
                  >
                    {showPasswords.confirm ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-destructive mt-1 text-sm">{errors.confirmPassword}</p>
                )}
              </div>


              <div className="flex justify-center items-center gap-12">
                <button
                  disabled={!isFormValid()}
                  className="text-white font-semibold bg-green-500 hover:bg-green-700 p-2 rounded cursor-pointer transition-colors disabled:cursor-not-allowed"
                  >
                  Cambiar contraseña
                </button>

                <Link
                  to="/my-account"
                  className="text-white font-semibold bg-red-600 hover:bg-red-800 px-4 py-2 rounded transition-colors"
                >
                  Cancelar
                </Link>
              </div>
              {errors.submit && (
                <p className="text-destructive text-center">{errors.submit}</p>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
