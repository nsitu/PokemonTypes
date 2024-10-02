# Pokemon Types
[![Open in Coder](https://ixdcoder.com/open-in-coder.svg)](https://ixdcoder.com/templates/Static/workspace?name=Pokemon&mode=auto&param.git_repo=https://bender.sheridanc.on.ca/system-design/pokemon&param.code_template=custom)

## Context
This demo illustrates how we can make multiple fetches on one page. We first fetch a list of pokemon types, followed by details for each. We then populate listings, such that each pokemon is connected to an individual fetch for details, which in turn are shown in a popover. This pattern may be referred to as a `pipeline`, since the output of one function becomes the input for the next. Data fetched from the [PokeAPI](https://pokeapi.co)

## Learning Prompts

### Promises in JavaScript
When using fetch, we often have to wait for the network to respond. In JavaScript, we can use `Promises` to account for this waiting. Notably, the `fetch()` function returns a `Promise`. To handle this, one may use `async / await` syntax, but it's also possible to use `.then()` syntax to accomplish a similar goal. 
- Can you compare these two ways of handling Promises in this Pokemon example? 
- What are some of the pros and cons of each?
- Can you work out how Promises are handled when there are multiple fetches happening at the same time?

### Templates within Templates
If you have an array of elements nested inside an object, you may like to iterate over each one so that it has its own distinct treatment, within the larger context. 
- Can you find a place in this Pokemon example where nested templates are used? 
- What is the relevance of the `.map()` Array function in JavaScript when it comes to nested templates?
- What is the relevance of the `.join()` Array function in JavaScript here?

### Building layouts
In this example the layout may appear differently on Mobile compared to on Desktop.
- How can you use media queries to make layouts more responsive?
- How do you know when to use CSS Grid, vs CSS Flexbox?

