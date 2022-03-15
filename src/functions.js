
// Function to get wallet AVAX balance:
export const getAVAX = async (wallet) => {
  try {
    let balance = parseInt(await avax.getBalance(wallet)) / (10 ** 18);
    return balance;
  } catch {
    console.error('Unable to fetch wallet AVAX balance.');
    return 0;
  }
}

/* ====================================================================================================================================================== */