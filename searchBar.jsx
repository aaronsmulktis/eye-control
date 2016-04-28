// Seach nav-bar component
SearchBar = React.createClass({
       getInitialState() {
        return {
            // state enable when the modal more options is show
            openMoreOptions : false,
            // state contains
            options : {}
        }
    },
    // This function handled the instant seach event
    handleChange: function() {
      //copy this to access in the time out function
      var _this = this;
      // the select update need time, when trigger onChange late to update the value
      setTimeout(function() { 
        // this object contains all search filters
        let option = {
             text : _this.refs.searchMapInput.value,
             types : _this.refs.types.value,
             currency : _this.refs.currency.state.value,
             minValue : _this.refs.min.state.value,
             maxValue : _this.refs.max.state.value,
             numBedrooms : _this.refs.bedrooms.state.value,
             numBathrooms : _this.refs.baths.state.value
         }
         // set state for keep values after render
        _this.setState({options:option});   
        // 
        _this.props.onUserInput(option);
        // success
        return true;
      }, 100);
     
},
updateObjCall : function(obj){
  this.setState({callbackObj: obj});
},
 searchModalCallback: function(){
         var result = this.state.callbackObj;

             /* text : _this.refs.searchMapInput.value + " " ,
             types : _this.refs.types.value,
             currency : _this.refs.currency.state.value,
             minValue : _this.refs.min.state.value,
             maxValue : _this.refs.max.state.value,
             numBedrooms : _this.refs.bedrooms.state.value,
             numBathrooms : _this.refs.baths.state.value
         */
         // set state for keep values after render
        _this.setState({options:option}); 
       },

  render: function() {
      let modalOptions = {
          title: "Search Items",
          optButton:"Edit Search Radius",
          optButtonIcon:"glyphicon glyphicon-map-marker",
          opt2Button:"Save Search",
          opt2ButtonIcon:"glyphicon glyphicon-star",
          doneButton:"View Results",
          doneButtonIcon:"glyphicon glyphicon-eye-open",
      };
       let loginOptions = {
          title: "Login",
           noFooter:true,
           class: "modal-login"
       };

    return (
        <div>
          <div id="searchOptions" className="col-sm-12">
              <div id="searchMap" className="row">
                  <div className="col-xs-12 col-lg-4">
                      <form className="row" role="search" action="javascript:;">
                          <div className="col-xs-12 col-md-6 col-lg-12">
                              <div className="input-group">
                                  <div className="input-min input-group-addon ">UK</div>
                                  <input ref="searchMapInput" id="searchMapInput" type="text" className="font4 form-control input-min" placeholder="Enter Address, City, State or ZIP" onChange={this.handleChange}></input>
                                  <div className="input-group-addon input-min"><i className="glyphicon glyphicon-search"/></div>
                              </div>
                          </div>
                 
                          <div className="col-xs-12 col-md-6 col-lg-12">
                              <div className="search-radios row">
                                  <div className="col-xs-4"><div className="radio"><label> <input className="font4 input-min" type="radio" ref="types" name="types" id="types-all" onChange={this.handleChange} value="all" /> All </label></div></div>
                                  <div className="col-xs-4"><div className="radio"><label> <input className="font4 input-min" type="radio" ref="types" name="types" id="types-sale" onChange={this.handleChange} value="sale"/> For Sale </label></div></div>
                                  <div className="col-xs-4"><div className="radio"><label> <input className="font4 input-min" type="radio" ref="types" name="types" id="types-rent" onChange={this.handleChange} value="rent"/> For Rent  </label></div></div>
                              </div>
                          </div>
                      </form> 
                  </div>
                  <div id="currencyOptions" className="col-xs-12 col-sm-6 col-lg-4">
                      <Select value={this.state.options.currency} name="currency" ref="currency"  id="currency" placeholder="Usd" options={SearchOptions.get('currencies').toArray()} onChange={this.handleChange}/>
                      <Select  value={this.state.options.minValue}  name="min" ref="min" id="min" placeholder="No Min" options={SearchOptions.get('minValue').toArray()} onChange={this.handleChange}/>
                      <label className="middle-label">to </label>
                      <Select value={this.state.options.maxValue}  name="max" ref="max" id="max" placeholder="No Max" options={SearchOptions.get('maxValue').toArray()} onChange={this.handleChange}/>
                  </div>
              
                  <div id="propOptions" className="col-xs-12 col-sm-6 col-lg-4">
                      <Select value={this.state.options.numBedrooms} name="bedrooms" id="bedrooms" ref="bedrooms" placeholder="Beds" options={SearchOptions.get('bedOptions').toArray()} onChange={this.handleChange}/>
                      <Select value={this.state.options.numBathrooms} name="baths" ref="baths" id="baths" placeholder="Baths" options={SearchOptions.get('bathOptions').toArray()} onChange={this.handleChange}/>
                      <label className="middle-label" onClick={this.moreOptions}>More <i className="glyphicon glyphicon-plus-sign"/> </label>
                  </div>

              </div>
       
        </div>
         <Modal options={modalOptions} callback={this.searchModalCallback} objCall={this.searchModalObjCall} id="searchMoldalOptions" ref="searchMoldalOptions">
            <MoreOptionsModal callback={this.searchModalCallback}  updateObjCall={this.updateObjCall}/>
         </Modal>
         <Modal options={loginOptions} id="loginOptions" ref="loginOptions">
            <Login/>
         </Modal>
      </div>
    );
  },
    moreOptions : function(){
      if (Session.get('currentUser')){
        this.refs.searchMoldalOptions.open("#modalOptions");
      } else {
        this.refs.loginOptions.open("#loginOptions");
      }
      return true;
    },
    componentDidUpdate(){
      if (!($("#types-rent").prop( "checked") || $("#types-rent").prop("checked") || $("#types-sale").prop("checked")))
        $("#types-all").prop( "checked", true );
        if (!(Session.get('currentUser'))) this.refs.loginOptions.open("#loginOptions");
    }
});

