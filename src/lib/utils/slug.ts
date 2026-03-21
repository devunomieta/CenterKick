export function generateBaseSlug(role: string, firstName: string, lastName: string): string {
  // Account type capitalized
  const roleType = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  
  // Names cleaned: lowercase, hyphenated, no special chars
  const cleanFirstName = firstName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanLastName = lastName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  
  return `CK${roleType}-${cleanFirstName}-${cleanLastName}`;
}

export function generateRandomSuffix(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
