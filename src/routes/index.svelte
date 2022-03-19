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

	<!-- Title -->
	<h1>Claim your merch here!</h1>

	<!-- Claiming Steps -->
	<div id="steps">
		<h3>Steps:</h3>
		<p>1. Connect to your wallet.</p>
		<p>2. Fill out the required shipping information.</p>
		<p>3. Approve the transaction through your wallet.</p>
		<p>4. Claim your new NFT and holiday hat!</p>
	</div>

	<!-- Disclaimer -->
	<div id="disclaimer">
		<h3>Disclaimer:</h3>
		<p>We have no intention of invading the privacy of any of our community members. All data collected will be deleted from our servers after the relevant information is passed along to <a href="https://www.husky.space/" target="_blank">Husky</a>.</p>
	</div>

	<!-- Extra Info -->
	<div id="info">
		<!-- <TODO> Update Claimed NFT Address -->
		<p>When claiming your merchandise, your <a href="https://snowtrace.io/token/0x9fF1918d212c435AD1F1734E9C4DC2DB835161Af" target="_blank">Snowball Hat NFT</a> will be converted into a <a href="https://snowtrace.io/token/0x9fF1918d212c435AD1F1734E9C4DC2DB835161Af" target="_blank">Claimed Snowball Hat NFT</a>, which comes with a new look and indicates you have claimed your swag!</p>
	</div>

	<!-- Claiming Form -->
	{#if connected}
		<div id="claiming">

			<!-- Snowball Image -->
			<!-- <TODO> Replace with actual image -->
			<img src="favicon.svg" alt="Snowball NFT">

			<!-- Displaying User NFT Balance -->
			{#if unclaimedNFTs}
				{#if unclaimedNFTs === 1}
					<h2>You have an NFT to claim!</h2>
					<p>Please fill out all required information below:</p>
				{:else if unclaimedNFTs > 1}
					<h2>You have {unclaimedNFTs} NFTs to claim!</h2>
					<p>Please fill out all required information below:</p>
				{:else if unclaimedNFTs === 0}
					<h2>You don't have any NFTs to claim.</h2>
					<p>Search for any to buy in any NFT marketplaces on Avalanche, or look forward to any of our new upcoming NFTs!</p>
				{/if}
			{:else}
				<h2>Searching for NFTs...</h2>
			{/if}
		
			<!-- User Info Form -->
			<Form bind:formData={formData} {unclaimedNFTs} />
		
			<!-- Contract Interaction -->
			<Contract bind:unclaimedNFTs={unclaimedNFTs} {connected} {formData} />

		</div>
	{/if}
</div>

<!-- Footer -->
<div id="footer"></div>

<!-- #################################################################################################### -->

<style>

	h1, h2, h3, p, a {
		color: white;
		margin: 0;
	}

	#content, #content > div {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	#content {
		margin: 0 10%;
		padding: 3em;
		border-radius: .6em;
		background-color: #101832;
	}

	#content > h1 {
		text-align: center;
		font-size: 64px;
	}

	#content > div {
		margin: 1em;
	}

	#content > div > p {
		line-height: 1.5em;
	}

	#disclaimer, #info {
		width: 50%;
	}

	#claiming {
		width: 75%;
		padding: 3em;
		border: 2px solid #47C2FF;
		border-radius: .6em;
	}

	#claiming > img {
		width: 10em;
		margin-bottom: 1em;
	}

	#claiming > h2 {
		font-size: 42px;
	}

	#footer {
		height: 5em;
	}

</style>