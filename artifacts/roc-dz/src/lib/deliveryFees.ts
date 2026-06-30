export interface DeliveryFee { home: number; office: number; }

export const ACCESSORY_FEES: Record<string, DeliveryFee> = {
  "01 - Adrar":              { home: 1650, office: 850 },
  "02 - Chlef":              { home: 700,  office: 450 },
  "03 - Laghouat":           { home: 850,  office: 450 },
  "04 - Oum El Bouaghi":     { home: 850,  office: 450 },
  "05 - Batna":              { home: 850,  office: 450 },
  "06 - Béjaïa":             { home: 850,  office: 450 },
  "07 - Biskra":             { home: 850,  office: 650 },
  "08 - Béchar":             { home: 1200, office: 650 },
  "09 - Blida":              { home: 650,  office: 400 },
  "10 - Bouira":             { home: 650,  office: 450 },
  "11 - Tamanrasset":        { home: 1800, office: 1000 },
  "12 - Tébessa":            { home: 850,  office: 450 },
  "13 - Tlemcen":            { home: 850,  office: 450 },
  "14 - Tiaret":             { home: 850,  office: 450 },
  "15 - Tizi Ouzou":         { home: 650,  office: 450 },
  "16 - Alger":              { home: 450,  office: 300 },
  "17 - Djelfa":             { home: 850,  office: 450 },
  "18 - Jijel":              { home: 850,  office: 450 },
  "19 - Sétif":              { home: 850,  office: 450 },
  "20 - Saïda":              { home: 850,  office: 450 },
  "21 - Skikda":             { home: 850,  office: 450 },
  "22 - Sidi Bel Abbès":     { home: 850,  office: 450 },
  "23 - Annaba":             { home: 850,  office: 450 },
  "24 - Guelma":             { home: 850,  office: 450 },
  "25 - Constantine":        { home: 850,  office: 450 },
  "26 - Médéa":              { home: 850,  office: 450 },
  "27 - Mostaganem":         { home: 850,  office: 450 },
  "28 - M'Sila":             { home: 850,  office: 450 },
  "29 - Mascara":            { home: 850,  office: 450 },
  "30 - Ouargla":            { home: 1000, office: 500 },
  "31 - Oran":               { home: 850,  office: 450 },
  "32 - El Bayadh":          { home: 850,  office: 450 },
  "33 - Illizi":             { home: 1650, office: 850 },
  "34 - Bordj Bou Arréridj": { home: 650,  office: 450 },
  "35 - Boumerdès":          { home: 650,  office: 400 },
  "36 - El Tarf":            { home: 850,  office: 550 },
  "37 - Tindouf":            { home: 1650, office: 700 },
  "38 - Tissemsilt":         { home: 850,  office: 450 },
  "39 - El Oued":            { home: 950,  office: 600 },
  "40 - Khenchela":          { home: 850,  office: 450 },
  "41 - Souk Ahras":         { home: 850,  office: 450 },
  "42 - Tipaza":             { home: 650,  office: 450 },
  "43 - Mila":               { home: 850,  office: 450 },
  "44 - Aïn Defla":          { home: 650,  office: 450 },
  "45 - Naâma":              { home: 950,  office: 500 },
  "46 - Aïn Témouchent":     { home: 850,  office: 450 },
  "47 - Ghardaïa":           { home: 950,  office: 650 },
  "48 - Relizane":           { home: 850,  office: 450 },
  "49 - Timimoun":           { home: 1650, office: 850 },
  "50 - Bordj Badji Mokhtar":{ home: 2000, office: 1200 },
  "51 - Ouled Djellal":      { home: 950,  office: 450 },
  "52 - Béni Abbès":         { home: 1390, office: 650 },
  "53 - In Salah":           { home: 1650, office: 850 },
  "54 - In Guezzam":         { home: 2000, office: 1200 },
  "55 - Touggourt":          { home: 950,  office: 500 },
  "56 - Djanet":             { home: 1650, office: 850 },
  "57 - El M'Ghair":         { home: 950,  office: 500 },
  "58 - El Meniaa":          { home: 950,  office: 500 },
};

const LAPTOP_FEE_ALGER = { home: 800, office: 500 };
const LAPTOP_FEE_OTHER = { home: 1500, office: 1000 };
export const LAPTOP_HOME_THRESHOLD = 85000;

export function isAlger(wilaya: string) {
  return wilaya.startsWith("16 -");
}

export function getLaptopFeePerUnit(wilaya: string, type: "domicile" | "bureau"): number {
  const fees = isAlger(wilaya) ? LAPTOP_FEE_ALGER : LAPTOP_FEE_OTHER;
  return type === "domicile" ? fees.home : fees.office;
}

export function getAccessoryFee(wilaya: string, type: "domicile" | "bureau"): number {
  const fees = ACCESSORY_FEES[wilaya];
  if (!fees) return type === "domicile" ? 850 : 450;
  return type === "domicile" ? fees.home : fees.office;
}

export interface CartItem {
  laptopId: string;
  title: string;
  price: number;
  advance: number;
  qty: number;
  isLaptop?: boolean;
  imageUrl?: string | null;
}

export function calcDelivery(
  items: CartItem[],
  wilaya: string,
  deliveryType: "domicile" | "bureau"
): { fee: number; homeBlocked: boolean } {
  if (!wilaya) return { fee: 0, homeBlocked: false };

  const laptops = items.filter(i => i.isLaptop !== false && i.advance !== undefined);
  const hasLaptop = laptops.length > 0;

  const totalRemaining = laptops.reduce((sum, i) => sum + (i.price - i.advance) * i.qty, 0);
  const homeBlocked = totalRemaining > LAPTOP_HOME_THRESHOLD;

  if (hasLaptop) {
    const laptopCount = laptops.reduce((s, i) => s + i.qty, 0);
    const fee = getLaptopFeePerUnit(wilaya, homeBlocked ? "bureau" : deliveryType) * laptopCount;
    return { fee, homeBlocked };
  }

  const fee = getAccessoryFee(wilaya, deliveryType);
  return { fee, homeBlocked: false };
}
