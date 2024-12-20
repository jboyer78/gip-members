export const HONORARY_MEMBER_MIN_DONATION = 100;

export const getBaseMembershipFee = (status?: string): number => {
  if (!status) return 42;

  switch (status) {
    case "Retraité(e) depuis 6 ans et plus":
      return 52;
    case "Membre d'honneur":
      return 0; // Honorary members make donations instead
    default:
      return 42; // Default fee for active members, students, etc.
  }
};