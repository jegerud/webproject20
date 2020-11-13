import { LitElement, html, css } from 'lit-element';

export class headerBar extends LitElement {

    static styles = css`
    :host {
        display: block;
    }
    .header {
        padding: 20px;
        text-align: center;
        background: #3983AD;
        color: white;
        font-family: Avant Garde, Courier, monospace;
        font-size: 26px;
        text-transform: uppercase;
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