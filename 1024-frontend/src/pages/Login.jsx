import { Background } from "../components/Background"
import { Footer } from "../components/Footer"
import { Header } from "../components/Header"
import { LoginForm } from '../components/LoginForm'


function Login () {
    return (
        <main className="flex flex-col min-h-screen">
            <Background />
            <Header />
            <LoginForm />  
            <Footer />         
        </main>
    )
}

export default Login
