import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class subBlockedcomments extends LitElement {
    static get properties() {
      return {
        loggedIn: {type: Boolean},
        userid: {type: Number},
        data: {type: Array},
        selected: {type: Number}
      };
    }

    static styles = css`
    :host {
        display: block;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .head {
      text-decoration: none;
      color: #3983AD;
    }
    .body {
        padding-left: 20px;
    }
    .sublikes {
        padding-left: 20px;
        font-size: 13px;
    }
    .button {
      display: inline;
      outline: none;
      font-size: x-small;
      border-radius: 500px;
      justify-content: center;
      cursor: pointer;
      text-transform: uppercase;
      height: 30px;
      width: 100px;
      opacity: 1;
      border: none;
    }
    #delete:hover{
      background-color: #f44336;
      background: darken(#C06C84,10%);
      box-shadow: 0 4px 17px rgba(0,0,0,0.2);
      transform: translate3d(0, -2px, 0);
    }
    #approve:hover{
      background-color: #66bb6a;
      background: darken(#C06C84,10%);
      box-shadow: 0 4px 17px rgba(0,0,0,0.2);
      transform: translate3d(0, -2px, 0);
    }
    `;

    constructor() {
      super();
      this.data = [];
      this.getUserid();
      this.getResource();
      this.selected = 7;
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
      var current = this;
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
            location.replace(`profile.html?val=${current.selected}`);
        }).catch(function (error) {
            console.warn('Something went wrong.', error);
        });
    }

    render() {
        return html`
          <br>
          ${this.data != 0 ? html `
            ${this.data.map(item => html`
            <b><a class="head" href="posts.html?pid=${item.post}">${item.post}: Link</a></b>
            <p class="body">${item.comment}</p>
            <div>
                <button class="button" @click="${(e) => this.handleBlock(1, item.cid)}" id="delete" type="button">Delete</button> 
                <button class="button" @click="${(e) => this.handleBlock(0, item.cid)}" id="approve" type="button">Approve</button>
            </div><br><br>
            `)}
            ` : 
            html`
            <p>No comments blocked!</p>
          `}
        `
    }
}


customElements.define('sub-blockedcomments', subBlockedcomments);