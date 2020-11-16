import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class subAllusers extends LitElement {
    static get properties() {
        return {
            data: {type: Array}
        }
    }

    constructor() {
        super();
        this.data = [];
        this.getResource();
    }

    async getResource() {
        fetch('http://localhost:8081/getUsers', {
            method: 'GET'
        })
        .then((response) => response.text())
        .then((responseText) => {
            this.data = JSON.parse(responseText);
        })
        .catch((error) => {
            console.log("The data could not be fetched");
            console.error(error);
        });
    }

    render() {
      return html`
      <br>
      ${this.data.map(item => html`
        <a>Username:  ${item.username}</a><br>
        <a>User Type: ${item.userType}</a><br>
      <br>`)}
    `
    ;}
}


customElements.define('sub-allusers', subAllusers);