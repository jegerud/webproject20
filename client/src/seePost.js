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

    render() {
        return html`
        ${this.data.map(item => html`
                    <!--<div class="post-content">
                      <div class="post-container">
                        <img src="https://bootdey.com/img/Content/avatar/avatar6.png" alt="user" class="profile-photo-md pull-left">
                        <div class="post-detail">
                          <div class="user-info">
                            <h5><a href="timeline.html" class="profile-link">${item.username}</a> <span class="following">following</span></h5>
                          </div>
                          <div class="reaction">
                            <a class="btn text-green"><i class="fa fa-thumbs-up" style="color:green"></i> ${item.upvote}</a>
                            <a class="btn text-red"><i class="fa fa-thumbs-down" style="color:red"></i> ${item.downvote}</a>
                          </div>
                          <div class="line-divider"></div>
                            <div class="post-text">
                              <p>${item.content} <i class="em em-anguished"></i> <i class="em em-anguished"></i> <i class="em em-anguished"></i></p>
                            </div>
                          <div class="line-divider"></div>
                          <comments-all></comments-all>
                          <div class="post-comment">
                          <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="" class="profile-photo-sm">
                          <form>
                          <input @input="${(e)=>this.comment=e.target.value}" type="text" placeholder="Post a comment" id="title" name="title">
                          <button @click="${this._handleClick}" type="button" id ="button">Publish</button><br>
                          </form>
                        </div>
                      </div>
                    </div>
                   </div>-->

        `)}
        `
    }
}

customElements.define('see-post', seePost);
