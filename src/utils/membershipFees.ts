export const HONORARY_MEMBER_MIN_DONATION = 100;

export const getBaseMembershipFee = (status: string): number => {
  const feeMap: { [key: string]: number } = {
    'actif': 42,
    'retraite': 30,
    'honoraire': 25,
    'bienfaiteur': 50,
    "Membre d'honneur": 100
  };

  return feeMap[status.toLowerCase()] || 42;
};