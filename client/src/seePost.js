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
            selected: {type: Number},
            edit: {type: Boolean}
        }
    }

    constructor() {
        super();
        this.edit = false;
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
            "pid": this.postId
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

    blockPost() {
        var current = this;
        var url = 'http://localhost:8081/handleblock';
        var rawData = {
            "place": 'posts',
            "type": 'pid',
            "id": current.postId,
            "value": 1
        }
        console.log(url);
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
            location.replace("index.html");
        }).catch(function (error) {
            console.warn('Something went wrong.', error);
        });
    }

    deletePost() {
        var current = this;
        var rawData = {
          "place": 'comments',
          "type": 'post',
          "id": current.postId
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
          "id": current.postId
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


      handleEdit(title, content){
          var current = this;
          var rawData = {
            "title": title,
            "content": content,
            "pid": current.postId
        }

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

    render() {
        return html`
          <link rel="stylesheet" href="./src/styles/postsAll.css">
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
                <button class="btn" @click="${(e) => this.deletePost()}" type="button" id="like">Delete</button> 
                <button class="btn" @click="${(e) => this.edit = true}" type="button" id="like">Edit</button>
            ` :
            html``
            }
            ${this.usertype != 'user' ?
            html`
                <button class="btn" @click="${(e) => this.blockPost()}" type="button" id="blockPost">Block Post</button>
            ` :
            html``
            }
            </like><br><br>
            ${this.edit == true && this.userid == item.user ?
                html`
                <form>
                <input
                    @input="${(e)=>item.title=e.target.value}"
                    type="text" placeholder="Title" id="title" name="title"><br><br>
                <textarea
                    @input="${(e)=>item.content=e.target.value}"
                    id="content"placeholder="Text (Optional)"></textarea>
                <br><button class="btn" id="publish" @click="${(e)=> this.handleEdit(item.title, item.content)}" type="button">Publish</button><br>
                <br><br>
                    </form>
                ` :
                html``
            }
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
