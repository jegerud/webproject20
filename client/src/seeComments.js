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
            current: {type: Number},
            options: { type: Array },
            selected: {type: String}
        }
    }

    static styles = css`
    .sel {
        position: relative;
        display: inline-block;
        border-radius: 17px;
      }
      
      .dropdown-content {
        display: none;
        position: absolute;
        background-color: #f9f9f9;
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        padding: 12px 16px;
        z-index: 1;
      }
      
      .dropdown:hover .dropdown-content {
        display: block;
      }
    `

    constructor() {
        super();
        this.data = [];
        this.getPostid();
        this.getUserid();
        this.getSorting();
        this.getResource();
        this.getUsertype();
        this.options = [{value:1, text:"Date"}, 
                        {value:2, text:"Likes"}];
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

    getSorting(){
        var current = this;
        var parameters = location.search.substring(1).split("&");
        if(parameters.length > 1){
            var temp = parameters[1].split("=");
            current.selected = unescape(temp[1]);
            console.log(current.selected);
        } else {
            current.selected = 1;
        }
    }

    async getResource() {
        var url = `http://localhost:8081/comments/pid/${this.postId}/${this.selected}`;
        fetch(url, {
            method: 'GET'
        })
        .then((response) => response.text())
        .then((responseText) => {
            this.data = JSON.parse(responseText);
        })
        .catch((error) => {
            console.log("The data could not be fetched");
            console.log(error);
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

    onChange(){
        this.selected = this.shadowRoot.querySelector('#sel').value
        var url = "?pid=" + this.postId + "&value=" + this.selected;
        location.replace(url);
    }

    blockComment(commentid, mode = 0) {
        var url = '';
        var rawData = {
            "place": 'comments',
            "type": 'cid',
            "id": commentid,
            "value": 1
        }
        if (mode == 0) {
            url = 'http://localhost:8081/handleblock';
        } else {
            url = 'http://localhost:8081/deletecomments';
        }

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(rawData),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
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
        <select id="sel" @change="${this.onChange}">
        ${this.options.map(item => html`
            <option value="${item.value}" ?selected=${this.selected == item.value}>${item.text}</option>
        `)}
        </select>
        ${this.data.map(item => html`
        <p class="comment-title">Posted by <b>${item.username}</b></p>
        <p class="comment-content">${item.comment}</p> 
        <like>
            <button @click="${(e) => this.handleClick(item.cid, 1)}" type="button" id="like">Likes: ${item.upvote}</button> 
            <button @click="${(e) => this.handleClick(item.cid, 0)}" type="button" id="dislike">Dislikes: ${item.downvote}</button>
        ${this.userid == item.user ? 
        html`
            <button @click="${(e) => this.blockComment(item.cid, 1)}" type="button" id="like">Delete Comment</button> 
        ` :
        html``
        }
        ${this.usertype != 'user' ? 
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