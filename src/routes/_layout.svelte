<script>

	// Imports:
	import { onMount } from 'svelte';
	import { stores } from '@sapper/app';
	
	// Initializations & Exports:
	const { session } = stores();
	export let segment;
	
	onMount(async () => {

		// JS Goes Here

	});

</script>

<!-- #################################################################################################### -->

<main><slot>{segment}</slot></main>

<!-- #################################################################################################### -->

<style>

	/* CSS Goes Here */

</style>