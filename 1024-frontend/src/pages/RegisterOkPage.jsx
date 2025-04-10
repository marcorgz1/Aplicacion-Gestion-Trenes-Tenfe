import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Header } from "../components/Header"
import { RegisterOk } from '../components/RegisterOk'
import { Footer } from "../components/Footer"

export function RegisterOkPage () {
    const navigate = useNavigate()
    useEffect(() => {
        setTimeout(() => {
            navigate('/login')
        }, 3000)
    }, [navigate])

    return (
        <>
            <Header />
            <RegisterOk />
            <Footer />
        </>
    )
}