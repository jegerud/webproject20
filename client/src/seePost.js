import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class seePost extends LitElement {
    static get properties() {
        return {
            data: {type: Array},
            postId: {type: Number},
            comment: {type: String},
            userid: {type: Number},
            usertype: {type: String},
            username: {type: String},
            selected: {type: Number}
        }
    }

    constructor() {
        super();
        this.data = [];
        this.getUserid();
        this.getPostid();
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
        var current = this;
        var url = `http://localhost:8081/posts/pid/${current.postId}`;
        console.log(url);
        fetch(url, {
            method: 'GET'
        })
        .then((response) => response.text())
        .then((responseText) => {
            current.data = JSON.parse(responseText);
        })
        .catch((error) => {
            console.log("The data could not be fetched");
            console.error(error);
        });
    }

    async getUsertype() {
        var current = this;
        fetch(`http://localhost:8081/getUserinfo/${current.userid}`, {
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

    _handleClick() {
        let rawData = {
            "comment": this.comment,
            "pid":this.postId,
            "uid":this.userid
        }
        fetch('http://localhost:8081/comments', {
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

    handlePost(mode) {
        var url = '';
        let rawData = {
            "pid":this.postId
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
            location.reload("index.html");
        }).catch(function (error) {
            console.warn('Something went wrong.', error);
        });
    }

    deletePost(postid) {
        var rawData = {
          "place": 'comments',
          "type": 'post',
          "id": postid
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
            console.log("Comments deleted!");
        }).catch(function (error) {
            console.warn('Something went wrong.', error);
        });
  
        rawData = {
          "place": 'posts',
          "type": 'pid',
          "id": postid
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
            console.log("Deleting posts");
            location.replace(`index.html`);
        }).catch(function (error) {
            console.warn('Something went wrong.', error);
        });
      }

    render() {
        return html`
        <p></p>
        ${this.data.map(item => html`
        <div class="main-post"> 
            <hr class="solid">
            <h4 class="head">${item.title}</h4>
            <p class="post-content">${item.content}</p>
            <p id="posted">Posted by <b>${item.username}</b></p>
            <like>
                <button class="btn" @click="${(e) => this.handlePost(1)}" type="button" id="like">Likes: ${item.upvote}</button> 
                <button class="btn" @click="${(e) => this.handlePost(0)}" type="button" id="dislike">Dislikes: ${item.downvote}</button>
            ${this.userid == item.user ? 
            html`
                <button class="btn" @click="${(e) => this.deletePost(item.pid)}" type="button" id="like">Delete</button> 
            ` :
            html``
            }
            ${this.usertype != 'user' ? 
            html`
                <button class="btn" @click="${(e) => this.blockPost(item.pid)}" type="button" id="blockPost">Block Post</button> 
            ` :
            html``
            }
            </like><br><br>
            <hr class="solid">
        </div>
        `)}
        <form class="post-comment">
            <input @input="${(e)=>this.comment=e.target.value}" type="text" placeholder="Post a comment" id="post-comment" name="postcomment">
            <button class="btn" @click="${this._handleClick}" type="button" id ="publish">Publish</button><br>
        </form><br>
        <div class="comments"> 
            <comments-all></comments-all>
        </div>
        `
    }
}

customElements.define('see-post', seePost);
