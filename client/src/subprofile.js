import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class subProfile extends LitElement {
    static get properties() {
      return {
        loggedIn: {type: Boolean},
      };
    }

    constructor() {
      super();
    }

    render() {
        return html`
          <p>Nr 1</p>
    `;}
}


customElements.define('sub-profile', subProfile);