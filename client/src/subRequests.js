import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class subRequests extends LitElement {
    static get properties() {
      return {
        loggedIn: {type: Boolean},
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
    `;

    constructor() {
      super();
      this.getAllRequests();
    }

    async getAllRequests() {
      var current = this;
      fetch(`http://localhost:8081/seeAllRequests`, {
        method: 'GET'
      })
      .then((response) => response.text())
      .then((responseText) => {
        current.data = JSON.parse(responseText);
      })
      .catch((error) => {
        console.log("The data could not be fetched");
        console.error(error);
      });
    }

    handleRequest(uid, mode) {
      let rawData = {
        "uid": uid
      }
      var url = '';

      if(mode == 1) {
        url = 'http://localhost:8081/approveRequest';
      } else {
        url = 'http://localhost:8081/disapproveRequest';
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
          location.reload();
      }).catch(function (error) {
          console.warn('Something went wrong.', error);
      });
    }

    render() {
      return html`
      ${this.data.length != 0 ? 
      html`
        ${this.data.map(item => html`
        <br><b>UserID: ${item.uid}</b> 
        <p class="body">Username: ${item.username}</p>
        <p class="body">${item.email}</p>
        <div class="body">
          <button @click="${(e)=>this.handleRequest(item.uid, 1)}" type="submit">Approve</button>
          <button @click="${(e)=>this.handleRequest(item.uid, 0)}" type="submit">Disapprove</button> 
        </div>
        `)}
      ` : 
      html`
        <br>
        <p class="body">No request handled in!</p>
      `}
    `;}
}


customElements.define('sub-requests', subRequests);