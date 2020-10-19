import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class newPost extends LitElement {
    static get properties() {
        return {
            title: {type: String},
            content: {type: String}
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

    publishPost() {
        let _data = {
            title: "foo",
            content: "bar", 
            uid:1
        }
        
        fetch('http://localhost:8081/posts', {
            method: "POST",
            body: JSON.stringify({
                title: 'Title of post',
                content: 'This is the content of the post',
                uid: 4
              }),
              headers: {
                "Content-type": "application/json; charset=UTF-8"
              }
        }).then(function (response) {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(response);
        }).then(function (data) {
            console.log(data);
        }).catch(function (error) {
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
            <button @click="${this.publishPost()}">Publish</button>
            <br><br>
        </form> 
        `;
    }
}

customElements.define('new-post', newPost);