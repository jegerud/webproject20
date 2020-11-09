import { LitElement, html, css } from 'lit-element';

export class headerBar extends LitElement {

    static styles = css`
    :host {
        display: block;
    }
    .header {
        padding: 20px;
        text-align: center;
        background: #A9A9A9;
        color: white;
        font-size: 26px;
      }
    `;

    render() {
        return html`
        <div class="header">
        <h1>Frontpage</h1>
      </div> 
    `;
    }
}

customElements.define('header-bar', headerBar);