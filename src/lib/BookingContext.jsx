import { createContext, useContext, useMemo, useState } from 'react';
import BookingModal from '../components/BookingModal';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialServiceId, setInitialServiceId] = useState(null);

  const value = useMemo(
    () => ({
      openBooking: (serviceId = null) => {
        setInitialServiceId(serviceId);
        setIsOpen(true);
      },
      closeBooking: () => setIsOpen(false),
    }),
    [],
  );

  return (
    <BookingContext.Provider value={value}>
      {children}
      <BookingModal isOpen={isOpen} initialServiceId={initialServiceId} onClose={value.closeBooking} />
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking deve ser usado dentro de <BookingProvider>');
  return ctx;
}
