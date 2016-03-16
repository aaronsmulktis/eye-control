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
MoreOptionsModal = React.createClass({
	render : function(){
		return (
			<div id="modalSearchOptions" className="col-sm-12">
         
          <form className="navbar-form navbar-left noPadding" role="search" action="javascript:;">
                <div className="form-group">
                    <div className="input-group">
                        <div className="input-min input-group-addon">UK</div>
                        <input ref="searchMapInput" id="searchMapInput" type="text" className="font4 form-control input-min" placeholder="Enter Address, City, State or ZIP" onChange={this.handleChange}></input>
                        <div className="input-group-addon input-min"><i className="glyphicon glyphicon-search"/></div>
                    <div className="checkbox" id="modal-checkbox">
                        <label> <input className="font4 form-control input-min" type="radio" ref="types" name="types" id="types" onChange={this.handleChange} value="all" /> All </label>
                        <label> <input className="font4 form-control input-min" type="radio" ref="types" name="types" id="types" onChange={this.handleChange} value="sale"/> For Sale </label>
                        <label> <input className="font4 form-control input-min" type="radio" ref="types" name="types" id="types" onChange={this.handleChange} value="rent"/> For Rent  </label>
                    </div>
                    </div>
                    </div>
            </form> 
            <div id="currencyOptions">
                        <div className="navbar-form form-group pull-left input-min-select">
                            <Select name="currency" ref="currency" placeholder="Usd" options={currencies} onChange={this.handleChange}/>
                        </div>
                        <div className="navbar-form form-group pull-left input-min-select">
                            <Select name="min" ref="min" placeholder="No Min" options={minValue} onChange={this.handleChange}/>
                        </div>
                        <label className="navbar-form form-group pull-left middle-label">to </label>
                        <div className="navbar-form form-group pull-left input-min-select">
                            <Select name="max" ref="max" placeholder="No Max" options={maxValue} onChange={this.handleChange}/>
                        </div>
                    </div>
        
                    <div id="propOptions">
                        <div className="navbar-form form-group pull-left input-min-select">
                            <Select name="bedrooms" ref="bedrooms" placeholder="Beds" options={bedOptions} onChange={this.handleChange}/>
                        </div>
                        <div className="navbar-form form-group pull-left input-min-select">
                            <Select naem="baths" ref="baths" placeholder="Baths" options={bathOptions} onChange={this.handleChange}/>
                        </div>
                    </div>
        </div>
		);
	}
});