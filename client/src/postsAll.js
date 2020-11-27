import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class postsAll extends LitElement {
    static get properties() {
        return {
            data: {type: Array},
            userid: {type: Number},
            loggedIn: {type: Boolean},
            usertype: {type: String},
            username: {type: String},
            current: {type: Number},
            time: {type: Boolean},
            options: { type: Array },
            selected: { type: String },
            edit: {type: Boolean},
            title: {type: String},
            content: {type: String},
            globalPid: {type: Number}
        }
    }
    
    constructor() {
        super();
        this.edit = false;
        this.data = [];
        this.getUserid();
        this.getSorting();
        this.getUsertype();
        this.getResource();
        this.options = [{value:1, text:"Date"},
                        {value:2, text:"Likes"}];
    }

    getUserid() {
        this.userid = localStorage.getItem('userid');
        if (this.userid !== undefined && this.userid !== null) {
           this.loggedIn = true;
        } else {
           this.loggedIn = false;
        }
    }

    getSorting(){
        var current = this;
        var parameters = location.search.substring(1).split("&");
        if (parameters != "") {
            var temp = parameters[0].split("=");
            current.selected = unescape(temp[1]);
        } else {
            current.selected = 1;
        }
    }

    async getResource() {
        var url = `http://localhost:8081/allposts/${this.selected}`;
        fetch(url, {
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
        fetch(`http://localhost:8081/getUserinfo/${this.userid}`, {
            method: 'GET'})
        .then((response) => response.text())
        .then((responseText) => {
            var user = JSON.parse(responseText);
            this.usertype = user[0].userType;
            this.username = user[0].username;
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

    blockPost(postid) {
        var url = 'http://localhost:8081/handleblock';
        var rawData = {
            "place": 'posts',
            "type": 'pid',
            "id": postid,
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

    onChange(){
        this.selected = this.shadowRoot.querySelector('#sel').value
        var url = "index.html?value=" + this.selected;
        location.replace(url);
    }

    handleEdit(pid){
        var rawData = {
            "title": this.title,
            "content": this.content,
            "pid": pid
        }
        console.log("Pung");
        fetch('http://localhost:8081/updatePost', {
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

    handleEditClick(pid){
        this.edit = true;
        this.globalPid = pid;
    }

    render() {
        return html`
        <link rel="stylesheet" href="./src/styles/postsAll.css">
        <form>
        <select id="sel" @change="${this.onChange}">
        ${this.options.map(item => html`
            <option value="${item.value}" ?selected=${this.selected == item.value}>${item.text}</option>
        `)}
        </select>
        </form>
        ${this.data.map(item => html`
        <div class="post">
            <h4 class="title">
            <a id="link" href="posts.html?pid=${item.pid}">${item.title}</a>
            </h4>
            <p class="post-content">${item.content}</p>
            <p href="./profile.html" class="user">Posted by: <b id="username">${item.username}</b></p>
            <like>
                <button class="button" @click="${(e) => this.handleClick(item.pid, 1)}" type="button" id="like">Likes: ${item.upvote}</button>
                <button class="button" @click="${(e) => this.handleClick(item.pid, 0)}" type="button" id="dislike">Dislikes: ${item.downvote}</button>
            ${this.userid == item.user ?
            html`
                <button class="button" @click="${(e) => this.blockComment(item.cid, 1)}" type="button" id="like">Delete</button>
                <button class="button" @click="${(e) => this.handleEditClick(item.pid)}" type="button" id="edit">Edit</button>
            ` :
            html``
            }
            ${this.usertype != 'user' ?
            html`
                <button class="button" @click="${(e) => this.blockPost}" type="button" id="blockPost">Block Post</button>
            ` :
            html``
            }
            </like><br><br>
            ${this.edit == true && this.userid == item.user && item.pid == this.globalPid ?
            html`
            <form>
            <input
                @input="${(e)=>this.title=e.target.value}"
                type="text" placeholder="Title" id="title" name="title"><br><br>
            <textarea
                @input="${(e)=>this.content=e.target.value}"
                id="content"placeholder="Text (Optional)"></textarea>
            <button class="button" id="publish" @click="${(e)=> this.handleEdit(item.pid)}" type="button">Publish</button><br>
            <br><br>
                </form>
            ` :
            html``
            }
            <hr class="solid">
        </div>
        <br>`)}
        `
    }
}

customElements.define('posts-all', postsAll);
