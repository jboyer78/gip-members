export const HONORARY_MEMBER_MIN_DONATION = 100;

export const getBaseMembershipFee = (status: string | undefined): number => {
  if (!status) return 42; // Default fee if no status is provided
  
  const feeMap: { [key: string]: number } = {
    'actif': 42,
    'retraite': 30,
    'honoraire': 25,
    'bienfaiteur': 50,
    "membre d'honneur": 100
  };

  return feeMap[status.toLowerCase()] || 42; // Return default fee if status is not found
};