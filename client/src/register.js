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
        console.log("Button clicked");
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
            console.log("This didnt work");
            // console.warn('Something went wrong.', error);
        });
    }

    render() {
        return html`
            <input @input="${(e)=>this.username=e.target.value}" 
                type="text" placeholder="username" id="username" name="username"><br>
            <input @input="${(e)=>this.email=e.target.value}" 
                type="text" placeholder="email" id="email" name="email"><br>
            <input @input="${(e)=>this.password=e.target.value}" 
                type="password" placeholder="password" id="password" name="password"><br>
            <button @click="${this._handleClick}" type="button">Publish</button><br>
        `;
    }
}

customElements.define('user-register', userRegister);
