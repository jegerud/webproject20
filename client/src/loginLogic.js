import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class userLogin extends LitElement {
    static get properties() {
        return {
            username: {type: String},
            email: {type: String},
            password: {type: String}
        }
    }

    constructor() {
        super();
    }

    _handleClick() {
        let rawData = {
           "username": this.username,
           "password": this.password
        }

        fetch('http://localhost:8081/login', {
        method: 'POST',
        body: JSON.stringify(rawData),
        headers: {
           'Content-Type': 'application/json; charset=UTF-8'
        }
        }).then(function (response) {
        if (response.ok) {
            console.log("Tester json");
            return response.json();
        }
        return Promise.reject(response);
        }).then(function (data) {
        if (data) {
            console.log("Autheticated");
            localStorage.setItem("userid", data);
            window.location.href = "./index.html";
        } else {
            console.log("Not autheticated");
        }
        }).catch(function (error) {
           console.warn('Something went wrong.', error);
        });
    }
    
    

    render() {
        var clicked = false;
        return html`
        <link rel="stylesheet" href="./src/styles/login.css">
        <div class="container">
            <h1>Log in</h1>
            <div class="textbox">
                <input @input="${(e)=>this.username=e.target.value}"
                type="text" placeholder="Username" name="" value="" required>
            </div>
            <div class="textbox">
                <input @input="${(e)=>this.password=e.target.value}"
                type="password" placeholder="Password" name="" value="" required>
            </div>
            <input id="submit" @click="${this._handleClick}" type="submit" class="btn" type="button" name="" value="Sign In"></input>
        </div>
        `;
    }
}

customElements.define('user-login', userLogin);

/*
function wrong() {
    console.log("hey");
    let message = document.getElementById("msg");
    message.style.display= "none";
}
*/