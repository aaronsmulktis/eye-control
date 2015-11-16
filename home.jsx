// Task component - represents a single todo item
Home = React.createClass({
  propTypes: {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    home: React.PropTypes.object.isRequired
  },

  deleteThisHome() {
    Homes.remove(this.props.home._id);
  },

  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    const homeClassName = this.props.home.name;
    
    return (
      <li className={homeClassName}>
        <div className="homePic col-sm-4">
          <img src="home.png"></img>
        </div>
        <div className="propDetails col-sm-4">
          <h3 className="text">{this.props.home.name}</h3>
          <p className="text">{this.props.home.address}</p>
        </div>
        <div className="col-sm-4">
          <a href="#" className="pull-right delete" onClick={this.deleteThisHome}>
            &times;
          </a>
        </div>
      </li>
    );
  }
});