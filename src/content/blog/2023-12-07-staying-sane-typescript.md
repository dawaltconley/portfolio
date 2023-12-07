Some rules to make my code less terrible.

None of this is revolutionary. Some of these are other people's rules and I've 
forgotten where I've gotten them. I'm just writing them out as a way to 
reaffirm / commit myself to them.

## Sometimes-pure functions

I am not a purist about functions, and often JavaScript won't let you be one 
anyway (have fun updating the DOM with pure functions!). My rule here is that 
you should be able to tell, while typing out a function, whether it has side 
effects or not.  One way to do this is with a standard prefix for side effects 
(`callSomething`, `mutateSomething`), but with Typescript you can also do this 
using the return value.

The basic rule is that a function can _only_ have side effects if it doesn't 
return anything. That impure functions cannot return anything. Typescript lets 
you enforce this with by requiring that your function return void:

```typescript
function changeStuff(input: Input): void {
    /* has side effects */
}

function getStuff(input: Input): Stuff {
    /* no side effects */
}
```

This allows you to tell by looking at any given function (or using 
intellisense) whether it has side effects or not. It also forces you to write 
functions with side-effects on their own line:

```typescript
const stuff = getStuff(input)
changeStuff(input) // unless this has a side effect, it's not doing anything
```

This rule can be tweaked for class methods to allow for two different kinds of 
side-effects: methods that mutate the internal state (modify instance 
properties) should return `this`, while any methods with external side effects 
should return `void`.

```typescript
class StuffManager {
    get(): Stuff {
        /* no side effects */
    }

    update(input: Input): StuffManager {
        /* changes something internal */
        return this
    }

    render(): void {
        /* changes something external */
    }
}
```

This matches my intuition about method chaining versus separate calls:

```
// piping state through a series of transformations
const image = sharp('foo.jpeg')
    .rotate()
    .resize()

// discrete side-effect actions
xmlRequest.send()
```

It's probably generally better for a method like `update` to return a new class 
instance with modified state, but this depends on what you're doing.  
Unfortunately, intellisense won't easily distinguish between the two.
