// TODO: NO repeat code move let
let bedOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' },
    { value: '9', label: '9' },
    { value: '10', label: '10' },
    { value: '11', label: '11' },
    { value: '12', label: '12' },
    { value: '13', label: '13' },
    { value: '14', label: '14' },
    { value: '15', label: '15' }
];

let bathOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' }
];

let minValue = [
    { value: '100', label: '100' },
    { value: '500', label: '500' },
    { value: '1000', label: '1000' },
    { value: '10000', label: '10000' }
];

let maxValue = [
  { value: '100', label: '100' },
    { value: '500', label: '500' },
    { value: '1000', label: '1000' },
    { value: '10000', label: '10000' }
];
let currencies = [
    { value: 'GBP', label: 'GBP' },
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' }
];
let inic = false;

MoreOptionsModal = React.createClass({
    getInitialState() {
        return {
            // state contains
            options : {}
        }
    },
	componentDidUpdate(){
        console.log("new props");
        console.log(this.props);
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
                            <Select value={this.state.options.currency} name="currency" ref="currency" placeholder="Usd" options={currencies} onChange={this.handleChange}/>
                        </div>
                        <div className="navbar-form form-group pull-left input-min-select fit-control">
                            <Select value={this.state.options.minValue} name="min" ref="min" placeholder="No Min" options={minValue} onChange={this.handleChange}/>
                        </div>
                        <label className="navbar-form form-group pull-left middle-label ">to </label>
                        <div className="navbar-form form-group pull-left input-min-select fit-control">
                            <Select value={this.state.options.maxValue} name="max" ref="max" placeholder="No Max" options={maxValue} onChange={this.handleChange}/>
                        </div>
                    </div>
        
                    <div id="propOptions">
                        <div className="navbar-form form-group pull-left input-min-select fit-control">
                            <Select value={this.state.options.numBedrooms} name="bedrooms" ref="bedrooms" placeholder="Beds" options={bedOptions} onChange={this.handleChange}/>
                        </div>
                        <div className="navbar-form form-group pull-left input-min-select fit-control">
                            <Select value={this.state.options.numBathrooms} name="baths" ref="baths" placeholder="Baths" options={bathOptions} onChange={this.handleChange}/>
                        </div>
                    </div>
        </div>
		);
	}
});