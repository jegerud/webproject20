import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class menuBar extends LitElement {
   static get properties() {
      return {
        userid: {type: Number},
        loggedIn: {type: Boolean}
      };
   }

   constructor() {
      super();
      this.getUserid();
   }

   getUserid() {
      this.userid = localStorage.getItem('userid');
      if (this.userid !== undefined && this.userid !== null) {
         this.loggedIn = true;
      } else {
         this.loggedIn = false;
      }
      // console.log("User Id  : ", this.userid);
      // console.log("Logged in: ", this.loggedIn);
   }

   logout() {
      this.userid = null;
      localStorage.removeItem('userid');
      this.loggedIn = false;
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
            <a @click="${this.logout}">Log out</a>
            `}
            </div>
         </div>
         `;
   } 
}

customElements.define('menu-bar', menuBar);