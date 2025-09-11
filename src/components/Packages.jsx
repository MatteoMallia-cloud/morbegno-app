// src/components/Packages.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import BookingForm from './BookingForm'; // Importa il nuovo componente

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const fetchPackages = async () => {
    const { data, error } = await supabase
      .from('availability')
      .select('*');
    if (error) {
      console.error('Errore nel recupero dei pacchetti:', error);
    }
    if (data) {
      setPackages(data);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleBookingComplete = () => {
    setSelectedPackage(null); // Nasconde il form
    fetchPackages(); // Aggiorna la lista dei pacchetti
  };

  return (
    <div>
      <h1>Seleziona il tuo pacchetto</h1>
      {selectedPackage ? (
        <BookingForm
          packageId={selectedPackage.id}
          packageType={selectedPackage.room_type}
          onBookingComplete={handleBookingComplete}
        />
      ) : (
        <div>
          {packages.map((pkg) => (
            <div key={pkg.id} style={{ border: '1px solid #ddd', padding: '10px', margin: '10px', borderRadius: '5px' }}>
              <h3>{pkg.room_type}</h3>
              {pkg.available_slots > 0 ? (
                <>
                  <p>Disponibilità: {pkg.available_slots}</p>
                  <button onClick={() => setSelectedPackage(pkg)}>
                    Prenota ora
                  </button>
                </>
              ) : (
                <p>Pacchetto esaurito</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Packages;