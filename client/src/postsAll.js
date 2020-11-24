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

    handleClick(pid, mode) {
        var url = '';
        let rawData = {
            "pid": pid
        }

        if (mode == 1) {
            url = 'http://localhost:8081/likepost';
        } else {
            url = 'http://localhost:8081/dislikepost';
        }

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(rawData),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).then(function (response) {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(response);
        }).then(function (data) {
            console.log(data);
            location.reload();
        }).catch(function (error) {
            console.warn('Something went wrong.', error);
        });
    }

    render() {
        return html`
        ${this.data.map(item => html`
        <div class=""> 
            <p>Posted by <b>${item.username}</b></p>
            <h4 class="head">
            <a href="posts.html?pid=${item.pid}">${item.title}</a>
            </h4>
            <p class="post-content">${item.content}</p>
            <like>
                <button @click="${(e) => this.handleClick(item.pid, 1)}" type="button" id="like">Likes: ${item.upvote}</button> 
                <button @click="${(e) => this.handleClick(item.pid, 0)}" type="button" id="dislike">Dislikes: ${item.downvote}</button>
            </like><br><br>
            <hr class="solid">
        </div>
        <br>`)}
        `
    }
}

customElements.define('posts-all', postsAll);