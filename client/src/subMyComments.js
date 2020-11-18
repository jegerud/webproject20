import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class subMycomments extends LitElement {
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
            <h4>
                <a href="posts.html">${item.comment}</a>
            </h4>
            <div><b>Up: <b>${this.upvotes}</div>
            <div><b>Down: <b>${this.downvotes}</div>
            <h4>
              <a href="posts.html">${item.post}</a>
            </h4>
            `)}
            ` : 
            html`
            <p>You haven't commented any post yet</p>
          `}
        `
    }
}


customElements.define('sub-mycomments', subMycomments);