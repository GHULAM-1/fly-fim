/**
 * Normalize city name to standard format: "New York" or "New York & New Jersey" (Title Case with spaces)
 * Examples:
 * "new york" -> "New York"
 * "new-york" -> "New York"
 * "NEW YORK" -> "New York"
 * "new_York" -> "New York"
 * "new-york&new-jersey" -> "New York & New Jersey"
 * "NEW YORK & NEW JERSEY" -> "New York & New Jersey"
 * "lahore" -> "Lahore"
 * "LAHORE" -> "Lahore"
 */
export function normalizeCityName(input: string): string {
  return input
    .trim()
    .replace(/[-_]+/g, ' ')        // Convert hyphens/underscores to spaces
    .replace(/\s*&\s*/g, ' & ')    // Normalize & with proper spacing
    .replace(/\s+/g, ' ')          // Remove multiple spaces
    .replace(/[^\w\s&]/g, '')      // Remove special characters except spaces and &
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase()); // Title case each word
}

/**
 * Create a comparison key for duplicate checking
 * Converts to lowercase, removes spaces/hyphens/& for comparison
 * Examples:
 * "New York" -> "newyork"
 * "new-york" -> "newyork"
 * "New York & New Jersey" -> "newyorkandnewjersey"
 */
export function createComparisonKey(cityName: string): string {
  return cityName
    .toLowerCase()
    .replace(/\s*&\s*/g, 'and')    // Convert & to "and" for comparison
    .replace(/[-_\s]+/g, '')       // Remove all separators
    .replace(/[^\w]/g, '');        // Remove any remaining special chars
}

/**
 * Check if a city already exists by comparing normalized forms
 * Returns the existing city if found, null if it's unique
 */
export function findExistingCity(
  inputCity: string,
  existingCities: Array<{name: string}>
): {name: string} | null {
  const inputKey = createComparisonKey(inputCity);

  return existingCities.find(city =>
    createComparisonKey(city.name) === inputKey
  ) || null;
}

/**
 * Get unique cities list - removes duplicates and normalizes names
 */
export function getUniqueCities(cities: Array<{_id: string, name: string}>): Array<{_id: string, name: string}> {
  const seen = new Map<string, {_id: string, name: string}>();

  cities.forEach(city => {
    const normalizedName = normalizeCityName(city.name);
    const key = createComparisonKey(normalizedName);

    if (!seen.has(key)) {
      seen.set(key, {
        _id: city._id,
        name: normalizedName
      });
    }
  });

  return Array.from(seen.values());
}

/**
 * Generate common input variations that users might type
 * Used for search/matching purposes
 */
export function generateSearchVariations(cityName: string): string[] {
  const base = normalizeCityName(cityName);
  const variations = new Set<string>();

  // Add the normalized form
  variations.add(base);

  // Add lowercase version
  variations.add(base.toLowerCase());

  // Add uppercase version
  variations.add(base.toUpperCase());

  // Add hyphenated versions
  variations.add(base.replace(/\s/g, '-').toLowerCase());
  variations.add(base.replace(/\s/g, '-').toUpperCase());
  variations.add(base.replace(/\s/g, '-'));

  // Add underscore versions
  variations.add(base.replace(/\s/g, '_').toLowerCase());

  // Add no-space version
  variations.add(base.replace(/\s/g, '').toLowerCase());

  // Handle & variations
  if (base.includes(' & ')) {
    variations.add(base.replace(/ & /g, '&'));
    variations.add(base.replace(/ & /g, '-&-'));
    variations.add(base.replace(/ & /g, '_&_'));
  }

  return Array.from(variations).filter(v => v.length > 0);
}