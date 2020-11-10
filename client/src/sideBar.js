import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class sideBar extends LitElement {
    
  static styles = css`
  .vertical-menu {
      align-items: stretch
      position: absolute;
      padding: 10px
    }
    
    .vertical-menu a {
      background-color: #FFFFF; /* Grey background color */
      color: black; /* Black text color */
      display: block; /* Make the links appear below each other */
      padding: 12px; /* Add some padding */
      text-decoration: none; /* Remove underline from links */
      text-align: center;
    }
    
    .vertical-menu a:hover {
      background-color: #ccc; 
    }
    
    .vertical-menu a.active {
      background-color: #A9A9A9; 
      color: white;
      text-align: center;   
    }
    `;
  
    static get properties() {
      return {
        loggedIn: {type: Boolean},
      };
    }

    constructor() {
      super();
      this.getLogin();
    }

    getLogin() {
      var userid = localStorage.getItem('userid');
      if (userid !== undefined && userid !== null) {
         this.loggedIn = true;
      } else {
         this.loggedIn = false;
      }
    }

    render() {
        return html`
         <div class="vertical-menu">
         ${this.loggedIn ?
          html`
            <a href="./profile.html" class="active">My Profile</a>
            <a href="">New Post</a>
            <a href="">New Link</a>
          `:
          html`
            <a href="" class="active">Register</a>
          `}
        </div> 
    `;}
}


customElements.define('side-bar', sideBar);