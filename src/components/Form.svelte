<script>

	// Imports:
	import { onMount } from 'svelte';

	// Initializations & Exports:
	export let formData = {
		firstName: '',
		lastName: '',
		email: '',
		country: '',
		state: '',
		city: '',
		address_1: '',
		address_2: '',
		zipCode: '',
		phone: '',
		valid: false
	}
	let countries;

	// Reactive Variables:
	$: validateForm(formData);
	$: states = getStates(formData.country);
	$: cities = getCities(formData.state);

	// Function to validate all form data:
	const validateForm = () => {
		// <TODO>
		// if(formData.firstName !== '') {
		// 	formData.valid = true;
		// } else if(formData.valid) {
		// 	formData.valid = false;
		// }
	}

	// Function to get states for selected country:
	const getStates = () => {
		if(formData.country) {
			let foundCountry = countries.find(i => i.id === formData.country.id);
			if(foundCountry) {
				return foundCountry.states;
			} else {
				return [];
			}
		}
	}

	// Function to get cities for selected state:
	const getCities = () => {
		if(formData.state) {
			let foundState = states.find(i => i.id === formData.state.id);
			if(foundState) {
				return foundState.cities;
			} else {
				return [];
			}
		}
	}

	onMount(async () => {

		// Fetching list of countries, states & cities:
		countries = await (await fetch('https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries%2Bstates%2Bcities.json')).json();

	});

</script>

<!-- #################################################################################################### -->

	<!-- Name -->
	<span>
		<label for="firstName">First Name</label>
		<input type="text" id="firstName" bind:value={formData.firstName} placeholder="First Name">
	</span>
	<span>
		<label for="lastName">Last Name</label>
		<input type="text" id="lastName" bind:value={formData.lastName} placeholder="Last Name">
	</span>

	<!-- Email -->
	<span>
		<label for="email">Email</label>
		<input type="email" id="email" bind:value={formData.email} placeholder="Email">
	</span>

	<!-- Phone Number -->
	<span>
		<label for="phone">Phone Number</label>
		<input type="tel" id="phone" bind:value={formData.phone} placeholder="12-3456-7890">
	</span>

	<!-- Country -->
	<span>
		<label for="country">Country</label>
		<select id="country" bind:value={formData.country} on:change={() => { formData.state = undefined; formData.city = undefined; }}>
			{#if countries}
				{#each countries as country}
					<option value={country}>{country.name}</option>
				{/each}
			{/if}
		</select>
	</span>

	<!-- State -->
	<span>
		<label for="state">State/Province</label>
		<select id="state" bind:value={formData.state} on:change={() => { formData.city = undefined; }}>
			{#if formData.country}
				{#each states as state}
					<option value={state}>{state.name}</option>
				{/each}
			{/if}
		</select>
	</span>

	<!-- City -->
	<span>
		<label for="city">City</label>
		<select id="city" bind:value={formData.city}>
			{#if formData.state}
				{#each cities as city}
					<option value={city}>{city.name}</option>
				{/each}
			{/if}
		</select>
	</span>

	<!-- Address -->
	<span>
		<label for="address_1">Address Line 1</label>
		<input type="text" id="address_1" bind:value={formData.address_1} placeholder="Address Line 1">
	</span>
	<span>
		<label for="address_2">Address Line 2</label>
		<input type="text" id="address_2" bind:value={formData.address_2} placeholder="Address Line 2">
	</span>
	<span>
		<label for="zipCode">Zip/Postal Code</label>
		<input type="text" id="zipCode" bind:value={formData.zipCode} placeholder="Zip/Postal Code">
	</span>

<!-- #################################################################################################### -->

<style>

	span {
		display: flex;
	}

</style>