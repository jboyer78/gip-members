export const HONORARY_MEMBER_MIN_DONATION = 100;

export const getBaseMembershipFee = (status: string | null): number => {
  if (!status) return 0;

  switch (status) {
    case "Actif":
    case "Membre fondateur":
    case "Retraité(e) depuis moins de 6 ans":
    case "Élève":
      return 42;
    case "Retraité(e) depuis 6 ans et plus":
      return 52;
    case "Membre d'honneur":
      return 0;
    default:
      return 0;
  }
};