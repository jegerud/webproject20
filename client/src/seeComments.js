import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class seeCommments extends LitElement {
    static get properties() {
        return {
            data: {type: Array},
            postId: {type: Number}
        }
    }

    constructor() {
        super();
        this.postId = 1;
        this.data = [];
        this.getResource();
    }

    async getResource() {
        fetch(`http://localhost:8081/comments/${this.postId}`, {
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
            <div class="post-comment">
                <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="" class="profile-photo-sm">
                <p><a href="timeline.html" class="profile-link">Diana </a><i class="em em-laughing"></i>${item.comment}</p>
            </div>
        `)}
        `
    }
}

customElements.define('comments-all', seeCommments);