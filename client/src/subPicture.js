import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class subPicture extends LitElement {
    static get properties() {
      return {
        userid: {type: Number},
        username: {type: String},
        picture: {type: String}
      };
    }

    static styles = css`
      #profilePicture {
        border-radius: 50%;
        width: 400px;
        height: 400px;
    }
    `
  
    constructor() {
      super();
      this.data = [];
      this.changePassword = 0;
      this.changeEmail = 0;
      this.changeUsername = 0;
      this.getUserid();
      this.getPicture();
    }

    getUserid() {
      this.userid = localStorage.getItem('userid');
    }

    getPicture() {
      fetch(`http://localhost:8081/picture/${this.userid}`, {
         method: 'GET'
     })
     .then((response) => response.text())

     .then((responseText) => {
         var data = JSON.parse(responseText);
         this.picture = data;
     })
     .catch((error) => {
         console.log("The data could not be fetched");
         console.error(error);
     });
   }

    render() {
        return html`
        <img src="${String(this.picture)}" alt="Kunne ikke laste bildet" id="profilePicture">
    `;}
}

customElements.define('sub-picture', subPicture);