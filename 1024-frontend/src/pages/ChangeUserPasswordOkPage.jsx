import { useEffect } from "react";
import { ChangeUserPasswordOk } from "../components/ChangeUserPasswordOk";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { useNavigate } from "react-router-dom";

export function ChangeUserPasswordOkPage () {
    const navigate = useNavigate()

    useEffect(() => {
        setTimeout(() => {
            navigate('/my-account')
        }, 3000)
    }, [navigate])
    return (
        <>    
            <Header />
            <ChangeUserPasswordOk />
            <Footer />
        </>

    )
}
