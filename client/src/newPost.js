import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class newPost extends LitElement {
    static get properties() {
        return {
            title: {type: String},
            content: {type: String},
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
    }

    _handleClick() {
        let rawData = {
            "title": this.title,
            "content": this.content, 
            "uid":3
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
        }).catch(function (error) {
            //console.log("Fuck, shit happened")
            console.warn('Something went wrong.', error);
        });       
    }

    render() {
        return html`
        <form>
            <input 
                @input="${(e)=>this.title=e.target.value}"
                type="text" placeholder="Title" id="title" name="title"><br><br>
            <textarea
                @input="${(e)=>this.content=e.target.value}" 
                id="content"placeholder="Text (Optional)"></textarea>
            <button @click="${this._handleClick}" type="button">Publish</button><br>
            <br><br>
        </form> 
        `;
    }
}

customElements.define('new-post', newPost);