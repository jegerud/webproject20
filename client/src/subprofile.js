import { LitElement, html, css } from '../node_modules/lit-element/lit-element';

export class subProfile extends LitElement {
    static get properties() {
      return {
        loggedIn: {type: Boolean},
        userid: {type: Number},
        data: {type: Array},
        changePassword: {type: Number},
        oldPassword: {type: String},
        newPassword: {type: String},
        newPasswordValidate: {type: String}
      };
    }

    constructor() {
      super();
      this.data = [];
      this.changePassword = 0;
      this.getUserid();
      this.getResource();
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
          console.log(this.data);
      })
      .catch((error) => {
          console.log("The data could not be fetched");
          console.error(error);
      });
    }

    changePasswordClicked() {
      this.changePassword = 1;
    }

    passwordUpdated() {
      console.log("Password updated");
      this.changePassword = 2;
    }

    submitPassword() {
      let validateData = {
        "uid": this.userid,
        "password": this.oldPassword
      }

      console.log(this);

      if (this.newPassword == this.newPasswordValidate) {
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
            console.log("Update password ready");
            // this.updatePassword();
          } else {
              alert("Current password not correct!");
          }
          }).catch(function (error) {
             console.warn('Something went wrong.', error);
          });
        }
        else {
          alert("Password didn't match, please try again!");
        }
    }

    updatePassword() {
      console.log("Ready to update password");
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
            this.passwordUpdated();
          } else {
              alert("Current password not correct!");
          }
          }).catch(function (error) {
             console.warn('Something went wrong.', error);
          });

    }

    render() {
        return html`
          <p>Nr 1</p>
          <input id="submit" @click="${this.changePasswordClicked}" type="submit" class="btn" type="button" name="" value="Change Password"></input>
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
          <input id="submit" @click="${this.submitPassword}" type="submit" class="btn" type="button" name="" value="Set Password"></input>
          ` : html` `}
          ${this.changePassword == 2 ? 
            html`
            <br><br>
            <div>Password changed!</div>`
            : html` `}
    `;}
}

customElements.define('sub-profile', subProfile);