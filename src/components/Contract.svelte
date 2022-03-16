<script>

	// Initializations & Exports:
	export let connected;
	let wallet = { signer: {}, address: '', chainID: 0 }
	let balances = { unclaimed: 0, claimed: 0 }
	let approved = false;
	let update = 0;

	// NFT Addresses:
	let unclaimedNFT = '0x3555cAB4b6628BeEA81d20Cb8a832A16B69671F7';
	let claimedNFT = ''; // <TODO> Enter claimed NFT address here once deployed.
	let testUnclaimedNFT = '0xe2d02D310d3451A6B4eAA35091346767643f6753';
	let testClaimedNFT = '0xb696F7E1d219E48169fc5a20F1B6B8d138f30dD8';

	// ABIs:
	let unclaimedABI = [
		{ constant: true, inputs: [{ name: "owner", type: "address" }], name: "balanceOf", outputs: [{ name: "", type: "uint256" }], type: "function" },
		{ constant: true, inputs: [{ name: "owner", type: "address" }, { name: "operator", type: "address" }], name: "isApprovedForAll", outputs: [{ name: "", type: "bool" }], type: "function" },
		{ constant: false, inputs: [{ name: "operator", type: "address" }, { name: "approved", type: "bool" }], name: "setApprovalForAll", outputs: [], type: "function" }
	];
	let claimedABI = [
		{ constant: true, inputs: [{ name: "owner", type: "address" }], name: "balanceOf", outputs: [{ name: "", type: "uint256" }], type: "function" },
		{ constant: false, inputs: [{ name: "qty", type: "uint256" }], name: "mintAndBurn", outputs: [], type: "function" }
	];

	// Reactively Updating Wallet Info:
	$: fetchWalletInfo(connected, update);

	// Function to fetch wallet info:
	const fetchWalletInfo = async () => {
		if(connected) {
			let provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
			wallet.signer = provider.getSigner();
			wallet.address = await wallet.signer.getAddress();
			wallet.chainID = await wallet.signer.getChainId();
			fetchBalances();
			checkApprovals();
		}
	}

	// Function to fetch the user NFT balances:
	const fetchBalances = async () => {
		try {
			if(wallet.chainID === 43113) {
				let unclaimedNFTContract = new ethers.Contract(testUnclaimedNFT, unclaimedABI, wallet.signer);
				let claimedNFTContract = new ethers.Contract(testClaimedNFT, claimedABI, wallet.signer);
				balances.unclaimed = parseInt(await unclaimedNFTContract.balanceOf(wallet.address));
				balances.claimed = parseInt(await claimedNFTContract.balanceOf(wallet.address));
			} else if(wallet.chainID === 43114) {
				let unclaimedNFTContract = new ethers.Contract(unclaimedNFT, unclaimedABI, signer);
				let claimedNFTContract = new ethers.Contract(claimedNFT, claimedABI, signer);
				balances.unclaimed = parseInt(await unclaimedNFTContract.balanceOf(wallet.address));
				balances.claimed = parseInt(await claimedNFTContract.balanceOf(wallet.address));
			}
		} catch {
			console.error('Something went wrong while checking NFT balances.');
		}
	}

	// Function to check if unclaimed NFTs have been approved for burning:
	const checkApprovals = async () => {
		try {
			if(wallet.chainID === 43113) {
				let unclaimedNFTContract = new ethers.Contract(testUnclaimedNFT, unclaimedABI, wallet.signer);
				approved = await unclaimedNFTContract.isApprovedForAll(wallet.address, testClaimedNFT);
			} else if(wallet.chainID === 43114) {
				let unclaimedNFTContract = new ethers.Contract(unclaimedNFT, unclaimedABI, wallet.signer);
				approved = await unclaimedNFTContract.isApprovedForAll(wallet.address, claimedNFT);
			}
		} catch {
			console.error('Something went wrong while checking NFT approvals.');
		}
	}

	// Function to approve all unclaimed NFTs for burning:
	const approveAll = async () => {
		if(connected && !approved) {
			try {
				let tx;
				if(wallet.chainID === 43113) {
					let unclaimedNFTContract = new ethers.Contract(testUnclaimedNFT, unclaimedABI, wallet.signer);
					tx = await unclaimedNFTContract.setApprovalForAll(testClaimedNFT, true);
				} else {
					let unclaimedNFTContract = new ethers.Contract(unclaimedNFT, unclaimedABI, wallet.signer);
					tx = await unclaimedNFTContract.setApprovalForAll(claimedNFT, true);
				}
				let receipt = await tx.wait();
				if(receipt.status) {
					approved = true;
				} else {
					console.error('Approval TX reverted.');
				}
			} catch {
				console.error('Something went wrong while trying to approve NFTs.');
			}
		}
	}

	// Function to mint new claimed NFT while burning the old unclaimed NFT:
	const mintAndBurn = async () => {
		if(connected) {
			try {
				let tx;
				if(wallet.chainID === 43113) {
					let claimedNFTContract = new ethers.Contract(testClaimedNFT, claimedABI, wallet.signer);
					tx = await claimedNFTContract.mintAndBurn(1);
				} else {
					let claimedNFTContract = new ethers.Contract(claimedNFT, claimedABI, wallet.signer);
					tx = await claimedNFTContract.mintAndBurn(1);
				}
				let receipt = await tx.wait();
				if(receipt.status) {
					update++;
				} else {
					console.error('Claiming TX reverted.');
				}
			} catch {
				console.error('Something went wrong while trying to claim NFTs.');
			}
		}
	}

</script>

<!-- #################################################################################################### -->

<!-- Displaying NFT Balances -->
<span>Unclaimed NFTs: {balances.unclaimed}</span>
<span>Claimed NFTs: {balances.claimed}</span>

{#if balances.unclaimed > 0}

	<!-- Approval Button -->
	<button on:click={() => approveAll()} disabled={!connected || approved}>Approve</button>

	<!-- Claiming Button -->
	<button on:click={() => mintAndBurn()} disabled={!connected || !approved}>Claim NFT</button>

{/if}

<!-- #################################################################################################### -->

<style>

	span {
		display: flex;
	}

</style>