
// Function to get wallet AVAX balance:
export const getAVAX = async (wallet, chainID) => {
  let balance;
  try {
    if(chainID === '0xa869') {
      balance = parseInt(await fuji.getBalance(wallet)) / (10 ** 18);
    } else {
      balance = parseInt(await avax.getBalance(wallet)) / (10 ** 18);
    }
    return balance;
  } catch {
    console.error('Unable to fetch wallet AVAX balance.');
    return 0;
  }
}

/* ====================================================================================================================================================== */