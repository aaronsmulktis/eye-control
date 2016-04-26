let inic = false;

ConsoleOptionsModal = React.createClass({
    getInitialState() {
        return {
            // state contains
            options : {}
        }
    },
	componentDidUpdate(){
    
	},
    handleChange : function(){
           var _this = this;
      // the select update need time, when trigger onChange late to update the value
      setTimeout(function() { 
        // this object contains all search filters
        let option = {
             text : _this.refs.searchMapInput.value + " " ,
             position : _this.refs.position.value,
         }
         // set state for keep values after render
        _this.setState({options:option});  
        _this.props.updateObjCall(option);   
    
        return true;
      }, 100);
    },
	render : function(){
		return (
		<div id="modalConsoleOptions" className="col-sm-12">
    <br/>

      	 <strong>Message: </strong><input type="text" className="form-control" ref="text"  placeholder="Hello, World!" />
            <strong>Position: </strong> <br/>
            <div className="navbar-form form-group pull-left input-min-select fit-control">
               <Select value={this.state.options.position} name="position" ref="position" placeholder="Center" options={[{label:'center',value:'center'},{label:'left',value:'left'}]} onChange={this.handleChange}/>
          </div>                      
        </div>
		);
	}
});