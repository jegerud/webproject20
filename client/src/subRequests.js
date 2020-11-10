import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class subRequests extends LitElement {
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
          <p>Nr 3</p>
    `;}
}


customElements.define('sub-requests', subRequests);