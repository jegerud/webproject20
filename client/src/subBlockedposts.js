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
            location.reload();
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
          location.reload();
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
            <b><a href="posts.html?pid=${item.pid}">${item.title}, ${item.pid}</a></b>
            <p class="body">${item.content}</p>
            <div>
                <button @click="${(e) => this.deletePost(item.pid)}" type="button">Delete post</button> 
                <button @click="${(e) => this.unblockPost(item.pid)}" type="button">Approve post</button>
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