// Task component - represents a single todo item
RoomBox = React.createClass({
  propTypes: {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    roomBox: React.PropTypes.object.isRequired
  },

  deleteThisRoom() {
    Rooms.remove(this.props.room._id);
  },

  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    const roomClassName = this.props.room.name;
    
    return (
      <li draggable="true" className={roomClassName + ' noPadding roomBox container-fluid'}>
        <a href="#" className="delete" onClick={this.deleteThisRoom}><i className="fa fa-close"></i></a>
        <div className="roomPic col-sm-4 noPadding" style={{backgroundImage: 'url(img/MasterBedroomSmall-xs.jpg)'}}>
        </div>
        <div className="propDetails col-sm-8">
          <h4 className="roomName">{this.props.room.name}</h4>
          <p className="roomDesc">{this.props.room.desc}</p>
        </div>
      </li>
    );
  }
});