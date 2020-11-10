import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class menuBar extends LitElement {
   static get properties() {
      return {
        userid: {type: Number},
        loggedIn: {type: Boolean},
        username: {type: String}
      };
   }

   constructor() {
      super();
      this.getUserid();
      this.getUserName();
      window.currentUser = {
         id: this.id,
         name: this.username,
         email: this.email,
         loggedIn: true
      };
   }

   getUserid() {
      this.userid = localStorage.getItem('userid');
      if (this.userid !== undefined && this.userid !== null) {
         this.loggedIn = true;
      } else {
         this.loggedIn = false;
      }
   }

   getUserName() {
      fetch(`http://localhost:8081/getUsername/${this.userid}`, {
         method: 'GET'
     })
     .then((response) => response.text())
     .then((responseText) => {
         var data = JSON.parse(responseText);
         this.username = data[0].username;
     })
     .catch((error) => {
         console.log("The data could not be fetched");
         console.error(error);
     });
   }

   logout() {
      this.userid = null;
      localStorage.removeItem('userid');
      this.loggedIn = false;
      currentUser = null;
      location.reload();
   }

   render() {
      return html`
      <link rel="stylesheet" href="./src/styles/header.css">
      <div class="header">
      <a href="/" class="logo">Creddit</a>
      <div class="header-right">
      ${!this.loggedIn ?
         html`
            <a href="./register.html">Register</a>
            <a class="active" href="./login.html">Log in</a> 
         `:
         html`
            <a class="loggedin" href="">${this.username}</a>
            <a @click="${this.logout}">Log out</a>
            `}
            </div>
         </div>
         `;
   } 
}

customElements.define('menu-bar', menuBar);