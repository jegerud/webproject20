import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class subMyposts extends LitElement {
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
          <p>Nr 2</p>
    `;}
}


customElements.define('sub-myposts', subMyposts);