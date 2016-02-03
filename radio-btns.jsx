RadioBtns = React.createClass({
  getInitialState: function () {
    return {
      option: ''
    };
  },
  onOptionChanged: function (e) {
    this.setState({
      option: e.currentTarget.value
      });
  },

  render: function(){
    var resultRows = this.props.data.map(function(result){
       return (
          <li>
            <input type="radio" name="option_name"
              value={result.OPTION}
              checked={this.state.option === result.OPTION}
              onChange={this.onOptionChanged} />
            <label>{result.OPTION}</label>
          </li> 
       );
    }, this);
    return (
      <div>
        <ul id="viewOptionsBtns" createClass="list-inline">
          {resultRows}
        </ul>

        <p>Currently displaying: {this.state.option} </p>
      </div>
    );
  }
});

RadioContainer = React.createClass({
  render: function(){
      return <div><RadioBtns data={[
          {OPTION: 'Intro Video'},
          {OPTION: 'Plaque'},
          {OPTION: 'Floorplan'},
          {OPTION: 'Info'}
      ]}/></div>
  }
});
