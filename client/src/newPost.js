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
    .button {

        outline: none;
        font-size: small;
        border-radius: 500px;
        justify-content: center;
        cursor: pointer;
        text-transform: uppercase;
        height: 30px;
        width: 100px;
        opacity: 1;
        border: none;
    }
    #title[type=text] {
        border-width: thin;
        box-sizing:border-box;
        float: left;
        padding: 6px;
        border-radius: 5px;
        margin-right: 5px;
        margin-top: 9px;
        font-size: 16px;
        width: 50%;
      }

    #content {
        float: left;
        border-width: thin;
        padding: 10px;
        border-radius: 5px;
        margin-right: 5px;
        margin-top: 9px;
        font-size: 13px;
        height:90px;
        width: 100%;
        box-sizing:border-box;
        resize: none;
      }
      #publish {
        margin-top: 15px; 
      }

      #publish:hover{
        background-color: #3983AD;
        color: white;
        background: darken(#C06C84,10%);
        box-shadow: 0 4px 17px rgba(0,0,0,0.2);
        transform: translate3d(0, -2px, 0);
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
                <button class="button" id="publish" @click="${this._handleClick}" type="button">Publish</button>
            </form>` :
            html``}
        `;
    }
}

customElements.define('new-post', newPost);
