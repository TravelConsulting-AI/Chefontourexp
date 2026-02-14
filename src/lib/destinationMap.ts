/**
 * Maps the human-readable destination labels used in BookingModal dropdown
 * to canonical_slug values in the tours table.
 *
 * When a user selects "Málaga, Spain" from the homepage modal,
 * we look up the canonical_slug → then resolve tour_id at runtime.
 */
export const DESTINATION_SLUG_MAP: Record<string, string> = {
    'Medellín, Colombia': 'medellin',
    'Rio de Janeiro, Brazil': 'rio-de-janeiro',
    'Barcelona, Spain': 'barcelona',
    'Palermo, Italy': 'palermo',
    'Buenos Aires, Argentina': 'buenos-aires',
    'Málaga, Spain': 'malaga',
    'Istanbul, Turkey': 'istanbul',
    'Beirut, Lebanon': 'beirut',
};
