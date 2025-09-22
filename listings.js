import { createProfile } from './profile.js';

// Let's create a listing of pokemon, for each type 
// We receive as input all types of Pokemon including a list of its members 
const createListings = (pokemonTypes) => {

  // iterate over the list of pokemon types
  // filter out the ones that have no pokemon (e.g. "unknown", "shadow")
  pokemonTypes
    .filter(pokemonType => pokemonType.pokemon.length > 0)
    .forEach(pokemonType => {
      console.log(pokemonType)
      // add a section to the page to hold pokemon of this type
      const section = document.createElement('section')
      section.classList.add(pokemonType.name)
      // Iterate over the list of members for this type. 
      // Members live inside a nested "pokemon" array 
      pokemonType.pokemon
        .forEach(item => {
          // get the ID from the URL for this pokemon
          // e.g. 25 from https://pokeapi.co/api/v2/pokemon/25/
          const id = item.pokemon.url.split('/').filter(e => Number(e)).pop()
          // Skip any pokemon with an ID > 10000 
          // NOTE: these IDs are alternate forms that often lack images
          if (id > 10000) return
          // get a sprite icon directly from GitHub based on the ID  
          const iconURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
          // assign a unique ID to the popover accounting for pokemon having multiple types
          const popoverId = `${pokemonType.name}-${id}`
          // make a div / template for each listing. 
          const div = document.createElement('div')
          div.classList.add('listing')
          let template =
            `<img popovertarget="${popoverId}" src="${iconURL}" onError="this.src='pokeball.svg'"/> 
            <button class="open" popovertarget="${popoverId}" >${item.pokemon.name}</button>
            <div popover id="${popoverId}">
              <div class="profile">
                <p>Loading...</p>
              </div>
            </div>`
          div.innerHTML = DOMPurify.sanitize(template)
          div.querySelector(`#${popoverId}`)
            .addEventListener('toggle', async (event) => {
              if (event.newState == 'open') {
                event.target.innerHTML = await createProfile(popoverId, item.pokemon.url)
              }
            })
          section.appendChild(div)

        })
      document.querySelector('main').appendChild(section)

    })

}


export { createListings }

