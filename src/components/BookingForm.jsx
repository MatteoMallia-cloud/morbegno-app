import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const BookingForm = ({ packageId, packageType, onBookingComplete }) => {
  const requiresOccupants = packageType.toLowerCase().includes("double-room") || packageType.toLowerCase().includes("triple-room") || packageType.toLowerCase().includes("quadruple-room");

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    district: '',
    club: '',
    role: '',
    occupants: '',
    cantina_package_type: '',
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const occupants = requiresOccupants 
      ? formData.occupants.split(',').map(name => name.trim()) 
      : null;

    const { data, error } = await supabase.rpc('book_package', {
      p_package_id: packageId,
      p_name: formData.name,
      p_email: formData.email,
      p_phone: formData.phone,
      p_district: formData.district,
      p_club: formData.club,
      p_role: formData.role,
      p_occupants: occupants,
      p_cantina_package_type: formData.cantina_package_type,
    });

    if (error) {
      setMessage('Errore nella prenotazione: ' + error.message);
    } else {
      setMessage(data[0].message);
      if (data[0].success) {
        onBookingComplete();
      }
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
      <h4>Dettagli Prenotazione</h4>
      <input name="name" onChange={handleChange} placeholder="Nome e Cognome" required />
      <input type="email" name="email" onChange={handleChange} placeholder="Email" required />
      <input type="tel" name="phone" onChange={handleChange} placeholder="Numero di telefono" />
      <input name="district" onChange={handleChange} placeholder="Distretto" required />
      <input name="club" onChange={handleChange} placeholder="Club" required />
      <input name="role" onChange={handleChange} placeholder="Ruolo" required />

      {requiresOccupants && (
        <input name="occupants" onChange={handleChange} placeholder="Nomi compagni di stanza (separati da virgola)" />
      )}

      <select name="cantina_package_type" onChange={handleChange} required>
        <option value="">Seleziona un pacchetto per Morbegno in Cantina</option>
        <option value="oro">Oro</option>
        <option value="rosso">Rosso</option>
        <option value="bianco">Bianco</option>
        <option value="analcolico">Analcolico</option>
      </select>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'In corso...' : 'Conferma Prenotazione'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default BookingForm;