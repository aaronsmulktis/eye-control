// Room Box component - represents a single todo item
RoomBox = React.createClass({

  mixins: [sortable.ItemMixin],
  
  propTypes: {
    // This component gets the room to display through a React prop.
    // We can use propTypes to indicate it is required
    roomBox: React.PropTypes.object.isRequired
  },

  deleteThisRoom() {
    Rooms.remove(this.props.room._id);
  },

  getInitialState() {
      return {
          condition:false
      }
  },

  handleClick() {
      this.setState( { condition : !this.state.condition } );
  },

  render() {
    // Give rooms a different className when they are checked off,
    // so that we can style them nicely in CSS
    const roomClassName = this.props.room.name;

    return (
      <li id="roomBox" className={roomClassName + ' noPadding roomBox container-fluid'}>
        <a href="javascript:;" id="editToggle" className="edit"><i className="fa fa-pencil"></i></a>
        <a href="javascript:;" className="delete" onClick={this.deleteThisRoom}><i className="fa fa-close"></i></a>
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