<script>

	// Imports:
	import { onMount } from 'svelte';

	// Initializations & Exports:
	export let connected = false;
	let wallets = [];
	let chainID = '';
	let account = '';
	let balance = 0;
	let chains = {
		'0x1': 'Ethereum',
		'0x38': 'BSC',
		'0x89': 'Polygon',
		'0xfa': 'Fantom',
		'0xa86a': 'Avalanche',
		'0xa869': 'Fuji Testnet',
		'0x63564c40': 'Harmony'
	}
	let avaxParams = {
		chainId: '0xa86a',
		chainName: 'Avalanche C-Chain',
		nativeCurrency: {
			name: 'AVAX',
			symbol: 'AVAX',
			decimals: 18
		},
		rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
		blockExplorerUrls: ['https://snowtrace.io']
	}

	// Function to connect to wallet:
	const connect = async () => {
		if(typeof window.ethereum !== 'undefined') {
			try {
				chainID = await ethereum.request({ method: 'eth_chainId' });
				let accounts = await ethereum.request({ method: 'eth_requestAccounts' });
				if(chainID !== '' && accounts.length > 0) {
					connected = true;
					handleAccountChange(accounts);
					if(chainID !== '0xa86a' && chainID !== '0xa869') {
						switchToOrAddAvalanche();
					}
				}
			} catch(err) {
				connected = false;
				if(err.code === 4001) {
					console.error('User has rejected the wallet connection.');
				} else {
					console.error('Something went wrong while connecting to wallet.');
				}
			}
		}
	}

	// Function to handle network changes:
	const handleNetworkChange = async () => {
		connected = false;
		if(account != '') {
			try {
				chainID = await ethereum.request({ method: 'eth_chainId' });
				if(chainID === '0xa86a' || chainID === '0xa869') {
					balance = await getAVAX(account, chainID);
					connected = true;
				}
			} catch {
				console.error('Something went wrong while changing wallet networks.');
			}
		}
	}

	// Function to handle account changes:
	const handleAccountChange = async (accounts) => {
		connected = false;
		if(accounts.length > 0) {
			account = accounts[0];
			if(!wallets.includes(account)) {
				wallets.push(account);
				localStorage.wallets = JSON.stringify(wallets);
			}
			if(chainID === '0xa86a' || chainID === '0xa869') {
				balance = await getAVAX(account, chainID);
				connected = true;
			}
		}
	}

	// Function to switch to or add the Avalanche C-Chain network:
	const switchToOrAddAvalanche = async () => {
		try {
			await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0xa86a' }] });
		} catch(switchError) {
			if(switchError.code === 4092) {
				try {
					await ethereum.request({ method: 'wallet_addEthereumChain', params: [avaxParams] });
				} catch(addError) {
					console.error('Something went wrong while adding the Avalanche C-Chain network.');
				}
			} else if(switchError.code === 4092) {
				console.error('User has rejected the network switch.');
			} else {
				console.error('Something went wrong while switching wallet networks.');
			}
		}
	}

	// Function to get wallet AVAX balance:
	const getAVAX = async (wallet, chainID) => {
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
  
	onMount(async () => {

		// Fetching wallets from local storage:
		if(localStorage.getItem('wallets') === null) {
			localStorage.setItem('wallets', JSON.stringify([]));
		} else {
			wallets = JSON.parse(localStorage.wallets);
		}

		// Connecting automatically if user has used the site before:
		if(wallets.length > 0) {
			connect();
		}

		// Handling network changes:
		ethereum.on('chainChanged', handleNetworkChange);

		// Handling account changes:
		ethereum.on('accountsChanged', handleAccountChange);

	});

</script>

<!-- #################################################################################################### -->

<!-- Navbar -->
<div id="navbar">

	<!-- Snowball Logo -->
	<div id="logo">
		<img src="snowball-logo.svg" alt="Snowball">
	</div>
	
	<!-- Wallet -->
	<div id="wallet">
		{#if account === ''}
	
			<!-- Wallet Connection Button -->
			<button id="connectWallet" on:click={() => connect()}>Connect Wallet</button>
	
		{:else}
	
			<!-- Displaying Connected Network -->
			<span id="network">{chains[chainID] ? chains[chainID] : 'Unidentified Network'}</span>

			<!-- Displaying Network Error Message -->
			{#if chainID !== '0xa86a' && chainID !== '0xa869'}
				<span id="networkWarning">Please connect to Avalanche C-Chain</span>

			<!-- Displaying AVAX Balance -->
			{:else}
				<span id="avaxBalance">{balance.toFixed(3)} AVAX</span>
			{/if}

			<!-- Displaying Connected Wallet -->
			<span id="address"><a href="https://snowtrace.io/address/{account}" target="_blank">{account.slice(0, 6)}...{account.slice(-4)}</a></span>

		{/if}
	</div>
</div>


<!-- #################################################################################################### -->

<style>

	#navbar {
		display: flex;
		justify-content: space-between;
		width: 100%;
	}

	#logo {
		display: flex;
		align-items: center;
		margin: 1em 2em;
	}

	#logo > img {
		height: 2.5em;
	}

	#wallet {
		display: flex;
		align-items: center;
		margin: 1em 2em;
		border-radius: .6em;
		background: #47C2FF;
	}

	#wallet > button {
		padding: .6em 2em;
		white-space: nowrap;
	}

	#wallet > span {
		padding: .6em 1em;
		white-space: nowrap;
	}

	#connectWallet {
		border: none;
		background-color: transparent;
		cursor: pointer;
	}

	#network {
		color: black;
		border-right: 1px solid black;
	}

	#networkWarning {
		background-color: #D62839;
	}

	#avaxBalance {
		color: black;
	}

	#address {
		color: black;
		border-left: 1px solid black;
	}

	#address > a {
		color: black;
	}

	/* Mobile CSS */
	@media only screen and (max-width: 625px) {

		#network, #networkWarning, #avaxBalance {
			display: none;
		}
	}

</style>