import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class subAllusers extends LitElement {
    static get properties() {
        return {
            data: {type: Array},
            userid: {type: Number},
            user: {type: Object},
        }
    }

    constructor() {
        super();
        this.data = [];
        this.getResource();
        this.getUserid();
        this.getUsername();
    }

    getUserid() {
        this.userid = localStorage.getItem('userid');
        if (this.userid !== undefined && this.userid !== null) {
           this.loggedIn = true;
        } else {
           this.loggedIn = false;
        }
    }

    getUsername() {
        fetch(`http://localhost:8081/getUsername/${this.userid}`, {
            method: 'GET'
        })
        .then((response) => response.text())
        .then((responseText) => {
            this.user = JSON.parse(responseText);
        })
        .catch((error) => {
            console.log("The data could not be fetched");
            console.error(error);
        });

    }

    async getResource() {
        fetch('http://localhost:8081/getUsers', {
            method: 'GET'
        })
        .then((response) => response.text())
        .then((responseText) => {
            this.data = JSON.parse(responseText);
        })
        .catch((error) => {
            console.log("The data could not be fetched");
            console.error(error);
        });
    }

    deleteUser(text) {
        var current = this;
        console.log(text, " will be deleted");
        fetch(`http://localhost:8081/getUserid/${text}`, {
            method: 'GET',
        }).then(function (response) {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(response);
        }).then(function (data) {
            console.log(data);
            current.deleteComments(data, text);
    
        }).catch(function (error) {
            console.warn('Something went wrong.', error);
        });
    }

    deleteComments(uid, text) {
        var current = this;
        let rawData = {
            "userid": uid
        }
        fetch('http://localhost:8081/deletecomments', {
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
            console.log(text, "'s comments deleted");
        }).catch(function (error) {
            console.warn('Something went wrong.', error);
        });

        fetch('http://localhost:8081/deleteposts', {
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
            console.log(text, "'s posts deleted");
        }).catch(function (error) {
            console.warn('Something went wrong.', error);
        });

        fetch('http://localhost:8081/deleteuser', {
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
            console.log(text, " deleted");
            location.reload();
        }).catch(function (error) {
            console.warn('Something went wrong.', error);
        });
    }

    render() {
      return html`
      <br>
      ${this.data.map(item => html`
        <a>Username:  ${item.username}</a><br>
        <a>User Type: ${item.userType}</a><br>
        ${item.username != this.user[0].username ? 
            html`
            <input id="submit" @click="${() => this.deleteUser(item.username)}" type="submit" 
            class="btn" type="button" name="" value="Delete user"></input>
        ` : 
        html``}
      <br><br>`)}
    `
    ;}
}


customElements.define('sub-allusers', subAllusers);