import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class subMyposts extends LitElement {
    static get properties() {
      return {
        loggedIn: {type: Boolean},
        userid: {type: Number},
        data: {type: Array}
      };
    }

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
          console.log(this.data);
      })
      .catch((error) => {
          console.log("The data could not be fetched");
          console.error(error);
      });
    }

    render() {
        return html`
          ${this.data.map(item => html`
          <h4>
              <a href="posts.html">${item.title}</a>
          </h4>
          <p>${item.content}</p>
          <br>`)}
        `
    }
}


customElements.define('sub-myposts', subMyposts);