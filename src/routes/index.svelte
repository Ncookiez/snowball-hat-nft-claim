<script>

	// Imports:
	import { onMount } from 'svelte';
	// import { stores, goto } from '@sapper/app';
	import Wallet from '../components/Wallet.svelte';
	import Contract from '../components/Contract.svelte';

	// Initializations:
	// const { session } = stores();
	let connected = false;

	onMount(async () => {

		// JS Goes Here

	});

</script>

<!-- #################################################################################################### -->

<!-- Dynamic Svelte Header -->
<svelte:head>
	<title>Snowball | Hat NFT Claiming</title>
	<meta name="description" content="Claim your Snowball Hat NFTs here!">
</svelte:head>

<!-- Wallet Connection -->
<Wallet bind:connected={connected} />

<!-- Contract Interaction -->
<Contract {connected} />

<!-- #################################################################################################### -->

<style>

	/* CSS Goes Here */

</style>