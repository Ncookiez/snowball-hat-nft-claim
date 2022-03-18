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
											if(formData.address_2 != '' && charFilter.test(formData.address_2)) {
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
		countries = await (await fetch('https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries%2Bstates%2Bcities.json')).json();

	});

</script>

<!-- #################################################################################################### -->

{#if unclaimedNFTs > 0}

	<div id="form">

		<!-- Name -->
		<span>
			<label for="firstName">First Name</label>
			<input type="text" id="firstName" bind:value={formData.firstName} placeholder="First Name" class:warn="{highlightInput == 'firstName'}">
		</span>
		<span>
			<label for="lastName">Last Name</label>
			<input type="text" id="lastName" bind:value={formData.lastName} placeholder="Last Name" class:warn="{highlightInput == 'lastName'}">
		</span>

		<!-- Email -->
		<span>
			<label for="email">Email</label>
			<input type="email" id="email" bind:value={formData.email} placeholder="Email" class:warn="{highlightInput == 'email'}">
		</span>

		<!-- Phone Number -->
		<span>
			<label for="phone">Phone Number</label>
			<input type="tel" id="phone" bind:value={formData.phone} placeholder="12-3456-7890" class:warn="{highlightInput == 'phone'}">
		</span>

		<!-- Country -->
		<span>
			<label for="country">Country</label>
			<select id="country" bind:value={formData.country} on:change={() => { formData.state = ''; formData.city = ''; }} class:warn="{highlightInput == 'country'}">
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
			<select id="state" bind:value={formData.state} on:change={() => { formData.city = ''; }} class:warn="{highlightInput == 'state'}">
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
			<select id="city" bind:value={formData.city} class:warn="{highlightInput == 'city'}">
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
			<input type="text" id="address_1" bind:value={formData.address_1} placeholder="Address Line 1" class:warn="{highlightInput == 'address_1'}">
		</span>
		<span>
			<label for="address_2">Address Line 2</label>
			<input type="text" id="address_2" bind:value={formData.address_2} placeholder="Address Line 2" class:warn="{highlightInput == 'address_2'}">
		</span>
		<span>
			<label for="zipCode">Zip/Postal Code</label>
			<input type="text" id="zipCode" bind:value={formData.zipCode} placeholder="Zip/Postal Code" class:warn="{highlightInput == 'zipCode'}">
		</span>
	</div>

{/if}

<!-- #################################################################################################### -->

<style>

	span {
		display: flex;
	}

	.warn {
		outline: 2px solid red;
	}

</style>