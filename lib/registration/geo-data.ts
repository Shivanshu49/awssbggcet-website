import { ComboboxOption } from '@/components/registration/SearchableCombobox';

export const STATE_OPTIONS: ComboboxOption[] = [
  { value: 'Uttar Pradesh', label: 'Uttar Pradesh (UP)' },
  { value: 'Delhi', label: 'Delhi (NCT)' },
  { value: 'Haryana', label: 'Haryana' },
  { value: 'Other', label: 'Other State' },
];

// Helper to generate full Noida sectors from 1 to 168 plus special identifiers
function generateNoidaSectors(): ComboboxOption[] {
  const specialSectors = ['15A', '16A', '16B', '21A', '25A', '38A', '63A', '93A', '93B', '143B'];
  const sectors: ComboboxOption[] = [];

  for (let i = 1; i <= 168; i++) {
    sectors.push({
      value: `Noida Sector ${i}`,
      label: `Noida Sector ${i}`,
      category: 'Noida Sectors (1-168)',
      sublabel: 'Gautam Buddha Nagar, UP',
    });
  }

  specialSectors.forEach((spec) => {
    sectors.push({
      value: `Noida Sector ${spec}`,
      label: `Noida Sector ${spec}`,
      category: 'Noida Special Sectors',
      sublabel: 'Gautam Buddha Nagar, UP',
    });
  });

  return sectors;
}

export const UTTAR_PRADESH_NCR_OPTIONS: ComboboxOption[] = [
  // GREATER NOIDA
  { value: 'Alpha 1', label: 'Alpha 1, Greater Noida', category: 'Greater Noida', sublabel: 'UP NCR' },
  { value: 'Alpha 2', label: 'Alpha 2, Greater Noida', category: 'Greater Noida', sublabel: 'UP NCR' },
  { value: 'Beta 1', label: 'Beta 1, Greater Noida', category: 'Greater Noida', sublabel: 'UP NCR' },
  { value: 'Beta 2', label: 'Beta 2, Greater Noida', category: 'Greater Noida', sublabel: 'UP NCR' },
  { value: 'Gamma 1', label: 'Gamma 1, Greater Noida', category: 'Greater Noida', sublabel: 'UP NCR' },
  { value: 'Gamma 2', label: 'Gamma 2, Greater Noida', category: 'Greater Noida', sublabel: 'UP NCR' },
  { value: 'Delta 1', label: 'Delta 1, Greater Noida', category: 'Greater Noida', sublabel: 'UP NCR' },
  { value: 'Delta 2', label: 'Delta 2, Greater Noida', category: 'Greater Noida', sublabel: 'UP NCR' },
  { value: 'Knowledge Park I', label: 'Knowledge Park I, Greater Noida', category: 'Greater Noida', sublabel: 'Institutional Area' },
  { value: 'Knowledge Park II', label: 'Knowledge Park II, Greater Noida', category: 'Greater Noida', sublabel: 'Institutional Area' },
  { value: 'Knowledge Park III', label: 'Knowledge Park III, Greater Noida', category: 'Greater Noida', sublabel: 'Institutional Area' },
  { value: 'Knowledge Park IV', label: 'Knowledge Park IV, Greater Noida', category: 'Greater Noida', sublabel: 'Institutional Area' },
  { value: 'Pari Chowk', label: 'Pari Chowk, Greater Noida', category: 'Greater Noida', sublabel: 'UP NCR' },
  { value: 'Techzone', label: 'Techzone / IT Park, Greater Noida', category: 'Greater Noida', sublabel: 'UP NCR' },
  { value: 'Surajpur', label: 'Surajpur, Greater Noida', category: 'Greater Noida', sublabel: 'UP NCR' },
  { value: 'Ecotech', label: 'Ecotech Industrial, Greater Noida', category: 'Greater Noida', sublabel: 'UP NCR' },
  { value: 'Greater Noida West', label: 'Greater Noida West (Noida Extension)', category: 'Greater Noida', sublabel: 'UP NCR' },
  { value: 'Dadri', label: 'Dadri, Greater Noida', category: 'Greater Noida', sublabel: 'UP NCR' },
  { value: 'Jewar', label: 'Jewar (Noida Int Airport Region)', category: 'Greater Noida', sublabel: 'UP NCR' },

  // GHAZIABAD
  { value: 'Indirapuram', label: 'Indirapuram, Ghaziabad', category: 'Ghaziabad', sublabel: 'UP NCR' },
  { value: 'Vaishali', label: 'Vaishali, Ghaziabad', category: 'Ghaziabad', sublabel: 'UP NCR' },
  { value: 'Vasundhara', label: 'Vasundhara, Ghaziabad', category: 'Ghaziabad', sublabel: 'UP NCR' },
  { value: 'Raj Nagar', label: 'Raj Nagar, Ghaziabad', category: 'Ghaziabad', sublabel: 'UP NCR' },
  { value: 'Raj Nagar Extension', label: 'Raj Nagar Extension, Ghaziabad', category: 'Ghaziabad', sublabel: 'UP NCR' },
  { value: 'Kavi Nagar', label: 'Kavi Nagar, Ghaziabad', category: 'Ghaziabad', sublabel: 'UP NCR' },
  { value: 'Crossings Republik', label: 'Crossings Republik, Ghaziabad', category: 'Ghaziabad', sublabel: 'UP NCR' },
  { value: 'Sahibabad', label: 'Sahibabad, Ghaziabad', category: 'Ghaziabad', sublabel: 'UP NCR' },
  { value: 'Loni', label: 'Loni, Ghaziabad', category: 'Ghaziabad', sublabel: 'UP NCR' },

  // OTHER UP NCR CITIES
  { value: 'Meerut', label: 'Meerut', category: 'Other UP NCR', sublabel: 'UP NCR' },
  { value: 'Modinagar', label: 'Modinagar', category: 'Other UP NCR', sublabel: 'UP NCR' },
  { value: 'Hapur', label: 'Hapur', category: 'Other UP NCR', sublabel: 'UP NCR' },
  { value: 'Bulandshahr', label: 'Bulandshahr', category: 'Other UP NCR', sublabel: 'UP NCR' },

  // NOIDA SECTORS
  ...generateNoidaSectors(),
];

export const DELHI_OPTIONS: ComboboxOption[] = [
  // 11 DELHI DISTRICTS
  { value: 'Central Delhi', label: 'Central Delhi (Connaught Place, Karol Bagh, Paharganj)', category: 'Delhi Districts' },
  { value: 'New Delhi', label: 'New Delhi (Chanakyapuri, India Gate, Parliament)', category: 'Delhi Districts' },
  { value: 'North Delhi', label: 'North Delhi (Civil Lines, Kashmere Gate, Model Town)', category: 'Delhi Districts' },
  { value: 'North West Delhi', label: 'North West Delhi (Rohini, Pitampura, Shalimar Bagh)', category: 'Delhi Districts' },
  { value: 'West Delhi', label: 'West Delhi (Janakpuri, Rajouri Garden, Punjabi Bagh)', category: 'Delhi Districts' },
  { value: 'South West Delhi', label: 'South West Delhi (Dwarka, Vasant Kunj, Najafgarh)', category: 'Delhi Districts' },
  { value: 'South Delhi', label: 'South Delhi (Hauz Khas, Saket, Greater Kailash)', category: 'Delhi Districts' },
  { value: 'South East Delhi', label: 'South East Delhi (Lajpat Nagar, Kalkaji, Okhla)', category: 'Delhi Districts' },
  { value: 'East Delhi', label: 'East Delhi (Mayur Vihar, Preet Vihar, Laxmi Nagar)', category: 'Delhi Districts' },
  { value: 'North East Delhi', label: 'North East Delhi (Yamuna Vihar, Shahdara North)', category: 'Delhi Districts' },
  { value: 'Shahdara', label: 'Shahdara District (Dilshad Garden, Vivek Vihar)', category: 'Delhi Districts' },
];

export const HARYANA_OPTIONS: ComboboxOption[] = [
  { value: 'Gurugram - Cyber City / DLF Phase 1-5', label: 'Gurugram - Cyber City / DLF', category: 'Gurugram' },
  { value: 'Gurugram - Golf Course Road', label: 'Gurugram - Golf Course Road / Ext', category: 'Gurugram' },
  { value: 'Gurugram - Sohna Road', label: 'Gurugram - Sohna Road', category: 'Gurugram' },
  { value: 'Gurugram - Sector 14 / Old Gurgaon', label: 'Gurugram - Sector 14 / Old City', category: 'Gurugram' },
  { value: 'Gurugram - Manesar (IMT)', label: 'Gurugram - Manesar (IMT)', category: 'Gurugram' },
  { value: 'Faridabad - NIT / Sector 1-40', label: 'Faridabad - NIT & Sectors', category: 'Faridabad' },
  { value: 'Faridabad - Greater Faridabad', label: 'Faridabad - Neharpar / Greater', category: 'Faridabad' },
  { value: 'Sonipat', label: 'Sonipat / Rai Educational Hub', category: 'Other Haryana NCR' },
  { value: 'Rohtak', label: 'Rohtak', category: 'Other Haryana NCR' },
  { value: 'Panipat', label: 'Panipat', category: 'Other Haryana NCR' },
  { value: 'Jhajjar / Bahadurgarh', label: 'Bahadurgarh / Jhajjar', category: 'Other Haryana NCR' },
];

