import { Background } from "../components/Background";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Home } from '../components/Home'

export function HomePage() {
  return (
    <main>
      <Background />
      <Header />
      <Home />
      <Footer />
    </main>
  );
}
