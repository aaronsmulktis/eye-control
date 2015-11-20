// Task component - represents a single todo item
RoomBox = React.createClass({
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
      <li draggable="true" className={homeClassName + ' noPadding roomBox container-fluid'}>
        <div className="homePic col-sm-4 noPadding">
          <img src="img/MasterBedroomSmall-xs.jpg"></img>
        </div>
        <div className="propDetails col-sm-4 noPadding">
          <h4 className="text">{this.props.home.name}</h4>
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