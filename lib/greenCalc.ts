// Average distance from any point in Ahmedabad to a central location (e.g., ICAI branch) is roughly 10km one way.
// Total ride = 20km round trip.
const AVG_ROUND_TRIP_KM = 20;

// Emissions per km driven standard passenger car ~ 0.21 kg CO2 / km
const CO2_KG_PER_KM = 0.21;

// Average fuel efficiency ~ 15 km per litre
const FUEL_KMPL = 15;

// Average fuel cost (Petrol) ~ 100 INR per litre
const FUEL_COST_PER_LITRE = 100;

/**
 * Calculates green metrics based on the number of rides shared.
 * 
 * Assumption: 1 "ride shared" means exactly one car was taken off the road. 
 * E.g., if a 4-seater car is full, 3 rides were "shared" (3 cars taken off road).
 */
export function calculateGreenMetrics(totalRidesShared: number) {
  const kmSaved = totalRidesShared * AVG_ROUND_TRIP_KM;
  
  const co2SavedKg = kmSaved * CO2_KG_PER_KM;
  const fuelSavedLitres = kmSaved / FUEL_KMPL;
  const moneySavedINR = fuelSavedLitres * FUEL_COST_PER_LITRE;

  // A typical mature tree absorbs ~21 kg CO2 per year. 
  // Let's frame it as "equivalent to planting X trees (annual)"
  const treesPlantedEquivalent = co2SavedKg / 21;

  return {
    kmSaved: Math.round(kmSaved),
    co2SavedKg: Math.round(co2SavedKg * 10) / 10, // 1 decimal
    fuelSavedLitres: Math.round(fuelSavedLitres * 10) / 10,
    moneySavedINR: Math.round(moneySavedINR),
    treesPlantedEquivalent: Math.max(0.1, Math.round(treesPlantedEquivalent * 10) / 10), // minimum 0.1
  };
}
