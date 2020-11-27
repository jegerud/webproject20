import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class subMyposts extends LitElement {
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
        font-size: large;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .head {
    color: #3983AD;

    }
    .body {
        padding-left: 0px;
        
    }
    .sublikes {
        padding-left: 0px;
    }

    #delete{
      margin-top: 15px; 
      display: inline;
      outline: none;
      font-size: small;
      border-radius: 500px;
      justify-content: center;
      cursor: pointer;
      text-transform: uppercase;
      height: 30px;
      width: 80px;
      opacity: 0.9;
      background-color: #ffffff;
      border: 1px solid black;
    }
    #delete:hover{
      background-color: #f44336;
      background: darken(#C06C84,10%);
      box-shadow: 0 4px 17px rgba(0,0,0,0.2);
      transform: translate3d(0, -2px, 0);
    }
    .poststats {
      display: inline;
    }
    `;

    constructor() {
      super();
      this.data = [];
      this.getUserid();
      this.getSorting();
      this.getResource();
    }

    getSorting(){
      var current = this;
      var parameters = location.search.substring(1).split("&");
      if(parameters.length > 1){
          var temp = parameters[1].split("=");
          current.selected = unescape(temp[1]);
          console.log(current.selected);
      } else {
          current.selected = 1;
      }
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

    deletePost(postid) {
      var current = this;
      var rawData = {
        "place": 'comments',
        "type": 'post',
        "id": postid
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
          console.log("Comments deleted!");
      }).catch(function (error) {
          console.warn('Something went wrong.', error);
      });

      rawData = {
        "place": 'posts',
        "type": 'pid',
        "id": postid
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
          console.log("Deleting posts");
          location.replace(`profile.html?val=2`);
      }).catch(function (error) {
          console.warn('Something went wrong.', error);
      });
    }

    render() {
        return html`
          <br>
          ${this.data.length != 0 ? 
            html`
            ${this.data.map(item => html`
            <h4>
                <a class = "head" href="posts.html">${item.title}</a>
            </h4>
            <p class="body">${item.content}</p>
            <div class = "poststats">
              <p class="sublikes">Likes: ${item.upvote} | Dislikes: ${item.downvote}
              <br><button class="button" @click="${(e) => this.deletePost(item.pid)}" type="button" id ="delete">Delete</button></p>
            </div>
            `)}
            ` : html`
            <p>You haven't posted anything yet</p>
          `}
        `
    }
}


customElements.define('sub-myposts', subMyposts);