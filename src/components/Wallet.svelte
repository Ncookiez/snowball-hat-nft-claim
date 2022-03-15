<script>

	// Imports:
	import { onMount } from 'svelte';

	// Initializations & Exports:
	export let connected;
	let wallets = [];
	let chainID = '';
	let account = '';
	let chains = {
		'0x1': 'Ethereum',
		'0x38': 'BSC',
		'0x89': 'Polygon',
		'0xfa': 'Fantom',
		'0xa86a': 'Avalanche',
		'0x63564c40': 'Harmony'
	}

	// Function to connect to MetaMask:
	const connect = async () => {
		if(typeof window.ethereum !== 'undefined') {
			try {
				chainID = await ethereum.request({ method: 'eth_chainId' });
				account = (await ethereum.request({ method: 'eth_requestAccounts' }))[0];
				if(chainID !== '' && account !== '') {
				if(!wallets.includes(account)) {
					wallets.push(account);
					localStorage.wallets = JSON.stringify(wallets);
				}
				connected = true;
			}
			} catch {
				console.error('Something went wrong while connecting to MetaMask.');
			}
		}
	}

	// Function to handle network changes:
	const handleNetworkChange = () => {
		window.location.reload();
	}
  
	onMount(async () => {

		// Fetching wallets from local storage:
		if(localStorage.getItem('wallets') === null) {
			localStorage.setItem('wallets', JSON.stringify([]));
		} else {
			wallets = JSON.parse(localStorage.wallets);
		}

		// Connecting automatically:
		if(wallets.length > 0) {
			connect();
		}

		// Handling network changes:
		ethereum.on('chainChanged', handleNetworkChange);

	});

</script>

<!-- #################################################################################################### -->

{#if account === ''}

	<!-- MetaMask Connection Button -->
	<button on:click={() => connect()}>Connect Your Wallet</button>

{:else}

	<!-- Displaying Connected Network -->
	<span>{chains[chainID] ? chains[chainID] : 'Unidentified Network'}</span>

	<!-- Displaying Network Error Message -->
	{#if chainID !== '0xa86a'}
		<span>Please connect to Avalanche C-Chain</span>
	{/if}

	<!-- Displaying Connected Wallet -->
	<span>{account.slice(0, 6)}...{account.slice(-4)}</span>

{/if}

<!-- #################################################################################################### -->

<style>

	/* CSS Goes Here */

</style>