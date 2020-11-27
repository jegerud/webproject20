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
            selected: { type: String }
        }
    }
    

    
    constructor() {
        super();
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
        console.log(url);
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

    blockPost(postid, mode = 0) {
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

    deletePost(postid) {
        var rawData = {
          "place": 'comments',
          "type": 'post',
          "id": postid,
        }
        
        fetch('http://localhost:8081/deletebypid', {
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
        }).catch(function (error) {
            console.warn('Something went wrong.', error);
        });
  
        rawData = {
          "place": 'posts',
          "type": 'pid',
          "id": postid,
        }
        
        fetch('http://localhost:8081/deletebypid', {
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
        <link rel="stylesheet" href="./src/styles/postsAll.css">
        <form>
        <select id="sel" @change="${this.onChange}">
        ${this.options.map(item => html`
            <option value="${item.value}" ?selected=${this.selected == item.value}>${item.text}</option>
        `)}
        </select>
        </form>
        <br><br>
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
                <button class="button" @click="${(e) => this.deletePost(item.pid)}" type="button" id="like">Delete</button> 
            ` :
            html``
            }
            ${this.usertype != 'user' ? 
            html`
                <button class="button" @click="${(e) => this.blockPost(item.pid)}" type="button" id="blockPost">Block Post</button> 
            ` :
            html``
            }
            </like><br><br>
            <hr class="solid">
        </div>
        <br>`)}
        `
    }
}

customElements.define('posts-all', postsAll);