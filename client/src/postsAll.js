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
        <head> 
            <link rel="stylesheet" href="./src/styles/posts.css">
        </head>
        <div class="flex-container">
            <div class="post" id="left">
                <h4 class="postTitle">
                    <a href="posts.html">${item.title}</a>
                </h4>
                <p>${item.email}</p><br>
            </div>
            <div class="post" id="text">
                <p>${item.content}</p>
            </div>
            <div class="post" id="right">
            ${!currentUser.loggedIn && currentUser.email == item.email ?
                html`
                    <p> ${item.email}</p>
                `:
                html`
                   <p> ${currentUser.email}</p>
                   `}
            </div>
        </div>
        <br></br> `)}
            `
    }
}

customElements.define('posts-all', postsAll);