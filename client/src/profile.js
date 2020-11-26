import { LitElement, html, css } from 'lit-element';

export class profilePage extends LitElement {
    static get properties(){
        return{
            userid: {type: Number},
            loggedIn: {type: Boolean},
            usertype: {type: String},
            username: {type: String},
            selected: {type: Number}
        }
    }

    constructor() {
        super();
        this.getUserid();
        this.getSelected();
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

    getSelected(){
        var current = this;
        var parameters = location.search.substring(1).split("&");
        var temp = parameters[0].split("=");
        if(temp.length > 1){
            console.log(temp);
            current.selected = unescape(temp[1]);
            console.log(current.selected);
        } else {
            current.selected = 1;
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

    tabClicked(number) {
        this.selected = number;
    }

    render() {
        return html`
        <div class="header">
            <h1>${this.username}</h1>
        </div>
        ${this.loggedIn ?
        html`
        <ul>
            <li><a @click="${(e) => this.tabClicked(1)}">Profile</a></li>
            <li><a @click="${(e) => this.tabClicked(2)}">My Posts</a></li>
            <li><a @click="${(e) => this.tabClicked(3)}">My Comments</a></li>
            ${this.usertype == "admin" ? 
            html`
            <li><a @click="${(e) => this.tabClicked(4)}">Requests</a></li>
            <li><a @click="${(e) => this.tabClicked(5)}">All Users</a></li>
            <li><a @click="${(e) => this.tabClicked(6)}">Blocked Posts</a></li>
            <li><a @click="${(e) => this.tabClicked(7)}">Blocked Comments</a></li>
            `: html``}
        </ul>
        ${this.selected == 1 ?
            html`
                <sub-profile></sub-profile>
            `:html``}
        ${this.selected == 2 ?
            html`
                <sub-myposts></sub-myposts>
            `:html``}
        ${this.selected == 3 ?
            html`
                <sub-mycomments></sub-mycomments>
            `:html``}
        ${this.selected == 4 ?
            html`
                <sub-requests></sub-requests>
            `:html``}
        ${this.selected == 5 ?
            html`
                <sub-allusers></sub-allusers>
            `:html``}
        ${this.selected == 6 ?
            html`
                <sub-blockedposts></sub-blockedposts>
            `:html``}
        ${this.selected == 7 ?
            html`
                <sub-blockedcomments></sub-blockedcomments>
            `:html``}
        ` :
        html``}
    `;
    }
}

customElements.define('profile-page', profilePage);