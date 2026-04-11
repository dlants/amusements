---
title: With AI, you barely need a frontend framework
shortUrl: vamp
publishDate: "2026-04-10"
tags: ["tech"]
---

Oh no! Yet another article about frontend frameworks! Sure, roll your eyes all you want but _you_ clicked on this, so here we are.

The issues with React are well documented, and I won't lead with them here. However, React is still the framework of choice for many teams. If you still need convincing that you might want to look for something different, see the Appendix. Many frameworks require tools like JSX or are their own languages like Svelte, adding custom tooling which may not be compatible with your code analysis and deploy tools, or your IDE. And in either case, many introduce new concepts, abstractions and hidden transformations.

When I was learning about Pratt parsers (see [[Desmos blog post about Pratt Parsers]]), I was really struck by the fact that there are no Pratt parsing libraries. The Pratt parser is really just a pattern. It shows you how to decompose the problem and organize your solution, so that your code remains comprehensible even as the complexity of the language you are parsing grows.

Inspired by this, I decided to try and apply this to my frontend code for my latest project. Could I rely on just typescript and the DOM API, and come up with an organizational pattern that would allow me to build complex frontends? Maybe this would require more redundant boilerplate, but if that boilerplate is predictable, my AI coding assistant can handle reading, summarizing and writing it for me.

# a pattern, not a framework

Let's build it up one piece at a time.

## Templates

The simplest starting point: render state to HTML using a template string.

```typescript
class CounterView {
  container: HTMLElement;

  constructor(
    container: HTMLElement,
    dispatch: (msg: Msg) => void,
    initialState: State,
  ) {
    this.container = container;
    container.innerHTML = sanitize`
      <div>
        <button data-ref="dec">−</button>
        <span data-ref="count">${initialState.count}</span>
        <button data-ref="inc">+</button>
      </div>
    `;

    container
      .querySelector('[data-ref="dec"]')!
      .addEventListener("click", () => dispatch({ type: "DECREMENT" }));
    container
      .querySelector('[data-ref="inc"]')!
      .addEventListener("click", () => dispatch({ type: "INCREMENT" }));
  }
}
```

`sanitize` is a tagged template that HTML-escapes all interpolated values for XSS safety. No JSX transform, no build plugin. You lose syntax checking for JSX... but your AI can write correct html, so it's probably fine.

## Bindings

The template renders once. To update the DOM when state changes, we introduce a sync function and bindings:

```typescript
class CounterView {
  container: HTMLElement;
  private b: Binder<State>;

  constructor(
    container: HTMLElement,
    dispatch: (msg: Msg) => void,
    initialState: State,
  ) {
    this.container = container;
    container.innerHTML = sanitize`
      <div>
        <button data-ref="dec">−</button>
        <span data-ref="count">0</span>
        <button data-ref="inc">+</button>
      </div>
    `;

    this.b = new Binder(container, initialState);

    // ...

    this.b.bindText("count", (s) => String(s.count));
  }

  sync(state: State): void {
    this.b.sync(state);
  }

  destroy(): void {
    this.b.cleanup();
    this.container.innerHTML = "";
  }
}
```

The `Binder` holds a list of bindings. Each binding is a function that accepts state and performs a DOM mutation. `bindText` finds the element with `data-ref="count"` and sets its `textContent` to the result of the function on every sync. There are similar helpers for other properties: `bindAttr`, `bindClass`, `bindVisible`, `bindStyle`, `bindDisabled`.

Calling `sync(state)` runs every binding with the new state. Updates are direct and synchronous. If you need to measure an element after a state change, you can do it on the next line.

This gives us a `View` interface:

```typescript
interface View<State, Message> {
  container: HTMLElement;
  sync(state: State): void;
  destroy(): void;
}
```

The constructor creates the HTML and sets up bindings. `sync` propagates new state.

At the top of the application, you wire it together (this is similar to Flux / Elm):

```typescript
function mount(container: HTMLElement) {
  const state = initialState();

  function dispatch(msg: Msg): void {
    update(state, msg, dispatch);
    view.sync(state);
  }

  const view = new CounterView(container, dispatch, state);
}
```

The cycle is: DOM event → `dispatch` → `update` mutates state → `view.sync` syncs DOM with the new state. The whole thing is synchronous. You can put a breakpoint in `update` and see the full picture in a single call stack.

## Composition: child views

What if we want to nest views, with one view being the parent of another? A parent can `bindChild` to mount a child into a node:

```typescript
const navRef = "nav";
container.innerHTML = sanitize`
  <div data-ref="${navRef}"></div>
  <div>other content...</div>
`;

this.b.bindChild(navRef, NavView, (s) =>
  {
    loggedIn: s.auth.status === "logged-in",
    displayName: s.displayName,
  },
  // child's dispatch function
  // childMsg is wrapped in parent's msg type and dispatched to parent
  (childMsg) => dispatch({ type: "NAV_MSG", msg: childMsg }),
);
```

This mounts `NavView` immediately with the initial state. It also creates a binding to sync the child view on `this.b.sync(nextState)` and destroy it on `this.b.cleanup()`

## Conditional children

Often we want to conditionally mount/unmount a child. `bindChild` always mounts a single view class, but `bindSlot` generalizes this: the binding function returns a `SlotContent` descriptor (via `show()`), or `undefined` to clear the slot:

```typescript
this.b.bindSlot(detailRef, (s) => {
  if (!s.selectedId) return undefined;
  return show(DetailView, { id: s.selectedId }, () => {});
});
```

`SlotContent` is a record containing the view constructor and state that should show up in the slot.

When `selectedId` is null, the slot is empty. When it has a value, `DetailView` is mounted (or synced if it's already there). Notice that TypeScript's type narrowing works naturally through the early return: by the time we call `show`, `s.selectedId` is known to be non-null. This is essentially just a managed effect.

This extends naturally to switching between multiple views:

```typescript
this.b.bindSlot(contentRef, (s) => {
  switch (s.page.status) {
    case "loading":
      return show(SpinnerView, {}, () => {});
    case "loaded":
      // type narrowing works here!
      return show(DetailView, s.page.data, () => {});
    case "error":
      return show(ErrorView, { message: s.page.error }, () => {});
  }
});
```

On each sync, the slot compares what it has mounted against what the function returns:

- Same view class? Sync the existing instance with new state.
- Different class? Destroy the old view, mount the new one.
- `undefined`? Destroy and clear the slot.

In fact, `bindSlot` subsumes `bindChild`: if the function always returns the same view class, the slot just syncs it every time, which is exactly what `bindChild` does. So we don't actually need `bindChild` as a separate method.

## Lists

`bindSlot` handles a single child. `bindList` extends the same principle to arrays. Since multiple children may use the same view class, we can no longer rely on constructor identity to track which is which. Instead, we use keys:

```typescript
this.b.bindList(listRef, "li", (s) =>
  s.items.map((item) =>
    showKeyed(
      item.id,
      ItemView,
      {
        item,
        isSelected: item.id === s.selectedId,
      },
      () => {},
    ),
  ),
);
```

On each sync, `bindList` matches items by key: new keys mount, existing keys sync, removed keys destroy. DOM order is updated to match array order (using `appendChild`, which moves existing nodes). The algorithm is simple enough to read in the source.

## Unique data-refs

There's a subtle problem with composition. When a parent calls `this.b.ref("count")`, it queries `container.querySelectorAll('[data-ref="count"]')`. But if a child view also has an element with `data-ref="count"`, the parent might accidentally select inside the child.

The solution: `ref()` generates unique names, and returns a branded `Ref` type:

```typescript
const countRef = ref("count"); // returns something like "count_0"
const incRef = ref("inc"); // "inc_1"
```

The binding methods (`bindText`, `bindSlot`, etc.) require a `Ref`, not a plain string. This forces every data-ref through `ref()`, guaranteeing uniqueness across all views on the page.

## Styles

We could just use plain css, but css-in-js has a few advantages - unique class names prevent cross-talk. Attaching the class to a variable lets our IDE find references and makes sure we don't typo.

```typescript
const headerClass = cls("header");

mountStyle(`
.${headerClass} {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}
`);

// then in a view's constructor:
container.innerHTML = sanitize`
  <div class="${headerClass}">...</div>
`;
```

`cls()` generates a unique class name, `mountStyle()` injects a `<style>` tag. Plain CSS, no build step, no special syntax. Your AI can write this for you. If you want mixins you can just use template interpolation, or transform the string however you like.

## Putting it all together

The whole pattern is described in a 300 line markdown file, with a 300 line binding library/helper TypeScript file. You can read both here: [github.com/dlants/vamp](https://github.com/dlants/vamp). Copy/paste the library into your project, add the markdown file to your agent's context window, and you're ready to go. You can see a more thorough example of a project that uses vamp [here](https://github.com/dlants/tether/blob/main/packages/frontend/main.ts) (it is a WIP, btw). Here's an abstract [modal view](https://github.com/dlants/tether/blob/main/packages/frontend/views/modal.ts). Here's the [router](https://github.com/dlants/tether/blob/main/packages/frontend/router.ts).

# Why this works now

The traditional argument against approaches like Vamp is that they're too verbose. It is tedious to write out explicit selectors and bindings for every element, wire up event listeners, or compose views through constructor calls.

That argument made sense when humans were writing every line. It doesn't hold up when an AI agent is writing (or modifying) the code.

What matters for AI isn't conciseness, it's explicitness, locality and predictability.

Vamp is great on all three counts. There is no action at a distance through proxies or other magic. The pattern is explicit and repetitive, which means the AI can pattern-match reliably and repeat the pattern to build new views. There's no hidden machinery (fiber scheduler, hook linked lists, reconciliation heuristics) to get wrong. Every state transition is synchronous and visible in the `update` function. Every DOM update is a direct binding.

This is your lifecycle:

```typescript
class MyView {
  constructor (...) {
    // before mount
    this.content.innerHTML = `...`
    // after mount but before children mount
    this.b.bindSlot(...
    // after children mount
  }

  sync(...) {
    // before update
    this.b.sync(...)
    // after update
  }

  destroy(...) {
    // before destroy
    this.content.innerHTML = ''
    this.b.cleanup();
    // after destroy
  }
}
```

Syncs traverse through all the `bindSlot` binding functions explicitly, so error stack traces have your full actual views in it, not incomprehensible framework code.

Vamp is performant and malleable. Want to optimize a particular path? Need an escape hatch to do something funky? The DOM is right there! Want to go with full-elm-style pure update functions and managed effects? Be my guest.

So go. Be free. You never need to touch another framework again. (OK yes technically there is a 300 line ts file and so you could say this is still a framework, but it's _barely_ a framework).

# Appendix: Problems with React

See [this](https://react.dev/reference/rules/react-calls-components-and-hooks#never-call-component-functions-directly) for more details.

On first glance, React has a simple conceptual model, especially the modern version which encourages the use of functional components.

```typescript
function view(props: Props): JSX;
```

This view function is re-evaluated on every update. The resulting virtual dom is then diffed against the virtual dom representing what was previously rendered. This results in a set of updates that are then applied to the DOM.

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

If an update happens while interacting with this input, you can often end up in a situation where the input loses the typed text, or loses focus. (see [link](https://stackoverflow.com/search?q=react%20focus%20typing&s=650e5920-cd52-4696-aa54-11799ff32afb) for many, many examples of folks running into this sort of issue)

This is because react creates a brand new `<input>` VDOM whenever the view updates. It then needs to decide if you intend to keep the same input DOM, or create a new one, and there are many things that can cause it to replace the existing element with a new one.

During diffing (what React often refers to as reconciliation), React really wants to avoid traversing sub-trees to see if a given node is the same or different. Because of this, it relies on component identity and keys to short-circuit this process. If you don’t use these correctly, React will re-mount the element on every update. This can cause problems with losing input content and focus, and can also cause performance problems.

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

This has two important changes. First, we are invoking Helper via JSX. This converts it into a React.createElement call. This gives React the opportunity to intercept this call and get a handle on the Helper function, identifying it as an intermediate component, and giving it the opportunity to trigger an update rather than re-rendering the component. Second, we pulled the helper function definition out of the view function. When helper is defined inside of view, a brand-new helper function is created every time the view updates. Because of that, even if we passed the helper through `createElement`, it would still consider it to be a new component (since comparing by reference would fail).

## React hooks

In essence, when rendering a component, React uses a linked list to keep track of hooks. The position of the hook in the list is the only thing that React can use to build correspondence between hooks from one update to the next. Because of this, the hook list must be deterministic - the hooks must always appear in the same order, and the list must always be of the same length. See [this](https://react.dev/reference/rules/rules-of-hooks) for more details on “rules of hooks”.

Another common problem with hooks is the dependency arrays. It’s really easy to get into situations where one effect updates another, updates another. It becomes difficult to reason about what the order of things is, and also possible to create infinite chains of hooks. Generally we shouldn’t need complex dependency chains like this and should default to using a dispatch / reducer pattern as with other more complex views, but these things tend to accumulate over time.

## React async effects, fiber, interruptible / concurrent rendering

For more details on tearing, see [link](https://github.com/reactwg/react-18/discussions/69).

When React updates it accumulates all rendering effects and then applies them asynchronously (in a process called “batching” and “flushing”).

React’s performance optimizations add some complexity around the update cycle. One state mutation doesn’t necessarily correspond to a single re-render or lifecycle event. The developer also needs to keep in mind that the DOM will update in a future async frame. There are tools for doing this (useLayoutEffect, flushSync), but they are much more complicated to understand and debug.

After React 16, the concept of fiber was also introduced. In essence this breaks apart the re-rendering task within the react tree into independent pieces called fibers. This allows re-rendering to be interrupted, and to be broken up into smaller pieces which prevents the UI from locking. While this is a useful performance improvement (from the point of view of working around React’s otherwise slow rendering performance), it does add additional complexity. Since rendering can now be done asynchronously, and applied in parts, it greatly complicates things like DOM measurement, focus management, tearing and animation timing.

## Performance

React's VDOM renders and diffing operations are notoriously costly. The solution that many teams reach for is tuning shouldUpdate calls, or pulling in libraries like immer to provide immutable state, so the framework can short-circuit updates based on object reference equality. Immer adds a whole new can of worms - indirection and leaky abstractions inherent in proxies, type wrangling between draft & non-draft state, etc...
