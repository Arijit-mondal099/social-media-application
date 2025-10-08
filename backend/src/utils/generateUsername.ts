/**
 * @description build unique username while user register their account
 * @returns string
 */

export const generateUsername = (name: string): string => {
  const base = name.trim().toLowerCase().replace(/\s+/g, "_");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${base}${random}`;
};
