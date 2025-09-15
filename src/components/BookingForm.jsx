import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const BookingForm = ({ packageId, packageType, onBookingComplete }) => {
  const requiresOccupants = packageType.toLowerCase().includes("double-room") || packageType.toLowerCase().includes("triple-room") || packageType.toLowerCase().includes("quadruple-room");
  
  const isAssemblyPackage = packageType.toLowerCase().includes("assemblea");
  const isDinnerPackage = packageType.toLowerCase().includes("cena");
  const requiresCantinaPackage = !isAssemblyPackage && !isDinnerPackage;

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
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

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

    const cantinaPackage = requiresCantinaPackage 
      ? formData.cantina_package_type 
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
      p_cantina_package_type: cantinaPackage,
    });

    if (error) {
      setMessage('Errore nella prenotazione: ' + error.message);
    } else {
      setMessage(data[0].message);
      if (data[0].success) {
        setBookingConfirmed(true);
      }
    }
    setIsLoading(false);
  };

// Calcolo del costo in base al pacchetto
  let cost = 0;
  let cantinaPackageCostMessage = "";
  if (packageType.toLowerCase().includes("room")) {
    cost = 145;
    cantinaPackageCostMessage = " (a cui va aggiunto il costo per il pacchetto Cantina scelto)";
  } else if (packageType.toLowerCase().includes("assemblea-pranzo")) {
    cost = 35;
  } else if (packageType.toLowerCase().includes("assemblea")) {
    cost = 0;
  }

  if (bookingConfirmed) {
    return (
      <div style={{ padding: '20px', border: '1px solid #4CAF50', borderRadius: '5px', backgroundColor: '#e8f5e9' }}>
        <h4>Prenotazione confermata!</h4>
        <p>Grazie, **{formData.name}**! La tua prenotazione è stata registrata con successo.</p>
        <hr style={{ borderColor: '#4CAF50' }}/>
        <h5>Riepilogo Dettagli:</h5>
        <ul>
          <li>**Pacchetto:** {packageType}</li>
          <li>**Email:** {formData.email}</li>
          <li>**Telefono:** {formData.phone}</li>
          <li>**Distretto:** {formData.district}</li>
          <li>**Club:** {formData.club}</li>
          <li>**Ruolo:** {formData.role}</li>
          {requiresOccupants && <li>**Compagni di stanza:** {formData.occupants}</li>}
          {requiresCantinaPackage && <li>**Pacchetto Cantina:** {formData.cantina_package_type || "Nessuno"}</li>}
        </ul>
        <div style={{ fontWeight: 'bold', marginTop: '20px' }}>
          Costo a persona: {cost}€{cantinaPackageCostMessage}
        </div>
        <p style={{ marginTop: '5px', fontSize: '0.9em' }}>
          *Nota: per i pacchetti con pernottamento, il costo del pacchetto in cantina va calcolato a parte.
        </p>
        <button onClick={onBookingComplete}>Torna ai pacchetti</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
      <h4>Dettagli Prenotazione</h4>
      <input name="name" onChange={handleChange} placeholder="Nome e Cognome" required />
      <input type="email" name="email" onChange={handleChange} placeholder="Email" required />
      <input type="tel" name="phone" onChange={handleChange} placeholder="Numero di telefono" />
      <input name="district" onChange={handleChange} placeholder="Distretto" required />
      <input name="club" onChange={handleChange} placeholder="Club" required />
      <input type="role" name="role" onChange={handleChange} placeholder="Ruolo" required />

      {requiresOccupants && (
        <input name="occupants" onChange={handleChange} placeholder="Nomi compagni di stanza (separati da virgola)" />
      )}

      {requiresCantinaPackage && (
        <select name="cantina_package_type" onChange={handleChange} required>
          <option value="">Seleziona un pacchetto per Morbegno in Cantina</option>
          <option value="none">Nessun pacchetto</option>
          <option value="oro">Oro</option>
          <option value="rosso">Rosso</option>
          <option value="bianco">Bianco</option>
          <option value="analcolico">Analcolico</option>
        </select>
      )}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'In corso...' : 'Conferma Prenotazione'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default BookingForm;