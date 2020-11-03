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
                // return response.json();
                return console.log('User authenticated');
            }
            return Promise.reject(response);
        // }).then(function (data) {
        //     console.log(data);
        }).catch(function (error) {
            console.warn('Something went wrong.', error);
        });
    }

    render() {
        return html`
            <input @input="${(e)=>this.username=e.target.value}" 
                type="text" placeholder="username" id="username" name="username"><br>
            <input @input="${(e)=>this.password=e.target.value}" 
                type="password" placeholder="password" id="password" name="password"><br>
            <button @click="${this._handleClick}" type="button">Publish</button><br>
        `;
    }
}

customElements.define('user-login', userLogin);
