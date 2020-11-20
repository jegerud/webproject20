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

    _likePost() {
        let rawData = {
            "pid":this.postId
        }
        fetch('http://localhost:8081/likepost', {
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

    __dislikePost() {
        let rawData = {
            "pid":this.postId
        }
        fetch('http://localhost:8081/dislikepost', {
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
        <div class="main-post"> 
            <p>Posted by <b>${this.data[0].username}</b></p>
            <hr class="solid">
            <h4 class="head">${this.data[0].title}</h4>
            <p class="post-content">${this.data[0].content}</p>
            <like>
                <button @click="${this._likePost}" type="button" id="like">Likes: ${this.data[0].upvote}</button> 
                <button @click="${this.__dislikePost}" type="button" id="dislike">Dislikes: ${this.data[0].downvote}</button>
            </like><br><br>
            <hr class="solid">
        </div>
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
