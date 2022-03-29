<script>

	// Initializations & Exports:
	export let formSubmission;
	let dismissed = false;

</script>

<!-- #################################################################################################### -->

{#if !dismissed}

	<!-- Blurred Backdrop -->
	<div id="backdrop" class:clickable="{formSubmission.valid}" on:click={() => { if(formSubmission.valid) { dismissed = true }}}></div>

	<!-- Submission Results Popup -->
	<div id="popup">
		{#if formSubmission.valid}
			<h2>You've successfully claimed your NFT!</h2>
			<p>Once our partners have the merch ready, they'll promptly send the beanie to the address you've specified.</p>
			<p>If you have more NFTs to claim, feel free to re-use the 'Claim NFT' button.</p>
			<p>Click or tap anywhere outside this popup to dismiss it.</p>
		{:else}
			<h2>There was an error while claiming your NFT.</h2>
			<p>This likely means you have minted your new NFT, but your data for merch delivery hasn't been sent to our secure server.</p>
			<p>Please reach out to our team as soon as possible and show us the following info as proof of your mint:</p>
			<input type="text" on:focus="{event => event.target.select()}" value="{JSON.stringify(formSubmission.request.data)}">
		{/if}
	</div>
{/if}


<!-- #################################################################################################### -->

<style>

	h2, p, input {
		margin-left: 1em;
		margin-right: 1em;
	}

	#backdrop {
		position: fixed;
		height: 100vh;
		width: 100vw;
		backdrop-filter: brightness(.3) blur(3px);
	}

	#popup {
		position: fixed;
		display: flex;
		flex-direction: column;
		justify-content: center;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		max-width: 60vw;
		padding: 1em;
		text-align: center;
		border-radius: 1em;
		background-color: #1E2644;
	}

	.clickable {
		cursor: pointer;
	}

</style>