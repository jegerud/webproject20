import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class subAllusers extends LitElement {
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
          <p>Nr 4</p>
    `;}
}


customElements.define('sub-allusers', subAllusers);