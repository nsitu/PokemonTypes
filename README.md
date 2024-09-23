# Pokemon Types
[![Open in Coder](https://ixdcoder.com/open-in-coder.svg)](https://ixdcoder.com/templates/Static/workspace?name=Pokemon&mode=auto&param.git_repo=https://bender.sheridanc.on.ca/system-design/pokemon)

## Context
This demo illustrates how we can make multiple fetches on one page. We first fetch a list of pokemon types, followed by details for each. We then populate listings, such that each pokemon is connected to an individual fetch for details, which in turn are shown in a popover. This pattern may be referred to as a `pipeline`, since the output of one function becomes the input for the next. Data fetched from the [PokeAPI](https://pokeapi.co)