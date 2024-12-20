export const STANDARD_FEE = 42;
export const RETIRED_SENIOR_FEE = 52;
export const HONORARY_MEMBER_MIN_DONATION = 100;

export const standardFeeStatuses = [
  "Actif",
  "Membre fondateur",
  "Retraité(e) depuis moins de 6 ans",
  "Élève"
];

export const getBaseMembershipFee = (status: string | undefined): number => {
  if (!status) return 0;
  if (standardFeeStatuses.includes(status)) return STANDARD_FEE;
  if (status === "Retraité(e) depuis 6 ans et plus") return RETIRED_SENIOR_FEE;
  return 0;
};