import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class subBlockedposts extends LitElement {
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
      fetch(`http://localhost:8081/blockedposts`, {
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

    handleBlock(mode) {

    }

    render() {
        return html`
          <br>
          ${this.data != 0 ? html `
            ${this.data.map(item => html`
            <b><a href="posts.html?pid=${item.post}">${item.title}</a></b>
            <p class="body">${item.content}</p>
            <div>
                <button @click="${(e) => this.handleBlock(1, item.post)}" type="button">Delete post</button> 
                <button @click="${(e) => this.handleBlock(0, item.post)}" type="button"></button>
            </div><br><br>
            `)}
            ` : 
            html`
            <p>No posts blocked!</p>
          `}
        `
    }
}


customElements.define('sub-blockedposts', subBlockedposts);