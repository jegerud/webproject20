import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class subBlockedcomments extends LitElement {
    static get properties() {
      return {
        loggedIn: {type: Boolean},
        userid: {type: Number},
        data: {type: Array}
      };
    }

    static styles = css`
    :host {
        display: block;
    }
    .body {
        padding-left: 20px;
    }
    .sublikes {
        padding-left: 20px;
        font-size: 13px;
    }
    `;

    constructor() {
      super();
      this.data = [];
      this.getUserid();
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
      console.log("Fetching");
      fetch(`http://localhost:8081/blocked/comments`, {
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

    handleBlock(mode, commentid) {
      var url = '';
      var rawData = {
        "place": 'comments',
        "type": 'cid',
        "id": commentid,
        "value": 0
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
          <br>
          ${this.data != 0 ? html `
            ${this.data.map(item => html`
<<<<<<< HEAD
            <b><a href="posts.html?pid=${item.post}">${item.title}</a></b>
            <p class="body">${item.content}</p>
            <div>
              <p class="sublikes">Likes: ${item.upvote}, Dislikes: ${item.downvote}</p>
            </div><br>
            `)}
            ` : 
            html`
            <p>No comments blocked yet!</p>
=======
            <b><a href="posts.html?pid=${item.post}">${item.post}: Link</a></b>
            <p class="body">${item.comment}</p>
            <div>
                <button @click="${(e) => this.handleBlock(1, item.cid)}" type="button">Delete comment</button> 
                <button @click="${(e) => this.handleBlock(0, item.cid)}" type="button">Approve comment</button>
            </div><br><br>
            `)}
            ` : 
            html`
            <p>No posts blocked!</p>
>>>>>>> featurePosts
          `}
        `
    }
}


customElements.define('sub-blockedcomments', subBlockedcomments);