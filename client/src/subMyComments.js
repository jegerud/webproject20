import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class subMycomments extends LitElement {
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
      console.log("Ready to fetch");
      fetch(`http://localhost:8081/comments/user/${this.userid}`, {
          method: 'GET'
      })
      .then((response) => response.text())
      .then((responseText) => {
          this.data = JSON.parse(responseText);
          console.log(this.data);
      })
      .catch((error) => {
          console.log("The data could not be fetched");
          console.error(error);
      });
    }

    render() {
        return html`
          <br>
          ${this.data != 0 ? html `
            ${this.data.map(item => html`
            <b><a href="posts.html?pid=${item.post}">Link to post ${item.post}</a></b>
            <p class="body">${item.comment}</p>
            <div>
              <p class="sublikes">Likes: ${item.upvote}, Dislikes: ${item.downvote}</p>
            </div><br>
            `)}
            ` : 
            html`
            <br><p>You haven't commented any post yet</p>
          `}
        `
    }
}


customElements.define('sub-mycomments', subMycomments);