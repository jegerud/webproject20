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
        changeImage: {type: Number},
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
      this.changeImage = 0;
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
    
    changeImageClicked() {
      this.changeImage = 1;
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

    submitImage(){
        var current = this;
        var file = req.files.uploaded_image;
        let newData = {
          "uid": this.userid,
          "image": this.file.name
        }
        console.log(newData.image);
        if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
          fetch('http://localhost:8081/updateImage', {
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
        } else {
          message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
          res.render('index.ejs',{message: message});
        } 
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
         <link rel="stylesheet" href="./src/styles/subprofile.css">
          ${this.data.map(item => html`
          <div class="userAttributes">
            <p class="username"><b>Username:</b> ${item.username}</p>
            <p class="email"><b>E-mail:</b> ${item.email}</p>
            <p class="usertype"><b>Usertype:</b> ${item.userType}</p>
            ${item.userType == 'user' && item.request == false ? 
            html`
            <input id="submit" @click="${this.handleRequest}" type="submit" 
            class="btn" type="button" name="" value="Handle moderator request"></input>` : html``}
            ${item.userType == 'user' && item.request == true ? 
            html`<p>Moderator request sent!</p>` : html``}
          </div>
          
            ${this.changeUsername == 0 ? 
            html`
            <input id="submit" @click="${this.changeUsernameClicked}" type="submit" 
            class="btn" type="button" name="" value="Change Username"></input>
            ` : html` `}

          </div>${this.changeUsername == 1 ? 
            html`
            <div> 
              <input @input="${(e)=>this.newUsername=e.target.value}"
              type="text" placeholder="New username..." id="newUserName" name="">
              <input id="submit" @click="${this.submitUsername}" type="submit" class="btn_confirm" 
              type="button" name="submitter1" value="Submit"></input>
            </div>
            ` : html` `}
            
          ${this.changeUsername == 2 ? 
            html`
            <div>Username changed!</div>`
            : html` `}<br>
          
          
          ${this.changeEmail == 0 ? 
            html`
            <p><input id="submit" @click="${this.changeEmailClicked}" type="submit" 
            class="btn" type="button" name="" value="Change Email"></input></p>
            ` : html` `}

          <div> ${this.changeEmail == 1 ? 
            html`
            <div><br>
              <input @input="${(e)=>this.newEmail=e.target.value}"
              type="text" placeholder="New e-mail..." id="newEmail" name="oldPass">
              <input id="submit" @click="${this.submitEmail}" type="submit" class="btn_confirm" 
              type="button" name="" value="Submit"></input>
            </div><br>
            ` : html` `}

          ${this.changeEmail == 2 ? 
            html`
            <br><br>
            <div>E-mail changed!</div>`
            : html` `}
          `)}

          <div>
            ${this.changePassword == 0? 
            html`<input id="submit" @click="${this.changePasswordClicked}" type="submit" 
            class="btn" type="button" name="" value="Change Password"></input>
            <br><br>
            `: html` `}

            ${this.changePassword == 1 ? 
            html`
            <br>
            <div> 
              <input @input="${(e)=>this.oldPassword=e.target.value}"
              type="password" placeholder="Old password..." id="oldPass" name="oldPass">
            </div><br>
            <div> 
              <input @input="${(e)=>this.newPassword=e.target.value}"
              type="password" placeholder="New password..." id="newPass" name="newPass">
            </div><br>
            <div> 
              <input @input="${(e)=>this.newPasswordValidate=e.target.value}"
              type="password" placeholder="Confirm new password..." id="newPass2" name="newPass2">
              <input id="submit" @click="${this.submitPassword}" type="submit" class="btn_confirm" 
              type="button" name="" value="submit"></input>
            </div>  
            ` : html` `}

          ${this.changePassword == 2 ? 
            html`
            <br><br>
            <div>Password changed!</div>`
            : html` `}
          </div>

          <div>
            ${this.changeImage == 0? 
            html`<input id="submit" @click="${this.changeImageClicked}" type="submit" 
            class="btn" type="button" name="" value="Change Image"></input>
            <br><br>
            `: html` `}

            ${this.changeImage == 1 ? 
            html`
            <br>
            <div>New Image
              <input @input="${(e)=>this.newImage=e.target.value}"
              type="file" placeholder="" id="newImg" name="newImg">
            </div><br>
            <input id="submit" @click="${this.submitImage}" type="submit" class="btn_confirm" 
              type="button" name="" value="submit"></input>`
            : html` `}

          ${this.changeImage == 2 ? 
            html`
            <br><br>
            <div>Image changed!</div>`
            : html` `}
          </div>
          
          <div id="stats">
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
    `;}
}

customElements.define('sub-profile', subProfile);