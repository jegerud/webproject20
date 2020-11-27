import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class subBlockedposts extends LitElement {
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
    .head{
      color: #3983AD;
      font-size: large;
      text-decoration: none;
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
    #approve {
      margin-left: 5px;
    }
    #approve:hover {
      background-color: #66bb6a;
      background: darken(#C06C84,10%);
      box-shadow: 0 4px 17px rgba(0,0,0,0.2);
      transform: translate3d(0, -2px, 0);
    }
    #delete:hover{
      background-color: #f44336;
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
      this.selected = 6;
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
      fetch(`http://localhost:8081/blocked/posts`, {
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

    unblockPost(postid) {
      var url = 'http://localhost:8081/handleblock';
      var rawData = {
        "place": 'posts',
        "type": 'pid',
        "id": postid,
        "value": 0
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

    deletePost(postid) {
      var rawData = {
        "place": 'comments',
        "type": 'post',
        "id": postid,
      }
      
      fetch('http://localhost:8081/deletebypid', {
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

      rawData = {
        "place": 'posts',
        "type": 'pid',
        "id": postid,
      }
      
      fetch('http://localhost:8081/deletebypid', {
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
            <b><a class="head" href="posts.html?pid=${item.pid}">${item.title}, ${item.pid}</a></b>
            <p class="body">${item.content}</p>
            <div>
                <button class="button" @click="${(e) => this.deletePost(item.pid)}" id="delete" type="button">Delete</button> 
                <button class="button" @click="${(e) => this.unblockPost(item.pid)}" id="approve" type="button">Approve</button>
            </div><br>
            `)}
            ` : 
            html`
            <p>No posts blocked!</p>
          `}
        `
    }
}


customElements.define('sub-blockedposts', subBlockedposts);