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