export const notAuthUserPathnames = [
  "/auth"
];

export const authUserPathnames = [
  "/account"
];

export const userPathnames = [
  ...authUserPathnames,
  "/schedule",
  "/subscription"
];

export const coachUserPathnames = [
  ...authUserPathnames,
  "/groups",
];

export const generalCoachUserPathnames = [
  ...authUserPathnames,
  ...coachUserPathnames,
  "/users",
  "/applications",
  "/places",
];

export const directorUserPathnames = [...generalCoachUserPathnames];

export const accountPathnames = Array.from(new Set([
  ...userPathnames,
  ...coachUserPathnames,
  ...generalCoachUserPathnames,
  ...directorUserPathnames
]));

export const appPathnames = [
  ...notAuthUserPathnames,
  ...accountPathnames
]