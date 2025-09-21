// src/components/Packages.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import BookingForm from './BookingForm';
import '../App.css';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    const { data, error } = await supabase
      .from('availability')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching packages:', error);
    } else {
      setPackages(data);
    }
    setLoading(false);
  };

  const handleBookingComplete = () => {
    setSelectedPackage(null);
    fetchPackages();
  };

  if (loading) {
    return <div>Caricamento pacchetti...</div>;
  }

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
        <div className="packages-container">
          {packages.map((pkg) => {
            let price = "";
            if (pkg.room_type.toLowerCase().includes("room")) {
                price = "145€";
            } else if (pkg.room_type.toLowerCase().includes("pranzo")) {
                price = "35€";
            } else if (pkg.room_type.toLowerCase().includes("assemblea")) {
                price = "Gratuito";
            }

            return (
              <div key={pkg.id} className="package-card">
                <h3>{pkg.room_type}</h3>
                {pkg.available_slots > 0 ? (
                  <>
                    <p>Costo: {price}</p>
                    <p>Disponibilità: {pkg.available_slots}</p>
                    {/* Bottone più visibile */}
                    <button 
                      onClick={() => setSelectedPackage(pkg)} 
                      style={{ 
                        marginTop: '15px', 
                        padding: '10px 20px', 
                        fontSize: '1em', 
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: '#6a1b9a', // Colore viola
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      Prenota
                    </button>
                  </>
                ) : (
                  <p>Pacchetto esaurito</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Packages;