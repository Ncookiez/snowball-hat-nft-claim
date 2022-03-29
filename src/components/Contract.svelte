<script>

	// Import:
	import axios from 'axios';
	import qs from 'qs';

	// Initializations & Exports:
	export let unclaimedNFTs = undefined;
	export let connected;
	export let formData;
	export let formSubmission = { valid: undefined, request: {} }
	const apiURL = 'http://localhost:4000/nftorder';
	let wallet = { signer: {}, address: '', chainID: 0 }
	let approved = false;
	let update = 0;

	// NFT Addresses:
	let unclaimedNFT = '0x9fF1918d212c435AD1F1734E9C4DC2DB835161Af';
	let claimedNFT = '0x16437ED3d48315865173B85A81972f42B08732E4';
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
		unclaimedNFTs = undefined;
		approved = false;
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
				unclaimedNFTs = parseInt(await unclaimedNFTContract.balanceOf(wallet.address));
			} else if(wallet.chainID === 43114) {
				let unclaimedNFTContract = new ethers.Contract(unclaimedNFT, unclaimedABI, wallet.signer);
				unclaimedNFTs = parseInt(await unclaimedNFTContract.balanceOf(wallet.address));
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
					await sendFormData(receipt);
				} else {
					console.error('Claiming TX reverted.');
				}
			} catch {
				console.error('Something went wrong while trying to claim NFTs.');
			}
		}
	}

	// Function to send form data to API:
	const sendFormData = async (receipt) => {
		formSubmission.valid = undefined;
		formSubmission.request = {
			method: 'post',
			url: apiURL,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: formatData(receipt.transactionHash)
		}
		await axios(formSubmission.request).then((res) => {
			if(res.data.status.validated) {
				formSubmission.valid = true;
			} else {
				formSubmission.valid = false;
			}
		}).catch((err) => {
			console.error(err);
			formSubmission.valid = false;
		});
	}

	// Function to format form data for API request:
	const formatData = (txHash) => {
		let formattedData = {};
		formattedData.tx_hash = txHash;
		formattedData.first_name = formData.firstName;
		formattedData.last_name = formData.lastName;
		formattedData.floor_staircase = formData.floor;
		formattedData.building = formData.building;
		formattedData.street_w_number = formData.street;
		formattedData.state = formData.state.name;
		formattedData.zip_code = formData.zipCode;
		formattedData.city = formData.city.name;
		formattedData.iso_country_code = formData.country.iso2;
		formattedData.landline = formData.landline;
		formattedData.cellnumber = formData.phone;
		formattedData.email = formData.email;
		return qs.stringify(formattedData);
	}

</script>

<!-- #################################################################################################### -->

{#if unclaimedNFTs > 0}
	<div id="buttons">

		<!-- Approval Button -->
		<button id="approve" on:click={() => approveAll()} disabled={!connected || approved || !formData.valid}>Approve</button>
	
		<!-- Claiming Button -->
		<button id="claim" on:click={() => mintAndBurn()} disabled={!connected || !approved || !formData.valid}>Claim NFT</button>
	</div>
{/if}

<!-- #################################################################################################### -->

<style>

	#buttons {
		display: flex;
		justify-content: center;
	}

	#approve, #claim {
		display: flex;
		margin: 1em;
		padding: .6em 2em;
		border: none;
		border-radius: .8em;
		color: #1E2644;
		background: #47C2FF;
		white-space: nowrap;
		cursor: pointer;
	}

	#approve:disabled, #claim:disabled {
		color: #47C2FF;
		border: 2px solid #47C2FF;
		background: transparent;
		cursor: default;
	}

	/* Mobile CSS */
	@media only screen and (max-width: 625px) {

		#buttons {
			flex-direction: column;
			align-items: center;
		}

		#approve {
			margin-bottom: 0;
			padding: .6em 2.3em;
		}
	}

</style>