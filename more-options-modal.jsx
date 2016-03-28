let inic = false;

MoreOptionsModal = React.createClass({
    getInitialState() {
        return {
            // state contains
            options : {}
        }
    },
	componentDidUpdate(){
        if (!inic){            
            inic= true;
            $('#tokenfield').tokenfield({
                delimiter : ';',
                autocomplete: {
                    source: [],
                    delay: 100
                },
            showAutocompleteOnFocus: true
            });
        }

	},
    handleChange : function(){
           var _this = this;
      // the select update need time, when trigger onChange late to update the value
      setTimeout(function() { 
        // this object contains all search filters
        let option = {
             text : _this.refs.searchMapInput.value + " " ,
             types : _this.refs.types.value,
             currency : _this.refs.currency.state.value,
             minValue : _this.refs.min.state.value,
             maxValue : _this.refs.max.state.value,
             numBedrooms : _this.refs.bedrooms.state.value,
             numBathrooms : _this.refs.baths.state.value
         }
         // set state for keep values after render
        _this.setState({options:option});  
        _this.props.updateObjCall(option);   
    
        return true;
      }, 100);
    },
	render : function(){
		return (
			<div id="modalSearchOptions" className="col-sm-12">
      	<input type="text" className="form-control" id="tokenfield" value="London, KY ; London, OH" />

          <form className="navbar-form navbar-left noPadding" role="search" action="javascript:;">
                <div className="form-group">
                    <div className="input-group">
                        <div className="input-min input-group-addon fit-control">UK</div>
                        <div className="input-min input-group-addon fit-control no-margin no-padding">
                        <input ref="searchMapInput" id="searchMapInput" type="text" className="font4 form-control input-min" placeholder="Enter Address, City, State or ZIP" onChange={this.handleChange}></input>
                        <div className="input-group-addon input-min"><i className="glyphicon glyphicon-search"/></div>
                        </div>
                    <div className="checkbox" id="modal-checkbox">
                        <label> <input className="font4 form-control input-min" type="radio" ref="types" name="types" id="types" onChange={this.handleChange} value="all" /> All </label>
                        <label> <input className="font4 form-control input-min" type="radio" ref="types" name="types" id="types" onChange={this.handleChange} value="sale"/> For Sale </label>
                        <label> <input className="font4 form-control input-min" type="radio" ref="types" name="types" id="types" onChange={this.handleChange} value="rent"/> For Rent  </label>
                    </div>
                    </div>
                    </div>
            </form> 
            <div id="currencyOptions">
                        <div className="navbar-form form-group pull-left input-min-select fit-control">
                            <Select value={this.state.options.currency} name="currency" ref="currency" placeholder="Usd" options={SearchOptions.get('currencies').toArray()} onChange={this.handleChange}/>
                        </div>
                        <div className="navbar-form form-group pull-left input-min-select fit-control">
                            <Select value={this.state.options.minValue} name="min" ref="min" placeholder="No Min" options={SearchOptions.get('minValue').toArray()} onChange={this.handleChange}/>
                        </div>
                        <label className="navbar-form form-group pull-left middle-label ">to </label>
                        <div className="navbar-form form-group pull-left input-min-select fit-control">
                            <Select value={this.state.options.maxValue} name="max" ref="max" placeholder="No Max" options={SearchOptions.get('maxValue').toArray()} onChange={this.handleChange}/>
                        </div>
                    </div>
        
                    <div id="propOptions">
                        <div className="navbar-form form-group pull-left input-min-select fit-control">
                            <Select value={this.state.options.numBedrooms} name="bedrooms" ref="bedrooms" placeholder="Beds" options={SearchOptions.get('bedOptions').toArray()} onChange={this.handleChange}/>
                        </div>
                        <div className="navbar-form form-group pull-left input-min-select fit-control">
                            <Select value={this.state.options.numBathrooms} name="baths" ref="baths" placeholder="Baths" options={SearchOptions.get('bathOptions').toArray()} onChange={this.handleChange}/>
                        </div>
                    </div>
        </div>
		);
	}
});