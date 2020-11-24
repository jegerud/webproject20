import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class seePost extends LitElement {
    static get properties() {
        return {
            data: {type: Array},
            postId: {type: Number},
            comment: {type: String},
            userid: {type: Number}
        }
    }

    constructor() {
        super();
        this.data = [];
        this.getUserid();
        this.getPostid();
        this.getResource();
    }

    getPostid(){
        var current = this;
        var parameters = location.search.substring(1).split("&");
        var temp = parameters[0].split("=");
        current.postId = unescape(temp[1]);
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
        var current = this;
        fetch(`http://localhost:8081/posts/${current.postId}`, {
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

    _handleClick() {
      console.log(this.comment);
      let rawData = {
          "comment": this.comment,
          "pid":this.postId,
          "uid":this.userid
      }
      console.log(rawData);
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
          console.log(data);
          location.reload();
      }).catch(function (error) {
          console.warn('Something went wrong.', error);
      });
     }

    handleLike(mode) {
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
            console.log(data);
            location.reload();
        }).catch(function (error) {
            console.warn('Something went wrong.', error);
        });
    }

    render() {
        return html`
        ${this.data.map(item => html`
        <div class="main-post"> 
            <p>Posted by <b>${item.username}</b></p>
            <hr class="solid">
            <h4 class="head">${item.title}</h4>
            <p class="post-content">${item.content}</p>
            <like>
<<<<<<< HEAD
                <button @click="${(e) => this.handlePost(1)}" type="button" id="like">Likes: ${item.upvote}</button> 
                <button @click="${(e) => this.handlePost(0)}" type="button" id="dislike">Dislikes: ${item.downvote}</button>
=======
                <button @click="${(e) => this.handleLike(1)}" type="button" id="like">Likes: ${this.data[0].upvote}</button> 
                <button @click="${(e) => this.handleLike(0)}" type="button" id="dislike">Dislikes: ${this.data[0].downvote}</button>
>>>>>>> featurePosts
            </like><br><br>
            <hr class="solid">
        </div>
        `)}
        <form class="post-comment">
            <input @input="${(e)=>this.comment=e.target.value}" type="text" placeholder="Post a comment" id="post-comment" name="postcomment">
            <button @click="${this._handleClick}" type="button" id ="button">Publish</button><br>
        </form><br>
        <div class="comments"> 
            <comments-all></comments-all>
        </div>
        `
    }
}

customElements.define('see-post', seePost);
