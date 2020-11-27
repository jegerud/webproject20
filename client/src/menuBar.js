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
         image: this.picture,
         loggedIn: true
      };
      if(this.loggedIn){this.getPicture();};
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
         this.username = data[0].username.toUpperCase();
     })
     .catch((error) => {
         console.log("The data could not be fetched");
         console.error(error);
     });
   }

   getPicture() {
      fetch(`http://localhost:8081/picture/${this.userid}`, {
         method: 'GET'
     })
     .then((response) => response.text())

     .then((responseText) => {
         var data = JSON.parse(responseText);
         console.log(data);
         this.picture = data;
         console.log(this.picture);
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

   searchFunction() {
      fetch(`http://localhost:8081/posts/${this.title}`, {
         method: 'GET'
     })
     .then((response) => response.text())
     .then((responseText) => {
        console.log(responseText);
         var data = JSON.parse(responseText);
     })
     .catch((error) => {
         console.log("The data could not be fetched");
         console.error(error);
     });

   }

   sendKeyword(){
      var urlString = (window.location.href).toLowerCase();
      var url = new URL(urlString);
      console.log(url);
     location.replace("http://localhost:8080/searchPosts.html?keyword="+this.title)
   }

   render() {
      return html`
      <link rel="stylesheet" href="./src/styles/header.css">
      <div class="header">
         <a href="/" class="logo">Creddit</a>
         ${!this.loggedIn ?
            html` `:
            html`
            <div class="header-pb">
               <img src="${String(this.picture)}" alt=" " id="profilePicture">
            </div> `}
      <div class="header-right">
      <input @input="${(e)=>this.title=e.target.value}" type="Text"  placeholder="Search...">
      <button type="Button" @click="${this.sendKeyword}" id="searchButton">Search</button>
      ${!this.loggedIn ?
         html`
            <a href="./register.html">Register</a>
            <a class="active" href="./login.html">Log in</a> 
         `:
         html`
            
            <a class="loggedin" href="./profile.html">${this.username}</a>
            <a @click="${this.logout}">Log out</a>
            `}
            </div>
         </div>
         `;
   } 
}

customElements.define('menu-bar', menuBar);