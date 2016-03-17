
Login = React.createClass({
  
      submit(){
        console.log(this.refs.email.value);
      if ((this.refs.email.value != "" ) && (this.refs.password.value != "" )){
        Session.set('currentUser',this.refs.email.value);
        $('#loginOptions').modal('hide');
        // this is only for the demo (is bad code)
        $("#userName").text(this.refs.email.value);
        $('#searchMoldalOptions').modal('show');
      }
    },
    render : function() {
       
        return (
      <div className="container">
        <div className="card card-container">
            <img id="profile-img" className="profile-img-card" src="/img/virtuocity.jpg" />
            <p id="profile-name" className="profile-name-card"></p>
           
                <span id="reauth-email" className="reauth-email"></span>
                <input type="email" id="inputEmail" className="form-control" ref="email" placeholder="Username"  autofocus />
                <input type="password" id="inputPassword" className="form-control" ref="password" placeholder="Password"  />
                <div id="remember" className="checkbox">
                    <label>
                        <input type="checkbox" value="remember-me" /> Remember me
                    </label>
                </div>
                <button className="btn btn-lg btn-primary btn-block btn-signin" onClick={this.submit}>Sign in</button>
        </div>
    </div>
        );
    }
});