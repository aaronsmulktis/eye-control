RadioBtns = React.createClass({
  getInitialState: function () {
    return {
      site: '',
      address: ''
    };
  },
  onSiteChanged: function (e) {
    this.setState({
      site: e.currentTarget.value
      });
  },

  onAddressChanged: function (e) {
    this.setState({
      address: e.currentTarget.value
      });
  },

  render: function(){
    var resultRows = this.props.data.map(function(result){
       return (
           <tbody>
                <tr>
                    <td><input type="radio" name="site_name"
                               value={result.SITE_NAME}
                               checked={this.state.site === result.SITE_NAME}
                               onChange={this.onSiteChanged} />{result.SITE_NAME}</td>
                    <td><input type="radio" name="address"
                               value={result.ADDRESS}
                               checked={this.state.address === result.ADDRESS}
                               onChange={this.onAddressChanged} />{result.ADDRESS}</td>
                </tr>
           </tbody>
       );
    }, this);
    return (
       <table className="table">
           <thead>
               <tr>
                   <th>Name</th>
                   <th>Address</th>
               </tr>
           </thead>
            {resultRows}
           <tfoot>
               <tr>
                   <td>chosen site name {this.state.site} </td>
                   <td>chosen address {this.state.address} </td>
               </tr>
           </tfoot>
       </table>
    );
  }
});

RadioContainer = React.createClass({
  render: function(){
      return <div><RadioBtns data={[
          {SITE_NAME: 'google.com', ADDRESS: 'Mountain View, CA'},
          {SITE_NAME: 'example.com', ADDRESS: 'Example Place, CA'}
      ]}/></div>
  }
});
