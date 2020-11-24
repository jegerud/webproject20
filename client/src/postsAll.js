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
            time: {type: Boolean}
        }
    }
    
    static styles = css`
    .dropdown {
        position: relative;
        display: inline-block;
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
        this.time = false;
        this.getUserid();
        this.getUsertype();
        this.getResource();
    }

    getUserid() {
        this.userid = localStorage.getItem('userid');
        if (this.userid !== undefined && this.userid !== null) {
           this.loggedIn = true;
        } else {
           this.loggedIn = false;
        }
    }

    async getResource() {
        var url = '';
        if (this.time == true) {
            url = 'http://localhost:8081/allposts/1';
        } else {
            url = 'http://localhost:8081/allposts/0';
        }
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

    render() {
        return html`
        <form>
            <select name = "dropdown">
               <option @click="${(e) => this.time = false}" value="Likes">Likes</option>
               <option @click="${(e) => this.time = true}" value="Date">Date</option>
            </select>
        </form>
        <br><br>
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
            ${this.getUsertype != 'user' ? 
            html`
                <button @click="${(e) => this.blockPost(item.pid)}" type="button">Block Post</button> 
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