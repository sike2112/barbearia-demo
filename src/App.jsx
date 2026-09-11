import { BookingProvider } from './lib/BookingContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import BarbershopStory from './components/BarbershopStory';
import TeamReview from './components/TeamReview';
import BookingShowcase from './components/BookingShowcase';
import LocationCta from './components/LocationCta';
import Footer from './components/Footer';

export default function App() {
  return (
    <BookingProvider>
      <Header />
      <main>
        <Hero />
        <Services />
        <BarbershopStory />
        <TeamReview />
        <BookingShowcase />
        <LocationCta />
      </main>
      <Footer />
    </BookingProvider>
  );
}
