<script>

	// Imports:
	import Wallet from '../components/Wallet.svelte';
	import Contract from '../components/Contract.svelte';

	// Initializations:
	let connected = false;

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