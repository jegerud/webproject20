import { LitElement, html, css } from 'lit-element';

export class profilePage extends LitElement {
    static get properties(){
        return{
            userid: {type: Number},
            loggedIn: {type: Boolean},
            usertype: {type: String},
            username: {type: String},
            current: {type: Number}
        }
    }

    constructor() {
        super();
        this.current = 1;
        this.getUserid();
        this.getUsertype();
    }

    getUserid() {
        this.userid = localStorage.getItem('userid');
        if (this.userid !== undefined && this.userid !== null) {
           this.loggedIn = true;
        } else {
           this.loggedIn = false;
        }
    }

    async getUsertype() {
        fetch(`http://localhost:8081/getUserinfo/${this.userid}`, {
            method: 'GET'})
        .then((response) => response.text())
        .then((responseText) => {
            var user = JSON.parse(responseText);
            this.usertype = user[0].userType;
            this.username = user[0].username;
        })
        .catch((error) => {
            console.log("The data could not be fetched");
            console.error(error);
        });
    }

    static styles = css`
    :host {
        display: block;
    }
    .header {
        padding: 30px;
        text-align: center;
        background: #3983AD;
        color: white;
        font-size: 30px;
        text-transform: uppercase;
        font-family: Avant Garde, Courier, monospace;

    }
    
    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: #f1f1f1;
        font-family: Trebuchet MS, sans-serif;
    }
    
    li {
      float: left;
    }
    
    li a {
      display: block;
      color: black;
      text-align: center;
      padding: 16px;
      text-decoration: none;
    }
    
    li a:hover {
      background-color: #A9A9A9;
    }

    .active, .btn:hover {
        background-color: #A9A9A9;
      }
    `;

    profileClicked() {
        this.current = 1;
    }

    mypostsClicked() {
        this.current = 2;
    }

    mycommentsClicked() {
        this.current = 3;
    }

    requestsClicked() {
        this.current = 4;
    }

    allusersClicked() {
        this.current = 5;
    }

    render() {
        return html`
        <div class="header">
            <h1>${this.username}</h1>
        </div>
        ${this.loggedIn ?
        html`
        <ul>
            <li><a @click="${this.profileClicked}">Profile</a></li>
            <li><a @click="${this.mypostsClicked}">My Posts</a></li>
            <li><a @click="${this.mycommentsClicked}">My Comments</a></li>
            ${this.usertype != "user" ? 
            html`
            <li><a @click="${this.requestsClicked}">Requests</a></li>
            <li><a @click="${this.allusersClicked}">All users</a></li>
            `: html``}
        </ul>
        ${this.current == 1 ?
            html`
                <sub-profile></sub-profile>
            `:html``}
        ${this.current == 2 ?
            html`
                <sub-myposts></sub-myposts>
            `:html``}
        ${this.current == 3 ?
            html`
                <sub-mycomments></sub-mycomments>
            `:html``}
        ${this.current == 4 ?
            html`
                <sub-requests></sub-requests>
            `:html``}
        ${this.current == 5 ?
            html`
                <sub-allusers></sub-allusers>
            `:html``}
        ` :
        html``}
    `;
    }
}

customElements.define('profile-page', profilePage);