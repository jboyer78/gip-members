export const getBaseMembershipFee = (status: string): number => {
  const feeMap: { [key: string]: number } = {
    'actif': 42,
    'retraite': 30,
    'honoraire': 25,
    'bienfaiteur': 50
  };

  return feeMap[status.toLowerCase()] || 42;
};