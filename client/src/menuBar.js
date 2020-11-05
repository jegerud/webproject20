import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class menuBar extends LitElement {

    render() {
       return html`
    <link rel="stylesheet" href="./src/styles/header.css">
    <div class="header">
     <a href="/" class="logo">Creddit</a>
   <div class="header-right">
    <a href="./register.html">Sign up</a>
    <a class="active" href="./login.html">Log in</a>
   </div>
   </div> 
      `;
    }
}

customElements.define('menu-bar', menuBar);