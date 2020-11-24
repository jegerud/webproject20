import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class seeCommments extends LitElement {
    static get properties() {
        return {
            data: {type: Array},
            postId: {type: Number},
            currentuid: {type: Number},
            loggedIn: {type: Boolean},
            usertype: {type: String},
            username: {type: String},
            current: {type: Number}
        }
    }

    constructor() {
        super();
        this.data = [];
        this.getPostid();
        this.getUserid();
        this.getResource();
        this.getUsertype();
    }

    getPostid(){
        var current = this;
        var parameters = location.search.substring(1).split("&");
        var temp = parameters[0].split("=");
        current.postId = unescape(temp[1]);
    }

    getUserid() {
        var current = this;
        current.userid = localStorage.getItem('userid');
        if (current.userid !== undefined && current.userid !== null) {
           current.loggedIn = true;
        } else {
           current.loggedIn = false;
        }
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

    async getUsertype() {
        var current = this;
        var url = `http://localhost:8081/getUserinfo/${current.userid}`
        fetch(url, {
            method: 'GET'})
        .then((response) => response.text())
        .then((responseText) => {
            var user = JSON.parse(responseText);
            current.usertype = user[0].userType;
            current.username = user[0].username;
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

    handleClick(commentid, mode) {
        var url = '';
        let rawData = {
            "commentid": commentid
        }
        if (mode == 1) {
            url = 'http://localhost:8081/likecomment';
        } else {
            url = 'http://localhost:8081/dislikecomment';
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
            location.reload();
        }).catch(function (error) {
            console.warn('Something went wrong.', error);
        });
    }

    blockComment(commentid) {
        var url = 'http://localhost:8081/handleblock';
        var rawData = {
            "place": 'comments',
            "type": 'cid',
            "id": commentid,
            "value": 1
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
        <p class="comment-title">Posted by <b>${item.username}</b></p>
        <p class="comment-content">${item.comment}</p> 
        <like>
            <button @click="${(e) => this.handleClick(item.cid, 1)}" type="button" id="like">Likes: ${item.upvote}</button> 
            <button @click="${(e) => this.handleClick(item.cid, 0)}" type="button" id="dislike">Dislikes: ${item.downvote}</button>
        ${this.getUsertype != 'user' ? 
        html`
            <button @click="${(e) => this.blockComment(item.cid)}" type="button" id="like">Block Comment</button> 
        ` :
        html``
        }
        </like><br><br><hr class="mid-solid">
        `)}
        `
    }
}

customElements.define('comments-all', seeCommments);