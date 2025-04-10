import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { HelpForm } from "../components/HelpForm";


export function HelpFormPage() {
    return (
        <>
            <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-br from-green-300 to-slate-400">
                <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,#bae6fd60,transparent)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_0%_300px,#fecdd360,transparent)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_800px,#a5f3fc60,transparent)]"></div>
            </div>
            <Header />
            <HelpForm />
            <Footer />
        </>
    )
}
