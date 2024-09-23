// setup variables for important page elements
const nav = document.querySelector('nav')
const main = document.querySelector('main')

// fetch a simple list of all pokemon types (fighting, flying, etc.)
// This only includes the name and url for each.
fetch('https://pokeapi.co/api/v2/type/?limit=100')
  .then(data => data.json())
  .then(json => getDetailsForTypes(json.results))


// Let's get more details for each of the types of pokemon
// this will include a list of member pokemon for each type
// the function below receives as input the results from the previous fetch
const getDetailsForTypes = async (listOfTypes) => {
  console.log('List of Pokemon Types', listOfTypes)
  // fetch details for each type
  // note the use of Promise.all to fetch all at once
  const pokemonTypesWithDetails =
    await Promise.all(
      listOfTypes.map(async (pokemonType) => {
        const data = await fetch(pokemonType.url)
        return data.json()
      })
    )
  console.log('Pokemon Types with Details', pokemonTypesWithDetails)
  createNavigation(pokemonTypesWithDetails)
}

// Let's build a navigation menu for all types of pokemon 
// the function below receives as input the results from the previous fetch
const createNavigation = (pokemonTypes) => {
  // iterate over the list of pokemon types
  // filter out the ones that have no pokemon (e.g. "unknown", "shadow")
  pokemonTypes
    .filter(pokemonType => pokemonType.pokemon.length > 0)
    .forEach(pokemonType => {
      // make a button in the menu for this pokemon type
      const button = document.createElement('button')
      button.className = pokemonType.name
      button.innerHTML = pokemonType.name
      // when the button is clicked, show pokemon listings for this type
      // use the ".active" CSS class to show / hide pokemon
      button.addEventListener('click', () => {
        document.querySelectorAll(`section`)
          .forEach(el => el.classList.remove('active'))
        document.querySelectorAll(`section.${pokemonType.name}`)
          .forEach(el => el.classList.add('active'))
      })
      nav.appendChild(button)
      createListings(pokemonType)
    })
}

// Let's create a listing of pokemon, for each type 
// We receive as input, ONE Type of Pokemon including a list of its members 
const createListings = (pokemonType) => {
  // add a section to the page to hold pokemon of this type
  const section = document.createElement('section')
  section.classList.add(pokemonType.name)
  // Iterate over the list of members for this type. 
  // Members live inside a nested "pokemon" array 
  pokemonType.pokemon.forEach(item => {
    // get a sprite icon for each listing
    const iconURL = getListingIconURL(item.pokemon)
    // make a div / template for each listing. 
    const div = document.createElement('div')
    div.classList.add('listing')
    div.id = item.pokemon.name
    div.innerHTML = `
      <img src="${iconURL}" onError="this.src='pokeball.svg'"/> 
      <button class="open">${item.pokemon.name}</button>
      <div popover>
        <div class="profile">
          <p>Loading...</p>
        </div>
      </div>`
    const popover = div.querySelector(`div[popover]`)
    div.querySelector(`button.open`)
      .addEventListener('click', async () => {
        popover.togglePopover()
        const div = await createProfile(item.pokemon.url)
        popover.querySelector(`.profile`).replaceWith(div)
      })
    section.appendChild(div)
  })
  main.appendChild(section)
}

// Given the URL for a single pokemon, fetch details from the API
// and build a profile for the pokemon. 
// this includes a template populated with details 
// it also includes a close button.
const createProfile = async (url) => {
  const data = await fetch(url)
  const pokemon = await data.json()
  console.log('Pokemon Details', pokemon)
  const imageURL = getProfileImageURL(pokemon)
  // build a template to hold details for this pokemon 
  const template = `
  
  
    <button class="close">Close</button>
  <div class="details"> 
  
    <img src="${imageURL}" onError="this.src='pokeball.svg'"/>
    <div class="characteristics"> 
      <h2>${pokemon.name}</h2>
      <h3>
        <img src="pokeball.svg" style="width:16px;">
        ${pokemon.types.map(t => `<span>${t.type.name}</span>`).join('<i> / </i>')}
      </h3>

      <fieldset>
        <label>Height</label>
        <meter value="${pokemon.height / 10}" min="0" max="10"></meter>
        <label>${pokemon.height / 10}m</label>
      </fieldset>

      <fieldset>
        <label>Weight</label>
        <meter value="${pokemon.weight / 10}" min="0" max="500"></meter>
        <label>${pokemon.weight / 10}kg</label> 
      </fieldset>

      <p>Abilities: ${pokemon.abilities.map(a => a.ability.name).join(', ')}</p> 
    </div>
    


  </div> 
  <div class="stats">
      ${pokemon.stats.map(stat => `
        <div class="stat">
          <div class="base-stat">${stat.base_stat}</div>
          <div class="stat-name">${stat.stat.name}</div> 
        </div>
      `).join(' ')}
    </div>
    

  `
  // create a container div for the template
  // and also activate the close button
  const div = document.createElement('div')
  div.classList.add('profile')
  div.innerHTML = template
  div.querySelector(`button.close`)
    .addEventListener('click', async () => {
      document.querySelector(`#${pokemon.name} [popover]`).togglePopover()
    })
  // return the div to be inserted into the popover
  return div
}


// Let's generate a sprite icon for a given pokemon.
// We can generate a GitHub URL for this by extracting the ID from the original URL 
// Pokemon URL is in the form of https://pokeapi.co/api/v2/pokemon/:ID/
// Split URL by '/' , filter out non-numbers, and "pop" off the last element.
// We can then assemble a sprite icon URL from github, using the extracted ID 
// NOTE: you could also get the URL by fetching the pokemon details 
// but this is a more efficient way to get the sprite icon without running an extra fetch
const getListingIconURL = (pokemon) => {
  const id = pokemon.url.split('/').filter(e => Number(e)).pop()
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}

// For the Full profile, we may like to control which image to show
// there are lots of images available. (take a look at the JSON in the console for details)
// I will use the "dream_world" image here by default as it is a nice SVG 
// if not available we will use in order: home, official, or just the ordinary pokeball.
const getProfileImageURL = (pokemon) => {
  const dream_world = pokemon.sprites?.other?.['dream_world']?.front_default
  const home = pokemon.sprites?.other?.['home']?.front_default
  const official = pokemon.sprites?.other?.['official-artwork']?.front_default
  return dream_world || home || official || 'pokeball.svg'
}
