// Room Box component - represents a single todo item
class Action {
    getData() { }
}
class Transition extends Action {
    constructor(type, url) {
        super();
        this.type = type;
        this.time = 0.5;
        this.url = url;
    }
    getData() {
        return {
            actionName: 'loadSphere',
            actionParams: {
                transition: this.type,
                params: {
                    time: this.time
                },
                url: this.url
            }
        };
    }
}

RoomBox = React.createClass({
  //mixins: [sortable.ItemMixin],

  propTypes: {
      // This component gets the room to display through a React prop.
      // We can use propTypes to indicate it is required
     // roomBox: React.PropTypes.object.isRequired
  },

  deleteThisRoom(evt) {      
      this.refs["deleteModalRoom"+this.props.room._id].open();
      return false;
  },
  deleteRoomCallBack(result){
    if (result === true) {
         var id = this.props.room._id;
         Rooms.remove({"_id": id});
    }
    return false;
  },
  editThisRoom(evt) {    
      evt.nativeEvent.stopImmediatePropagation();
      evt.cancelBubble = true
      this.refs["editModalRoom"+this.props.room._id].open();
      return false;
  },
  editRoomCallBack(result){
    if (result === true) {
        Rooms.update({ _id: this.props.room._id }, { $set: {
            name: this.refs.editName.value
        }});
    }
    return false;
  },
 selectRoom(evt) {
      evt.nativeEvent.stopImmediatePropagation();
      evt.cancelBubble = true
      if (!$(evt.currentTarget).hasClass("is-positioning-post-drag") && ($(evt.target).hasClass("roomBox") || $(evt.target).hasClass("propDetails") || $(evt.target).hasClass("clickPic") )) {
          let sphere = Spheres.findOne('5ff7bef11efaf8b657d709b9'); 
          let transitionStyle = sphere.transition;
          let url = this.props.room.picUrl;
          let name = this.props.room.name;
          let desc = this.props.room.desc;
          let transition = new Transition(transitionStyle, url);
          let data = Object.assign({sphereUrl: url, momentName: name, momentDesc: desc}, transition.getData());

          Spheres.update({_id:"5ff7bef11efaf8b657d709b9"}, {$set: data});  
          return true;
      } else return false;
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
      let deleteModalOptions = {
          title: "Delete Room",
          doneButton:"Delete",
          doneButtonIcon:"glyphicon glyphicon-close",
      };
        let editModalOptions = {
          title: "Edit Room",
          doneButton:"Edit",
          doneButtonIcon:"glyphicon glyphicon-edit",
      };
      // Give rooms a different className when they are checked off,
      // so that we can style them nicely in CSS
      const roomClassName = this.props.room.name,
      vaultUrl = 'http://vault.ruselaboratories.com/proxy?url=' + encodeURIComponent(this.props.room.picUrl) + '&resize=1&width=200';
      let editMode = this.props.edit == "1" ? true : false;
      return (
          <li onClick={this.selectRoom} className={roomClassName + ' roomBox container-fluid'}>
              <div className="boxBorder"></div>
             {editMode ?  <a href="javascript:;" className="edit" onClick={this.editThisRoom}><i className="fa fa-pencil"></i></a>  :  ""}
             {editMode ?  <a href="javascript:;" className="delete" onClick={this.deleteThisRoom}><i className="fa fa-close"></i></a> :  ""}
              <div className="roomPic col-sm-4 noPadding">
                  <img className="clickPic" data-url={this.props.room.picUrl} src={vaultUrl} />
              </div>
              <div className="propDetails col-sm-8">
                  <h4 className="roomName">{this.props.room.name}</h4>
                  <p className="roomDesc">{this.props.room.desc.substring(0,30) + "..."}</p>
              </div>
               <Modal options={deleteModalOptions} ref={"deleteModalRoom"+this.props.room._id}  id={"deleteModalRoom"+this.props.room._id}  onDone={this.deleteRoomCallBack}>
                <strong>  {"Are you sure you want to delete " + this.props.room.name + "?"}</strong>     
              </Modal>
              <Modal options={editModalOptions} ref={"editModalRoom"+this.props.room._id} id={"editModalRoom"+this.props.room._id}  onDone={this.editRoomCallBack}>
                  <strong> Room Name:  </strong>   
                  <input type="text" placeholder={this.props.room.name} ref="editName" />
              </Modal>
          </li>
      );
  }
});
