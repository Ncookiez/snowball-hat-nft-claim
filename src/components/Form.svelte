<script>

	// Imports:
	import { onMount } from 'svelte';

	// Initializations & Exports:
	export let formData = {
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		country: '',
		state: '',
		city: '',
		address_1: '',
		address_2: '',
		zipCode: '',
		valid: false
	}
	export let unclaimedNFTs;
	let countries;
	let highlightInput = '';

	// Form Validation Regex:
	let charFilter = /^[a-zA-Z0-9\-\. ]+$/;
	let letterFilter = /^[a-zA-Z\-\. ]+$/;
	let numFilter = /^[0-9\+\-\. ]+$/;
	let emailFilter = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

	// Reactive Variables:
	$: validateForm(formData);
	$: states = getStates(formData.country);
	$: cities = getCities(formData.state);

	// Function to validate all form data:
	const validateForm = () => {
		if(formData.firstName != '') {
			if(letterFilter.test(formData.firstName)) {
				if(formData.lastNameName != '' && letterFilter.test(formData.lastName)) {
					if(formData.email != '' && emailFilter.test(formData.email)) {
						if(formData.phone != '' && numFilter.test(formData.phone) && formData.phone.length > 6) {
							if(formData.country != '') {
								if(formData.state != '') {
									if(formData.city != '') {
										if(formData.address_1 != '' && charFilter.test(formData.address_1)) {
											if(formData.address_2 == '' || charFilter.test(formData.address_2)) {
												if(formData.zipCode != '' && charFilter.test(formData.zipCode)) {
													formData.valid = true;
													highlightInput = '';
													return true;
												} else {
													highlightInput = 'zipCode';
												}
											} else {
												highlightInput = 'address_2';
											}
										} else {
											highlightInput = 'address_1';
										}
									} else {
										highlightInput = 'city';
									}
								} else {
									highlightInput = 'state';
								}
							} else {
								highlightInput = 'country';
							}
						} else {
							highlightInput = 'phone';
						}
					} else {
						highlightInput = 'email';
					}
				} else {
					highlightInput = 'lastName';
				}
			} else {
				highlightInput = 'firstName';
			}
		} else {
			highlightInput = '';
		}
		formData.valid = false;
		return false;
	}

	// Function to get states for selected country:
	const getStates = () => {
		if(formData.country !== '') {
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
		if(formData.state !== '') {
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
		countries = (await (await fetch('https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries%2Bstates%2Bcities.json')).json()).filter(country => country.states.length > 0);

	});

</script>

<!-- #################################################################################################### -->

{#if unclaimedNFTs > 0}
	<div id="form">

		<!-- Name -->
		<input type="text" bind:value={formData.firstName} placeholder="first name" class:warn="{highlightInput == 'firstName'}">
		<input type="text" bind:value={formData.lastName} placeholder="last name" class:warn="{highlightInput == 'lastName'}">

		<!-- Email -->
		<input type="email" bind:value={formData.email} placeholder="email" class:warn="{highlightInput == 'email'}">

		<!-- Phone Number -->
		<input type="tel" bind:value={formData.phone} placeholder="phone number" class:warn="{highlightInput == 'phone'}">

		<!-- Location -->
		<select bind:value={formData.country} on:change={() => { formData.state = ''; formData.city = ''; }} class:warn="{highlightInput == 'country'}">
			<option value="" disabled selected>country</option>
			{#if countries}
				{#each countries as country}
					<option value={country}>{country.name}</option>
				{/each}
			{/if}
		</select>
		<select bind:value={formData.state} on:change={() => { formData.city = ''; }} class:warn="{highlightInput == 'state'}">
			<option value="" disabled selected>state/province</option>
			{#if formData.country}
				{#each states as state}
					<option value={state}>{state.name}</option>
				{/each}
			{/if}
		</select>
		<select bind:value={formData.city} class:warn="{highlightInput == 'city'}">
			<option value="" disabled selected>city</option>
			{#if formData.state}
				{#each cities as city}
					<option value={city}>{city.name}</option>
				{/each}
			{/if}
		</select>

		<!-- Address -->
		<input type="text" bind:value={formData.address_1} placeholder="address line 1" class:warn="{highlightInput == 'address_1'}">
		<input type="text" bind:value={formData.address_2} placeholder="address line 2" class:warn="{highlightInput == 'address_2'}">
		<input type="text" bind:value={formData.zipCode} placeholder="zip/postal Code" class:warn="{highlightInput == 'zipCode'}">
	</div>
{/if}

<!-- #################################################################################################### -->

<style>

	#form {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 50%;
		padding: 1em 0;
	}

	#form > input, #form > select {
		width: 100%;
		margin: .4em 0;
		padding: .4em 0;
		border: none;
		border-radius: 1em;
		color: black;
		background-color: white;
		text-align: center;
		white-space: nowrap;
	}

	.warn {
		outline: 2px solid #D62839;
	}

	::placeholder {
		color: black;
	}

	/* Mobile CSS */
	@media only screen and (max-width: 625px) {
		
		#form {
			width: 100%;
		}
	}

</style>