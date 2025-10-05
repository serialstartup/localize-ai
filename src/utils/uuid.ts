/**
 * Utility functions for UUID handling
 */

/**
 * Creates a valid UUID v4 from any string input
 * If input is already a valid UUID, returns it as is
 * Otherwise, creates a deterministic UUID-like string from the input
 */
export const createValidUUID = (input: string): string => {
  // If it's already a valid UUID, return as is
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input)) {
    return input;
  }
  
  // Create a hash-like string from input
  let hash = '';
  for (let i = 0; i < input.length; i++) {
    hash += input.charCodeAt(i).toString(16).padStart(2, '0');
  }
  
  // Ensure we have exactly 32 hex characters
  hash = (hash + '0'.repeat(32)).substring(0, 32);
  
  // Format as UUID v4
  return [
    hash.substring(0, 8),
    hash.substring(8, 12),
    '4' + hash.substring(13, 16), // UUID v4 version
    '8' + hash.substring(17, 20), // UUID v4 variant
    hash.substring(20, 32)
  ].join('-');
};

/**
 * Validates if a string is a valid UUID
 */
export const isValidUUID = (uuid: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
};