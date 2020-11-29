import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class userRegister extends LitElement {
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
            "email": this.email,
            "password": this.password
        }
        fetch('http://localhost:8081/register', {
            method: 'POST',
            body: JSON.stringify(rawData),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).then(function (response) {
            if (response.ok) {
                console.log("Response OK");
                return response.json();
            }
            return Promise.reject(response);
        }).then(function (data) {
            console.log("Before check");
            if (data) {
                console.log("Registered");
                console.log(data);
                localStorage.setItem("userid", data);
                window.location.href = "./index.html";
            } else {
                console.log("Not registered");
            }
        }).catch(function (error) {
            console.warn('Something went wrong.', error);
        });
    }

    render() {
        return html`
            <link rel="stylesheet" href="./src/styles/login.css">
            <div class="container">
                <h1>Register</h1>
                <div class="textbox">
                    <input @input="${(e)=>this.username=e.target.value}"
                    type="text" placeholder="Username" name="" value="" required>
                </div>
                <div class="textbox">
                    <input @input="${(e)=>this.email=e.target.value}"
                    type="text" placeholder="eMail" name="" value="" required>
                </div>
                <div class="textbox">
                    <input @input="${(e)=>this.password=e.target.value}"
                    type="password" placeholder="Password" name="" value="" required>
                </div>
                <input @click="${this._handleClick}" type="submit" class="btn" type="button" name="" value="Sign Up"></input>
            </div>
        `;
    }
}

customElements.define('user-register', userRegister);