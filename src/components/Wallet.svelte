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
		try {
			chainID = await ethereum.request({ method: 'eth_chainId' });
			if(chainID === '0xa86a' || chainID === '0xa869') {
				balance = await getAVAX(account, chainID);
				connected = true;
			} else {
				connected = false;
			}
		} catch {
			console.error('Something went wrong while changing wallet networks.');
		}
	}

	// Function to handle network changes:
	const handleAccountChange = async (accounts) => {
		if(accounts.length > 0) {
			account = accounts[0];
			if(!wallets.includes(account)) {
				wallets.push(account);
				localStorage.wallets = JSON.stringify(wallets);
			}
			if(chainID === '0xa86a' || chainID === '0xa869') {
				balance = await getAVAX(account, chainID);
				connected = true;
			} else {
				connected = false;
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

<div id="wallet">
	{#if account === ''}

		<!-- Wallet Connection Button -->
		<button id="connectWallet" on:click={() => connect()}>Connect Wallet</button>

	{:else}
		<div id="walletInfo">

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
		</div>
	{/if}
</div>

<!-- #################################################################################################### -->

<style>

	a {
		color: white;
	}

	#wallet {
		display: flex;
		justify-content: right;
		width: 100%;
	}

	#connectWallet {
		display: flex;
		margin: 1em;
		padding: .6em 1em;
		border: 2px solid white;
		border-radius: .6em;
		color: white;
		background: #495272;
		cursor: pointer;
	}

	#walletInfo {
		display: flex;
		margin: 1em;
		border: 2px solid white;
		border-radius: .6em;
		background: #495272;
	}

	#walletInfo > span {
		padding: .6em 1em;
	}

	#network {
		border-right: 2px solid white;
	}

	#networkWarning {
		background-color: #D62839;
	}

	#address {
		border-left: 2px solid white;
	}

</style>