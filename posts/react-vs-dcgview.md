---
title: React vs DCGView
draft: true
shortUrl: react-vs-dcgview
---

# Conceptual Complexity

DCGView is ~2000 lines of javascript total. That’s something you could read in an hour and understand in its entirety. The simplicity makes performance predictable and easy to debug. The compact size means less than a few KB in network bandwidth.

React is enormous and incredibly complex under the hood. This leads to many unexpected performance issues and need for optimizations which make for leaky abstractions.

New devs coming into our system have to learn DCGView, and we are relying on internal know-how, docs and examples to get them up to speed.

Besides just DCGView, we have an ecosystem of surrounding technologies:

- touchtracking to unify mouse and touch events
- i18n wrappers and eslint rules for ftl
- router / navigation controllers to perform routing
- AsyncWrapper and similar tooling for code splitting
We’ve built replacements for some of these while others still need to be solved.

## DCGView template / bind update split

DCGView has some inherent complexity because the template function is only executed once at the initial render of the component. Subsequent updates will only run the bindings that are created during the initial render. This means that all props must be functions (that can be invoked by the binding to re-evaluate itself). It also means that the developer has to keep this in mind while writing the template code. Some examples…



In this example props.a is only evaluated during the initial render, and does not create any bindings:

```typescript
class View ...
template() {
  if (props.a) { // WRONG! Will not be re-evaluated on update!
    return <div>one</div>
  } else {
	  return <div>two</div>
  }
}
}

class View2 ...
template() {
  return <div>{props.a ? "one" : "two"}</div> // WRONG! Will not be re-evaluated on update!
}
}
```

because of this we have to rely on DCGView components like <If>, <Switch>, etc… which create a binding that re-evaluates `props.a` on every update. This adds conceptual overhead and also prevents the use of conventional control flow like conditionals, switch statements. Furthermore it works against the typescript type system, and we have to use things like `ForEach`, `IfDefined` or `SwitchUnion` to help type information flow through the views in the most common instances.

The template/binding distinction is also a source of an extremely common bug that developers have to be aware of:

```typescript
class View ...
template() {
  const derived = transform(props.a()); // WRONG! derived will not be re-evaluated!
  return <div>{derived}</div>
}
```

Similar to the conditional before, transform here will only be applied at the initial render, and will not be re-evaluated for each update! The correct code for this looks like:

```typescript
class View ...
template() {
  const derivedProp = () => transform(props.a());
  return <div>{derivedProp}</div> // correct - transform will be re-evaluated on every update
}
```

This is quite clumsy and adds mental overhead, though we do have linting rules that prevent the most obvious instances of this mistake.

## React functional components and diffing / reconciliation

See [this](https://react.dev/reference/rules/react-calls-components-and-hooks#never-call-component-functions-directly) for more details.

On first glance, React has a much simpler conceptual model, especially the modern version which encourages the use of functional components.

```typescript
function view = (props: Props) => JSX
```

This view function is re-evaluated on every update. The resulting virtual dom is then diffed against the virtual dom representing what is was previously rendered. This results in a set of updates that are then applied to the DOM.

The problem arises with the fact that we often want to hang on to DOM between renders. For example:

```typescript
view(props) { // oversimplified example
  if (props.a) {
    return <input />
  } else {
    return <div />
  }
}
```

If interacting with this input caused an action to be dispatched and an update to happen, you’d often end up in a situation where the input would lose the typed text, or lose focus. (see [link](https://stackoverflow.com/search?q=react%20focus%20typing&s=650e5920-cd52-4696-aa54-11799ff32afb) for many, many examples of folks running into this sort of issue)

This is because react creates a brand new `<input>` VDOM whenever the view updates. The diffing algorithm doesn’t know if you intend to keep the same input rendered, or create a new input, and there are many things that can cause it to replace the existing element with a new one.

During diffing (what React often refers to as reconciliation), React really wants to avoid traversing sub-trees to see if a given node is the same or different. Because of this, it often relies on keys and component identity to short-circuit this process. If you don’t use these correctly, React may end up re-mounting the element on every update. This can cause problems with things that need to be persistent (like input losing focus), and can also cause performance problems.

So one strategy here would be to provide a key to the input:

```typescript
...
return <input key="my-input" />
```

However, this doesn’t always work since a decision to remount can happen anywhere upstream of the keyed component. Another example:

```typescript
view(props) {
  const helper = () => <input key="my-input"/> // oversimplified example
  return <div>{props.a ? helper() : <div/>}</div>
}
```

This is a very natural thing to write, but breaks component identity during reconciliation. Instead, we should write:

```typescript
function Helper() {
  return <input key="my-key"/>
}

function View(props) {
  if (props.a) {
    return <Helper />
  } else {
    return <div />
  }
}
```

This has two important changes. First, we are invoking Helper via JSX. This converts it into a React.createElement call. This gives React the opportunity to intercept this call and get a handle on the Helper function, identifying it as an intermediate component, and giving it the opportunity to trigger an update rather than re-rendering the component. Second, we pulled out the helper function definition out of the view function. When helper is defined inside of view, a brand-new helper function is created every time the view updates. Because of that, even if we passed the helper through `createElement`, it would still consider it to be a new component (since comparing by reference would fail).

## React hooks

In essence, when rendering a component, React uses a linked list to keep track of hooks. The position of the hook in the list is the only thing that React can use to build correspondence between hooks from one update to the next. Because of this, the hook list must be deterministic - the hooks must always appear in the same order, and the list must always be of the same length. See [this](https://react.dev/reference/rules/rules-of-hooks) for more details on “rules of hooks”.

Another common problem with hooks is the dependency arrays. It’s really easy to get into situations where one effect updates another, updates another. It becomes difficult to reason about what the order of things is, and also possible to create infinite chains of hooks. Generally we shouldn’t need complex dependency chains like this and should default to using a dispatch / reducer pattern as with other more complex views, but these things tend to accumulate over time.

## React async effects, fiber, interruptible / concurrent rendering

For more details on tearing, see [link](https://github.com/reactwg/react-18/discussions/69).

Unlike DCGView, when React updates it accumulates all rendering effects and then applies them asynchronously (in  a process called “batching” and “flushing”).

In DCGView we can use a synchronous callback `onUpdateDone` to do something immediately after render. We do this to perform DOM measurements, manage focus, and other things. In React this code will need to be adapted 

React’s performance optimizations add some complexity around the update cycle. One state mutation doesn’t necessarily correspond to a single re-render or lifecycle event. The developer also needs to keep in mind that the DOM will update in a future async frame. There are tools for doing this (useLayoutEffect, flushSync), but they are much more complicated to understand and debug.

After React 16, the concept of fiber was also introduced. In essence this breaks apart the re-rendering task within the react tree into independent pieces called fibers. This allows re-rendering to be interrupted, and to be broken up into smaller pieces which prevents the UI from locking. While this is a useful performance improvement (from the point of view of working around React’s otherwise slow rendering performance), it does add additional complexity. Since rendering can now be done asynchronously, and applied in parts, it greatly complicates things like DOM measurement, focus management, tearing and animation timing.

# Performance

The initial reason for writing DCGView was to avoid costly VDOM renders and diffing operations. The binding interface is really quick by default. Due to the simplicity of the framework, bottlenecks are easy to identify and remediate. Typically these happen due to complex prop evaluations, which can be cached or worked around using `shouldUpdate` .

As such, we can mutate our state and just perform the binding evaluations on every update, meaning that we don’t have to adopt an immutability framework to make this work.

For React, we found that the VDOM updates were slow enough that we were not comfortable adapting it without addressing performance. Our attempt at this was the introduction of immutable data structures.

If our state is managed through immutable data structures, we can short-circuit react updates by doing reference comparisons on the state, which should greatly improve the speed of updates.

## immutability enforcement

### object freezing

When we create an immutable object via immer, like so:

```typescript
const immutable = immer.freeze(obj);
```

This object is frozen using `Object.freeze` in development mode (but not in prod). This means runtime TypeErrors if you try to modify the object (in strict mode, which we should be using). The hope is that combined with testing this will be fairly robust. In prod, it's just a plain object, so can be mutated.

> 💡 The most likely failure mode is that we will accidentally mutate the object somewhere that’s not exercised during testing. This would result in a view failing to update.



### Immutable type

The other line of defense is the type system. Immer provides an immutable type:

```typescript
// immutable essentially applies readonly
type Immutable<T> = 
  T extends PrimitiveType 
    ? T 
    : T extends AtomicObject 
      ? T 
      : T extends ReadonlyMap<infer K, infer V> 
        ? ReadonlyMap<Immutable<K>, Immutable<V>> 
        : T extends ReadonlySet<infer V> 
          ? ReadonlySet<Immutable<V>> 
          : T extends WeakReferences 
            ? T 
            : T extends object 
              ? {
                  readonly [K in keyof T]: Immutable<T[K]>;
                } 
              : T;
```

However, TypeScript doesn’t really have a strong type system, especially when it comes to covariance / contravariance for functions. This was an intentional choice to make it easier to port existing javascript codebases into it. As such, it’s quite easy to lose type safety for readonly, especially around function boundaries.

```typescript
declare type A = (b: {c: string}) => {d: string}
type B = Immutable<A>; // B is same as A. No immutability is enforced.
```

Another example:

```typescript
function mutate(mutable: {a: string}) {
  mutable.a = 'something else'
}

const immutable: Immutable<{a: string}> = freeze({a: 'something'})
mutate(immutable); // does not fail
```

And another:

```typescript
function process<T extends object>(data: T): object {
  return data; // Return type loses immutability information
}

const immutable = freeze({a: 'value'});
const result = process(immutable); // result is just 'object', immutability lost
```

Many type operations, like generics and intersections can lose immutability.

> 💡 The consequence of this is that developers have to be conscious and rely on explicit type hints and monitoring the type system to ensure that type information is not lost.

### ReactWrapper and useStateManager hook

In order to encourage devs to use immutable state and correctly subscribe to such state updates (instead of accidentally losing immutability), [ReactWrapper](https://github.com/amplify-education/desmos-classroom/blob/main/src/js/react-tools/react-wrapper.tsx) was introduced. This wrapper exposes a `resourcesToolkit` which contains several hooks that developers can use to grab state off of resources. For example:

```typescript
function View = ({resourcesToolkit}) => { // assumes View is a descendant of ReactWrapper
  const {useStateManager} = resourcesToolkit;
  const stateSlice = useStateManager(
    (resources) => resources.stateManager, // grab a state manager off of resources
    (state) => ({ // grab things off of the state
      prop: state.prop
    }
  )
}
```

The two-function invocation is intended to guide the developer to selecting an ImmutableState as an intermediary and not lose track of the fact that the state we subscribe to here must be an immer.js object.

The returned slice is mutable at the top level, but contains immutable objects one-layer-down.

The view is automatically subscribed to dispatched actions. It makes performance improvements by comparing the previous and current states (using reference equality at depth=1) and skipping updates when the immutable sub-keys are equal.

### reselect

Sometimes we need to do expensive transformations on our state. We would like to do these transformations once and then use a memoised version if possible. To do that, we’ve leveraged the reselect library and added a few of our own [helpers](https://github.com/amplify-education/desmos-classroom/blob/main/libs/desmos-classroom/core/src/reselect-tools/index.ts) to make it work with immutableState objects.

## Proxies

A Proxy is a wrapper around an object (called the "target") that lets you intercept and redefine fundamental operations for that object, such as property lookup, assignment, function invocation, and more.

**Handlers and Traps**: Proxies use a "handler" object containing "traps" - methods that intercept specific operations:

Basic syntax:

```javascript
const proxy = new Proxy(target, {
  get(target, prop, receiver) {
    // Reflect provides the default behavior of prop access (walking the prototype chain, etc...)
    return Reflect.get(target, prop, receiver);
  },
  // Other traps...
});

```

### immer.js draft proxy

Immer uses proxies for its draft system. When you use a `produce` call, we create a proxy draft object for the current immutable object. We track mutations on that object using the traps, and when the mutations are done, apply the mutations to create a new immutable object.

Proxies are a fairly leaky abstraction however. Here’s a few examples demonstrating how:



```typescript
const immutable = produce(currentState, (draft) => {
  // here, draft is a proxy object.
  // this can cause some trouble, for example if you want to compare the object or console.log it
  // to get at the actual underlying object you need to use current(draft)
  console.log(current(draft)) // can sometimes still be a Proxy (see next)
  
  // though actually sometimes even this is not enough!
  // there can sometimes be nested proxies due to things like nested structures, circular structures or prototype chains
  // so you have to resort to:
  console.log(original(draft)) // ignores all applied changes
  console.log(JSON.stringify(draft))
  
  
  // it's easy to get in trouble with the spread operator too. Since draft is a proxy,
  // {...draft} will not work
  const derived = {...current(draft), prop: 'other'}
  // all the caveats of nested proxies still apply, so this is generally best avoided
})


```

### ImmutableState

Historically, our code worked with plain objects. When you modify a plain object, the changes are globally visible everywhere immediately, and our code relies on this pretty heavily. For example, it’s common to have code like this in our current controllers:

```typescript
handleDispatch() {
  this.prop.subprop = 'update'
  const derivedProp = this.deriveProp()
}


deriveProp() {
  return this.prop.subprop
}
```

On the other hand, when using immer code like this, the mutations to subprop don’t apply until the draft function returns:

```typescript
handleDispatch() {
  this.prop = produce(this.prop, (draft) => {
    draft.subprop = 'update'
    const derivedProp = this.deriveProp()
  })
}

deriveProp() {
  return this.prop.subprop
}
```

If we were to translate this code naively, it’s easy to make mistakes since we may access this.prop.subprop in several places and historically were able to assume that it was always in sync with any changes that we’ve applied so far.

In order to make it easier to introduce immer to such code, we added [ImmutableState](https://github.com/amplify-education/desmos-classroom/blob/main/libs/desmos-classroom/core/src/immutable-state.ts). This wraps our state in another container that can be updated via `mutate`. This mutate receives the internal `draft` object, that’s wrapped in another layer of proxy that observes the mutations and makes them immediately visible to outside consumers.

```typescript
handleDispatch() {
  this.state.mutate((s) => {
    s.prop.subprop = 'update';
    const derivedProp = this.deriveProp()
  })
}

deriveProp() {
  return this.state.prop.subrop // immediately sees the subprop update
}
```

`this.state` is now proxied at all times - reads are always proxied, and writes are double-proxied (one layer through ImmutableState, and a second layer through immer’s draft).

Needless to say this introduces many edge cases and pain points that devs now need to be mindful of.

# AI

One of the main apparent advantages of React is that, due to the fact that it has much more representation in LLM’s training data, it’s likely that it will behave better for code generation.



However, since DCGView (and other, public frameworks like Solid.js) also use JSX, LLMs do seem to be able to generate it given some examples.



At the same time, even though LLMs do generate React readily, they tend to prefer local state and effect management using useState and useEffect, rather than plugging into existing state management frameworks. I imagine they will still struggle to leverage novel hooks like useStateManager or useResource, as well as accurately keep track of which pieces of state are immutable vs not, as would be common in our code base.



So the advantage of React for LLM generation is something we should evaluate as it applies to our actual context.

# Transition so far

React:

- 84 *.react.tsx files, 11Kloc
- 115 uses of <ReactWrapper>
- 38 uses of `useStateManager`
- 1 use of `useMultipleStateManagers`
- 120 cases of `buildImmutableState`
DCGView:

- 1242 *.tsx files, 250Kloc
- 1664 uses of `extends DCGView`


# Studio DCGView updates

Studio has been putting some additional work into DCGView, so if we took on the update we could get these improvements:

typescript rewrite

stopped const wrapping literals in the AST because we no longer require props / attrs to be functions.

delay instantiation now. So instead of immediately creating the class instance when you write `<View />` we simply store the instructions (or Spec) for the view you want. We do the instantiation at render time. This was important for fixing "you cannot remount a view" errors.

added Fragments `<></>`

switched to children being part of props. This gave us good (but still not great) types for children. Still hitting limitations of JSX types.

have much better attribute types. It knows `onPointerDown` expects an event handler where the event is a `PointerEvent`, for instance.  Should basically know all element attributes and if they make sense for the particular element

Part of the work was switching to Reacts "automatic" mode. It means instead of telling typescript (and esbuild) where your `createElement()` function is you tell it where it can auto import a `jsx()` and `jsxs()` function. The good thing here is that it automatically imports it when you need it instead of it being your responsibility to make sure it's imported. The thing we have not explored is there's also a `dev` mode for this. In that mode it passes even more info to the `jsx()` function to help give prettier errors.


