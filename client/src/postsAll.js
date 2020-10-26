import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class postsAll extends LitElement {
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
        fetch('http://localhost:8081/posts', {
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
        ${this.data.map(item => html`
        <h4>
            <a href="posts.html">${item.title}</a>
        </h4>
        <p>${item.content}</p>
        <p>${item.email}</p><br>`)}
        `
    }
}

customElements.define('posts-all', postsAll);