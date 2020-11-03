import { LitElement, html, css } from 'lit-element';

export class profileBar extends LitElement {
    static get properties(){
        return{
            text: {type: String}
        }
    }

    constructor() {
        super();
        this.getResource();
    }

    async getResource() {
        fetch('http://localhost:8081/getUser/3  ', {
            method: 'GET'})
        .then((response) => response.text())
        .then((responseText) => {
            var user = JSON.parse(responseText);
            this.text = user[0].email; 
        })
        .catch((error) => {
            console.log("The data could not be fetched");
            console.error(error);
        });
    }

    static styles = css`
    :host {
        display: block;
    }
    .header {
        padding: 30px;
        text-align: center;
        background: #A9A9A9;
        color: white;
        font-size: 30px;
      }
    `;

    render() {
        return html`
        <div class="header">
        <h1>${this.text.split('@')[0].toUpperCase()}</h1>
      </div> 
    `;
    }
}

customElements.define('profile-bar', profileBar);