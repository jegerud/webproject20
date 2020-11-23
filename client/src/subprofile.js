import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class subProfile extends LitElement {
    static get properties() {
      return {
        loggedIn: {type: Boolean},
        userid: {type: Number},
        data: {type: Array},
        changePassword: {type: Number},
        changeEmail: {type: Number},
        changeUsername: {type: Number},
        oldPassword: {type: String},
        newPassword: {type: String},
        newPasswordValidate: {type: String},
        newEmail: {type: String},
        newUsername: {type: String},
        nrPost: {type: Number},
        nrComments: {type: Number},
        nrLikes: {type: Number}
      };
    }

    constructor() {
      super();
      this.data = [];
      this.changePassword = 0;
      this.changeEmail = 0;
      this.changeUsername = 0;
      this.getUserid();
      this.getResource();
      this.getPostScores();
      this.getCommentScores();
      this.getLikesScores();
    }

    getUserid() {
      this.userid = localStorage.getItem('userid');
      if (this.userid !== undefined && this.userid !== null) {
         this.loggedIn = true;
      } else {
         this.loggedIn = false;
      }
    }

    async getResource() {
      fetch(`http://localhost:8081/getUserinfo/${this.userid}`, {
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

    async getPostScores() {
      fetch(`http://localhost:8081/getUserPostScore/${this.userid}`, {
        method: 'GET'
      })
      .then((response) => response.text())
      .then((responseText) => {
        this.nrPost = JSON.parse(responseText);
      })
      .catch((error) => {
        console.log("The data could not be fetched");
        console.error(error);
      });
    }

    async getCommentScores() {
      fetch(`http://localhost:8081/getUserCommentScore/${this.userid}`, {
        method: 'GET'
      })
      .then((response) => response.text())
      .then((responseText) => {
        this.nrComments = JSON.parse(responseText);
      })
      .catch((error) => {
        console.log("The data could not be fetched");
        console.error(error);
      });
    }

    async getLikesScores() {
      fetch(`http://localhost:8081/getUserLikesScore/${this.userid}`, {
        method: 'GET'
      })
      .then((response) => response.text())
      .then((responseText) => {
        this.nrLikes = JSON.parse(responseText);
      })
      .catch((error) => {
        console.log("The data could not be fetched");
        console.error(error);
      });
    }

    changePasswordClicked() {
      this.changePassword = 1;
    }
    
    changeEmailClicked() {
      this.changeEmail = 1;
    }

    changeUsernameClicked() {
      this.changeUsername = 1;
    }

    submitPassword() {
      var current = this;
      let validateData = {
        "uid": this.userid,
        "oldpassword": this.oldPassword
      }

      if (this.newPassword == this.newPasswordValidate) {
        console.log("Password matches");
        fetch('http://localhost:8081/validate', {
          method: 'POST',
          body: JSON.stringify(validateData),
          headers: {
             'Content-Type': 'application/json; charset=UTF-8'
          }
        }).then(function (response) {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(response);
        }).then(function (data) {
        if (data) {
          current.updatePassword();
        } else {
          alert("Something went wrong. Please try again!");
        }
        }).catch(function (error) {
           console.warn('Something went wrong.', error);
        });
      }
    }

    updatePassword() {
      var current = this;
      let newData = {
        "uid": this.userid,
        "password": this.newPassword
      }
      fetch('http://localhost:8081/updatePassword', {
        method: 'POST',
        body: JSON.stringify(newData),
        headers: {
           'Content-Type': 'application/json; charset=UTF-8'
        }
      }).then(function (response) {
      if (response.ok) {
          return response.json();
      }
      return Promise.reject(response);
      }).then(function (data) {
      if (data) {
        current.changePassword = 2;
      } else {
        alert("Current password not correct!");
      }
      }).catch(function (error) {
         console.warn('Something went wrong.', error);
      });
    }

    submitEmail() {
      var current = this;
      let newData = {
        "uid": this.userid,
        "email": this.newEmail
      }
      fetch('http://localhost:8081/updateEmail', {
        method: 'POST',
        body: JSON.stringify(newData),
        headers: {
           'Content-Type': 'application/json; charset=UTF-8'
        }
      }).then(function (response) {
      if (response.ok) {
          return response.json();
      }
      return Promise.reject(response);
      }).then(function (data) {
      if (data) {
        current.changeEmail = 2;
      } else {
        alert("Something went wrong, please try again later!");
      }
      }).catch(function (error) {
         console.warn('Something went wrong.', error);
      }); 
    }

    submitUsername() {
      var current = this;
      let newData = {
        "uid": this.userid,
        "username": this.newUsername
      }
      console.log(newData);
      fetch('http://localhost:8081/updateUsername', {
        method: 'POST',
        body: JSON.stringify(newData),
        headers: {
           'Content-Type': 'application/json; charset=UTF-8'
        }
      }).then(function (response) {
      if (response.ok) {
          return response.json();
      }
      return Promise.reject(response);
      }).then(function (data) {
      if (data) {
        current.changeUsername = 2;
      } else {
        alert("Something went wrong, please try again later!");
      }
      }).catch(function (error) {
         console.warn('Something went wrong.', error);
      }); 
    }

    handleRequest() {
      var current = this;
      let newData = {
        "uid": this.userid,
      }
      fetch('http://localhost:8081/sendModeratorrequest', {
        method: 'POST',
        body: JSON.stringify(newData),
        headers: {
           'Content-Type': 'application/json; charset=UTF-8'
        }
      }).then(function (response) {
      if (response.ok) {
          return response.json();
      }
      return Promise.reject(response);
      }).then(function (data) {
      if (data) {
        console.log("Request sent");
        location.reload();
      } else {
        alert("Something went wrong, please try again later!");
      }
      }).catch(function (error) {
         console.warn('Something went wrong.', error);
      }); 
    }

    render() {
        return html`
          <br>
          ${this.data.map(item => html`
          <div>
            <b>Username:</b> 
            <p>${item.username} <input id="submit" @click="${this.changeUsernameClicked}" type="submit" 
            class="btn" type="button" name="" value="Change Username"></input>
            </p>
          </div><br>
          <div>
            <b>Email:</b> 
            <p>${item.email} <input id="submit" @click="${this.changeEmailClicked}" type="submit" 
            class="btn" type="button" name="" value="Change Email"></input>
            </p>
          </div>
          <div><br>
            <b>Usertype:</b>
            <p>${item.userType}</p>
            ${item.userType == 'user' && item.request == false ? 
            html`
            <input id="submit" @click="${this.handleRequest}" type="submit" 
            class="btn" type="button" name="" value="Handle moderator request"></input>` : html``}
            ${item.userType == 'user' && item.request == true ? 
            html`<p>Moderator request sent!</p>` : html``}
          </div><br>
          `)}
          <div>
            <b>Change Password <input id="submit" @click="${this.changePasswordClicked}" type="submit" 
            class="btn" type="button" name="" value="Change"></input>
            </b>
          </div>
          <div>
            <p>
              <b>Number of posts:</b>
              ${this.nrPost}
            </p>
            <p>
              <b>Number of comments:</b>
              ${this.nrComments}
            </p>
            <p>
              <b>Number of likes:</b>
              ${this.nrLikes}
            </p>
          </div>
          
          ${this.changeUsername == 1 ? 
            html`
            <br><br>
            <div>New username 
              <input @input="${(e)=>this.newUsername=e.target.value}"
              type="text" placeholder="" id="oldPass" name="oldPass">
            </div><br>
            <input id="submit" @click="${this.submitUsername}" type="submit" class="btn" 
              type="button" name="" value="Change Username"></input>
            ` : html` `}
          ${this.changeUsername == 2 ? 
            html`
            <br><br>
            <div>Username changed!</div>`
            : html` `}

          ${this.changeEmail == 1 ? 
            html`
            <br><br>
            <div>New Email 
              <input @input="${(e)=>this.newEmail=e.target.value}"
              type="text" placeholder="" id="oldPass" name="oldPass">
            </div><br>
            <input id="submit" @click="${this.submitEmail}" type="submit" class="btn" 
              type="button" name="" value="Change Email"></input>
            ` : html` `}
          ${this.changeEmail == 2 ? 
            html`
            <br><br>
            <div>Email changed!</div>`
            : html` `}

          ${this.changePassword == 1 ? 
            html`
            <br><br>
            <div>Old Password 
              <input @input="${(e)=>this.oldPassword=e.target.value}"
              type="password" placeholder="" id="oldPass" name="oldPass">
            </div><br>
            <div>New Password 
              <input @input="${(e)=>this.newPassword=e.target.value}"
              type="password" placeholder="" id="newPass" name="newPass">
            </div><br>
            <div>New Password 
              <input @input="${(e)=>this.newPasswordValidate=e.target.value}"
              type="password" placeholder="" id="newPass2" name="newPass2">
            </div><br>
            <input id="submit" @click="${this.submitPassword}" type="submit" class="btn" 
              type="button" name="" value="Set Password"></input>` 
            : html` `}
          ${this.changePassword == 2 ? 
            html`
            <br><br>
            <div>Password changed!</div>`
            : html` `}
    `;}
}

customElements.define('sub-profile', subProfile);