// src/components/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false }); // Ordina le prenotazioni dalla più recente

      if (error) {
        console.error('Errore nel recupero delle prenotazioni:', error);
        setError('Impossibile caricare le prenotazioni.');
      } else {
        setBookings(data);
      }
      setLoading(false);
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <div>Caricamento prenotazioni...</div>;
  }

  if (error) {
    return <div>Errore: {error}</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '100%', overflowX: 'auto' }}>
      <h1>Dashboard Amministrativa</h1>
      <p>Totale prenotazioni: {bookings.length}</p>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Nome</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Pacchetto</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Ruolo</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Compagni</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Cantina</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{booking.name}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{booking.email}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{booking.room_type}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{booking.role}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{booking.occupants ? booking.occupants.join(', ') : 'N/A'}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{booking.cantina_package_type || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;