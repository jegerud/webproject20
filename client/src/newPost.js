import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class newPost extends LitElement {
    static get properties() {
        return {
            title: {type: String},
            content: {type: String},
            userid: {type: Number},
            loggedIn: {type: Boolean}
        }
    }

    static styles = css`
    #content
    {
        height:90px;
        width: 100%;
        box-sizing:border-box;
    }

    #title
    {
        border-radius: 0.5px;
        box-sizing:border-box;
    }
    `

    constructor() {
        super();
        this.getUserid();
    }

    getUserid() {
        this.userid = localStorage.getItem('userid');
        if (this.userid !== undefined && this.userid !== null) {
           this.loggedIn = true;
        } else {
           this.loggedIn = false;
        }
     }
    
    _handleClick() {
        let rawData = {
            "title": this.title,
            "content": this.content,
            "uid": this.userid
        }

        fetch('http://localhost:8081/posts', {
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
            console.log(data);
            location.reload();
        }).catch(function (error) {
            console.warn('Something went wrong.', error);
        });
    }

    render() {
        return html`
        ${this.loggedIn ?
            html`
            <form>
                <input
                    @input="${(e)=>this.title=e.target.value}"
                    type="text" placeholder="Title" id="title" name="title"><br><br>
                <textarea
                    @input="${(e)=>this.content=e.target.value}"
                    id="content"placeholder="Text (Optional)"></textarea>
                <button @click="${this._handleClick}" type="button">Publish</button><br>
                <br><br>
            </form>` :
            html``}
        `;
    }
}

customElements.define('new-post', newPost);
