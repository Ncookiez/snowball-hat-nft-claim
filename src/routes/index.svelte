<script>

	// Imports:
	import Wallet from '../components/Wallet.svelte';
	import Contract from '../components/Contract.svelte';
	import Form from '../components/Form.svelte';

	// Initializations:
	let connected;
	let formData;
	let unclaimedNFTs;

</script>

<!-- #################################################################################################### -->

<!-- Dynamic Svelte Header -->
<svelte:head>
	<title>Snowball | Hat NFT Claiming</title>
	<meta name="description" content="Claim your Snowball Hat NFTs here!">
</svelte:head>

<!-- Wallet Connection -->
<Wallet bind:connected={connected} />

<!-- Page Content -->
<div id="content">

	<!-- Introduction -->
	<h1>Claim your Snowball merch here!</h1>
	<p>We will need some information from you to know where to ship the merchandise to.</p>
	<p>We have no intention of invading the privacy of any of our community members, so any of this data will be deleted from our servers as soon as the relevant information is passed along to our partners helping us deliver this merch, <a href="https://www.husky.space/" target="_blank">Husky</a>.</p>
	<!-- <TODO> Update Claimed NFT Address -->
	<p>When claiming your merch, your <a href="https://snowtrace.io/token/0x9fF1918d212c435AD1F1734E9C4DC2DB835161Af" target="_blank">Snowball Hat NFT</a> will get converted into a <a href="https://snowtrace.io/token/0x9fF1918d212c435AD1F1734E9C4DC2DB835161Af" target="_blank">Claimed Snowball Hat NFT</a>, which comes with a whole different look and indicates you have claimed your swag!</p>

	<!-- Displaying User NFT Balance -->
	<span id="nftBalance">
		{#if connected}
			{#if unclaimedNFTs}
				{#if unclaimedNFTs === 1}
					<h2>You have an Snowball Hat NFT you can claim!</h2>
					<p>Simply fill the form below, approve and claim your new NFT along with your merch.</p>
				{:else if unclaimedNFTs > 1}
					<h2>You have {unclaimedNFTs} Snowball Hat NFTs you can claim!</h2>
					<p>Simply fill the form below, approve and claim your new NFT along with your merch.</p>
				{:else if unclaimedNFTs === 0}
					<h2>You don't have any Snowball Hat NFTs to claim.</h2>
					<p>Search for any to buy in any NFT marketplaces on Avalanche, or look forward to any of our new upcoming NFTs!</p>
				{/if}
			{/if}
		{:else}
			<h2>Connect your wallet on the top right to check if you have any Snowball Hat NFTs to claim!</h2>
		{/if}
	</span>

	<!-- User Info Form -->
	<Form bind:formData={formData} {unclaimedNFTs} />

	<!-- Contract Interaction -->
	<Contract bind:unclaimedNFTs={unclaimedNFTs} {connected} {formData} />

</div>

<!-- #################################################################################################### -->

<style>

	a {
		color: white;
	}

	#content {
		margin: 0 10%;
	}

	#nftBalance {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

</style>