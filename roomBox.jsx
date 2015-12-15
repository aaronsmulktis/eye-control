// Room Box component - represents a single todo item
RoomBox = React.createClass({

    mixins: [sortable.ItemMixin],

    propTypes: {
        // This component gets the room to display through a React prop.
        // We can use propTypes to indicate it is required
        roomBox: React.PropTypes.object.isRequired
    },

    deleteThisRoom() {
        var result = confirm("Are you sure you want to delete " + this.props.room.name + "?");
        if (result === true) {
            Rooms.remove(this.props.room._id);
        }
    },

    selectRoom(evt) {
        if (window.moving) {
            return false;
        }
        evt.preventDefault();
        var $li = $(evt.target).closest("li");
        Spheres.update({_id:"5ff7bef11efaf8b657d709b9"}, {$set: {sphereUrl:$li.find('img').data('url')}});
        $('#circTitle').text($li.find(".roomName").text());
        $('#desc').text($li.find(".roomDesc").text());
        return false;
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
        const roomClassName = this.props.room.name,
              vaultUrl = 'http://vault.ruselaboratories.com/proxy?url=' + encodeURIComponent(this.props.room.picUrl) + '&resize=1&width=200';

        return (
            <li onClick={this.selectRoom} className={roomClassName + ' noPadding roomBox container-fluid'}>
                <a href="javascript:;" id="editToggle" className="edit"><i className="fa fa-pencil"></i></a>
                <a href="javascript:;" className="delete" onClick={this.deleteThisRoom}><i className="fa fa-close"></i></a>
                <div className="roomPic col-sm-4 noPadding">
                    <img data-url={this.props.room.picUrl} src={vaultUrl} />
                </div>
                <div className="propDetails col-sm-8">
                    <h4 className="roomName">{this.props.room.name}</h4>
                    <p className="roomDesc">{this.props.room.desc}</p>
                </div>
            </li>
        );
    }
});
