import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class seePost extends LitElement {
    static get properties() {
        return {
            data: {type: Array},
            postId: {type: Number},
            comment: {type: String}
        }
    }

    constructor() {
        super();
        this.postId = 1;
        this.data = [];
        this.getResource();
    }


    refresh(){
        location.reload();
    }

    async getResource() {
        fetch(`http://localhost:8081/posts/${this.postId}`, {
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

    _handleClick() {
      console.log(this.comment);
      let rawData = {
          "comment": this.comment,
          "pid":this.postId,
          "uid":3,
      }
      console.log(rawData);
      fetch('http://localhost:8081/comments', {
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
          console.warn('Something went wrong.', error);
      });
      this.refresh();
     }

    render() {
        return html`
        ${this.data.map(item => html`
                    <div class="post-content">
                      <img src="https://via.placeholder.com/400x150/FFB6C1/000000" alt="post-image" class="img-responsive post-image">
                      <div class="post-container">
                        <img src="https://bootdey.com/img/Content/avatar/avatar6.png" alt="user" class="profile-photo-md pull-left">
                        <div class="post-detail">
                          <div class="user-info">
                            <h5><a href="timeline.html" class="profile-link">Alexis Clark</a> <span class="following">following</span></h5>
                            <p class="text-muted">Published a photo about 7 mins ago</p>
                          </div>
                          <div class="reaction">
                            <a class="btn text-green"><i class="fa fa-thumbs-up" style="color:green"></i> 13</a>
                            <a class="btn text-red"><i class="fa fa-thumbs-down" style="color:red"></i> 0</a>
                          </div>
                          <div class="line-divider"></div>
                          <div class="post-text">
                            <p>${item.content} <i class="em em-anguished"></i> <i class="em em-anguished"></i> <i class="em em-anguished"></i></p>
                          </div>
                          <div class="line-divider"></div>
                          <comments-all></comments-all>
                          <div class="post-comment">
                          <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="" class="profile-photo-sm">
                          <form>
                          <input @input="${(e)=>this.comment=e.target.value}" type="text" class="form-control" placeholder="Post a comment">
                          <button @click="${this._handleClick}" type="submit" id ="button">Publish</button><br>
                          </form>
                        </div>
                      </div>
                    </div>
                   </div>

        `)}
        `
    }
}

customElements.define('see-post', seePost);
