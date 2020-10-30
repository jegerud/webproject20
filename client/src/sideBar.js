import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class sideBar extends LitElement {

    static styles = css`
    .vertical-menu {
        width: 170px; /* Set a width if you like */
        position: absolute;
        padding: 20px
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
        background-color: #ccc; /* Dark grey background on mouse-over */
      }
      
      .vertical-menu a.active {
        background-color: #A9A9A9; /* Add a green color to the "active/current" link */
        color: white;
        text-align: center;
      }
    `;

    render() {
        return html`
         <div class="vertical-menu">
         <a href="" class="active">My Profile</a>
         <a href="">New Post</a>
         <a href="">New Link</a>
</div> 
    `;}
}


customElements.define('side-bar', sideBar);