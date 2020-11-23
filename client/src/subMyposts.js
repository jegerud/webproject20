import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class subMyposts extends LitElement {
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
        padding-left: 0px;
    }
    .sublikes {
        padding-left: 10px;
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
      fetch(`http://localhost:8081/posts/user/${this.userid}`, {
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

    render() {
        return html`
          <br>
          ${this.data.length != 0 ? 
            html`
            ${this.data.map(item => html`
            <h4>
                <a href="posts.html">${item.title}</a>
            </h4>
            <p class="body">${item.content}</p>
            <div>
              <p class="sublikes">Likes: ${item.upvote}, Dislikes: ${item.downvote}</p>
            </div>
            `)}
            ` : html`
            <p>You haven't posted anything yet</p>
          `}
        `
    }
}


customElements.define('sub-myposts', subMyposts);