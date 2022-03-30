<script>

	// Imports:
	import { onMount } from 'svelte';

	// Initializations & Exports:
	export let formData = {
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		landline: '',
		country: '',
		state: '',
		city: '',
		street: '',
		building: '',
		floor: '',
		zipCode: '',
		valid: false
	}
	export let unclaimedNFTs;
	export let apiStatus;
	let countries;
	let highlightInput = '';

	// Form Validation Regex:
	let charFilter = /^[a-zA-Z0-9\-,\. ]+$/;
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
							if(formData.landline == '' || numFilter.test(formData.landline)) {
								if(formData.country != '') {
									if(formData.state != '') {
										if(formData.city != '') {
											if(formData.street != '' && charFilter.test(formData.street)) {
												if(formData.building == '' || charFilter.test(formData.building)) {
													if(formData.floor == '' || charFilter.test(formData.floor)) {
														if(formData.zipCode != '' && charFilter.test(formData.zipCode)) {
															highlightInput = '';
															formData.valid = true;
															return true;
														} else {
															highlightInput = 'zipCode';
														}
													} else {
														highlightInput = 'floor';
													}
												} else {
													highlightInput = 'building';
												}
											} else {
												highlightInput = 'street';
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
								highlightInput = 'landline';
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

{#if unclaimedNFTs > 0 && apiStatus}
	<div id="form">

		<!-- First Name -->
		<span>
			<label for="firstName">First Name:</label>
			<input type="text" id="firstName" bind:value={formData.firstName} placeholder="first name" class:warn="{highlightInput == 'firstName'}">
		</span>

		<!-- Last Name -->
		<span>
			<label for="lastName">Last Name:</label>
			<input type="text" id="lastName" bind:value={formData.lastName} placeholder="last name" class:warn="{highlightInput == 'lastName'}">
		</span>

		<!-- Email -->
		<span>
			<label for="email">Email:</label>
			<input type="email" id="email" bind:value={formData.email} placeholder="email" class:warn="{highlightInput == 'email'}">
		</span>

		<!-- Phone Number -->
		<span>
			<label for="phone">Phone Number:</label>
			<input type="tel" id="phone" bind:value={formData.phone} placeholder="phone number" class:warn="{highlightInput == 'phone'}">
		</span>

		<!-- Landline Number -->
		<span>
			<label for="landline">Landline Number:</label>
			<input type="tel" id="landline" bind:value={formData.landline} placeholder="landline number" class:warn="{highlightInput == 'landline'}">
		</span>

		<!-- Country -->
		<span>
			<label for="country">Country:</label>
			<select id="country" bind:value={formData.country} on:change={() => { formData.state = ''; formData.city = ''; }} class:warn="{highlightInput == 'country'}">
				<option value="" disabled selected>country</option>
				{#if countries}
					{#each countries as country}
						<option value={country}>{country.name}</option>
					{/each}
				{/if}
			</select>
		</span>

		<!-- State/Province -->
		<span>
			<label for="state">State/Province:</label>
			<select id="state" bind:value={formData.state} on:change={() => { formData.city = ''; }} class:warn="{highlightInput == 'state'}">
				<option value="" disabled selected>state/province</option>
				{#if formData.country}
					{#each states as state}
						<option value={state}>{state.name}</option>
					{/each}
				{/if}
			</select>
		</span>

		<!-- City -->
		<span>
			<label for="city">City:</label>
			<select id="city" bind:value={formData.city} class:warn="{highlightInput == 'city'}">
				<option value="" disabled selected>city</option>
				{#if formData.state}
					{#each cities as city}
						<option value={city}>{city.name}</option>
					{/each}
				{/if}
			</select>
		</span>

		<!-- Street w/ Number -->
		<span>
			<label for="street">Street w/ Number:</label>
			<input type="text" id="street" bind:value={formData.street} placeholder="street w/ number" class:warn="{highlightInput == 'street'}">
		</span>

		<!-- Building -->
		<span>
			<label for="building">Building:</label>
			<input type="text" id="building" bind:value={formData.building} placeholder="building" class:warn="{highlightInput == 'building'}">
		</span>

		<!-- Floor/Staircase -->
		<span>
			<label for="floor">Floor/Staircase:</label>
			<input type="text" id="floor" bind:value={formData.floor} placeholder="floor/staircase" class:warn="{highlightInput == 'floor'}">
		</span>

		<!-- Zip/Postal Code -->
		<span>
			<label for="zipCode">Zip/Postal Code:</label>
			<input type="text" id="zipCode" bind:value={formData.zipCode} placeholder="zip/postal Code" class:warn="{highlightInput == 'zipCode'}">
		</span>
	</div>
{:else if !apiStatus}
	<p>Our servers are having some issues. Please check back in a little while to claim your NFTs.</p>
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

	#form > span {
		display: flex;
		justify-content: space-between;
		width: 100%;
		margin: .4em 0;
		border-radius: 1em;
		background-color: white;
	}

	#form > span > label {
		min-width: 16ch;
		padding: .4em 1em;
		text-align: left;
		color: black;
		font-size: .8em;
	}

	#form > span > input, #form > span > select {
		width: 100%;
		padding: .4em 1em;
		outline: none;
		border: none;
		text-align: center;
		color: black;
		background-color: transparent;
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

		#form > span > label {
			display: none;
		}
	}

</style>