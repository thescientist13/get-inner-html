# get-inner-html

Example for demonstrating and understanding `getInnerHTML`, used in Declarative Shadow DOM.

## Setup
1. Clone the repo
1. Run `npm ci`
1. Run `npm start`

`localhost:8080` should open in your browser.

> _Make sure to test with a browser that supports Declarative Shadow DOM, like Chrome or Edge._

## Overview

To quote from the [web.dev article](https://web.dev/declarative-shadow-dom/#serialization) on serializing Declarative Shadow DOM

> Passing the `includeShadowRoots:true` option serializes the entire subtree of an element, **including its shadow roots**. The included shadow roots are serialized using the `<template shadowroot>` syntax.

In the context of server side rendering (SSR), I'm not sure if it is saying that if it was set to _`false`_
a) It would not literally does not render shadow roots at all
b) just doesn't render / return them in `<template>`

So for example, given these custom elements + shadowRoot

```js
// navigation.js
const template = document.createElement('template');

template.innerHTML = `
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/contact">Contact</a></li>
    <ul>
  </nav>
`;

class Navigation extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }
}

customElements.define('wcc-navigation', Navigation);

// header.js
import './navigation.js';

const template = document.createElement('template');

template.innerHTML = `
  <header>
    <h1>Welcome to my website</h1>
    <wcc-navigation></wcc-navigation>
  </header>
`;

class Header extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }
}

export { Header };

customElements.define('wcc-header', Header);
```

And invoked as so
```js
import { Header } from './header.js';

const element = new Header();
const html = element.getInnerHTML({ includeShadowRoots: false });

console.debug({ html });
```

----

Would the output be

A) No Shadow Roots
```html
<header>
  <h1>Welcome to my website</h1>
  <wcc-navigation></wcc-navigation>
</header>
```

or

B) Just no `<template>` (e.g. only light DOM)
```html
<header>
  <h1>Welcome to my website</h1>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/contact">Contact</a></li>
    <ul>
  </nav>
</header>
```