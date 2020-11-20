import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class seeCommments extends LitElement {
    static get properties() {
        return {
            data: {type: Array},
            postId: {type: Number},
            currentuid: {type: Number}
        }
    }

    constructor() {
        super();
        this.data = [];
        this.getPostid();
        this.getResource();
    }

    getPostid(){
        var current = this;
        var parameters = location.search.substring(1).split("&");
        var temp = parameters[0].split("=");
        current.postId = unescape(temp[1]);
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

    getCurrentUserid(user) {
        fetch(`http://localhost:8081/getUserid/${user}`, {
            method: 'GET'
        })
        .then((response) => response.text())
        .then((responseText) => {
            this.currentuid = JSON.parse(responseText);
            console.log(this.currentuid);
        })
        .catch((error) => {
            console.log("The data could not be fetched");
            console.error(error);
        });
    }

    _likeComment() {
        var current = this;
        let rawData = {
            "uid": 0
        }
        fetch('http://localhost:8081/likecomment', {
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

    _dislikeComment() {
        var current = this;
        let rawData = {
            "uid": 0
        }
        fetch('http://localhost:8081/dislikecomment', {
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
        <p class="comment-title">Posted by <b>${item.username}</b></p>
        <p class="comment-content">${item.comment}</p> 
        <like>
            <button @click="${this._likeComment}" type="button" id="like">Likes: ${item.upvote}</button> 
            <button @click="${this._dislikeComment}" type="button" id="dislike">Dislikes: ${item.downvote}</button>
        </like><br><br><hr class="mid-solid">
        `)}
        `
    }
}

customElements.define('comments-all', seeCommments);