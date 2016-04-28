/*global React ReactMeteorData sortable Meteor Homes Rooms Spheres classNames */
// Room Box component - represents a single todo item

//TODO: Remove this classes and unify with the same classs on roomBox
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

class NoIntroVideoAction extends Action {
    getData() {
        return {
            introVideo: {
                enabled: false
            }
        };
    }
}
class IntroVideoAction extends Action {
    getData() {
        return {
            introVideo: {
                enabled: true,
                url: 'https://www.dropbox.com/sh/zk8yv34cpnl8a13/AADkN3PPq18_oZ-uk47WMzNia?dl=0'
            }
        };
    }
}
class HideHudAction extends Action {
    getData() {
        return {
            actionName: 'hideHud',
            actionParams: null,
            hudObjects: []
        };
    }
}
class ShowHudAction extends Action {
    constructor(url) {
        super();
        this.url = url;
        this.class = undefined;
    }
    getData() {
        // Duplicate data to make sure there is backward compatibility.
        let fullParams = {
            url: this.url
        };
        if (this.params) {
            Object.assign(fullParams, this.params);
        }

        let coreData = {
            instance: this.class,
            class: this.class,
            params: fullParams
        };
        return {
            actionName: 'showHud',
            hudObjects: [
                coreData
            ],
            actionParams: coreData
        };
    }
}
class ImageAction extends ShowHudAction {
    constructor(url) {
        super(url);
        this.class = 'image';
    }
}
class VideoAction extends ShowHudAction {
    constructor(url) {
        super(url);
        this.class = 'video';
    }
}
class FloorplanAction extends ShowHudAction {
    constructor(url) {
        super(url);
        this.class = 'floorplan';
    }
    get params() {
        return {
            userLocationX:100,
            userLocationY:200
        };
    }
}

class InfoWindowAction extends ShowHudAction {
    constructor(home) {
        super();
        this.home = home;  
        this.class = 'infoWindow';
    }
    get params() {
        return {
            id : this.home._id,
            address : this.home.address,
            createdAt : this.home.createdAt,
            latitude : this.home.latitude,
            longitude : this.home.longitude,
            name : this.home.name,
            notes : this.home.notes,
            numBathrooms : this.home.numBathrooms,
            numBedrooms : this.home.numBedrooms,
            position : this.home.position,
            price : this.home.price,
            propPic : this.home.propPic,
            slug : this.home.slug,
            year : this.home.year
        };
    }
}
class TextMessageAction extends ShowHudAction {
    constructor(msg) {
        super();
        this.text = msg; 
        this.class = 'textMessage';
    }
    get params() {
        return {
            text : this.text,
            anchorX:0.5,
            anchorY:0.5 
        };
    }
}

function getLatestSphere() {
    return Spheres.find({}, { sort: { 'timestamp' : 1 } , limit:1}).fetch()[0];
}

function getCurrentSphere() {
    return Spheres.find({_id: "5ff7bef11efaf8b657d709b9"}).fetch()[0];
}

function getCurrentHud() {
    return JSON.parse(getLatestSphere().hud)
}

let searchTimeout;

// Property component
Home = React.createClass({
    mixins: [ReactMeteorData, sortable.ListMixin],

    getMeteorData() {
        let data = {}
        let handles = [Meteor.subscribe("home", this.props.id),
                       Meteor.subscribe("sphere", "5ff7bef11efaf8b657d709b9")];

        if (!handles.every(utils.isReady)) {
            data.loading = true;
            return data;
        }

        let homes = Homes.find({_id: this.props.id}).fetch(),
            thisHome = homes[0];

        return {
            home: thisHome,
            sphere: getLatestSphere()
        }
    },

    getInitialState() {
        return {
            isPopup: false,
            isIntroVideo: false,
            isMap: false,
            isFloorLogo: false,
            isPlaque: false,
            isFloorplan: false,
            isInfoWindow: false,
            isDualHeadset: false,
            isConsole: false,
            isVideo: false,
            rooms: [],
            // items: [] // Added automatically by the mixin
        }
    },

    componentDidMount() {
        let handle_coords = Meteor.subscribe("coords");

        let updateFrame = function(id, coord) {
            if (id !== "headset") {
                return;
            }
            let frame = $('.vr-iframe').first()[0];
            if (!frame) {
                return;
            }
            let idx = frame.src.indexOf('#'), url = frame.src;
            if ( idx > -1 ){
                url = url.substr(0, idx);
            }

            frame.src = url + '#' + coord.coord;
        }

        if (!handle_coords.ready()) {
            function loadCoords() {
                if (!handle_coords.ready()) {
                    setTimeout(loadCoords, 100);
                    return;
                }
                let query = Coords.find();
                handle_coords = query.observeChanges({
                    added: updateFrame,
                    changed: updateFrame
                });
            }
            setTimeout(loadCoords, 100);
        }
    },

    componentWillReceiveProps(nextProps) {
        this.setState({items: nextProps.rooms,
                       isMap: nextProps.hud.isMap,
                       isFloorLogo: nextProps.hud.isFloorLogo,
                       isIntroVideo: nextProps.hud.isIntroVideo,
                       isPlaque: nextProps.hud.isPlaque,
                       isFloorplan: nextProps.hud.isFloorplan,
                       isConsole: nextProps.hud.isConsole,
                       isVideo: nextProps.hud.isVideo,
                       isInfoWindow: nextProps.hud.isInfoWindow});
    },

    renderRoomBoxes() {
           
        let rooms = this.state.items;
        // Hay que refactorizar el codigo supongo que es asi porque habria problemas con positions repetidos
        let processedRooms = [];
        let editMode = FlowRouter.getQueryParam("edit");
        for (let i=0; i<rooms.length;i++) {
            let room = rooms[i],
                position = room.position == null ? i : room.position;
            processedRooms[position] = <RoomBox edit={editMode} key={room._id} room={room} desc={room.desc} index={position} {...this.movableProps}/>
                                          }
            return <ul>{processedRooms}</ul>;
    },

    onBeforeSetState: function(items){
        for(let i = 0; i < items.length; i++) {
            items[i].position = i;
            Rooms.update({_id:items[i]._id}, {$set: {position: i}});
        }
    },
     renderSphere() {
        if (!this.data.sphere) {
            return;
        }
        
        let sphere = "http://vault.ruselaboratories.com/vr?image_url=" + encodeURIComponent(this.data.sphere.sphereUrl) + "&resize=1&width=3000#0,0,1";

        return (
            <iframe src={sphere} frameBorder="0" className="vr-iframe" height="100%" width={this.state.isDualHeadset ? "50%" : "100%"}></iframe>

        );
    },

    render() {
        if (this.data.loading) {
            return (
                <div className="loader-container">
                    <div className="loader"><span>Loading...</span></div>
                </div>
            )
        }

        var price = this.data.home.price;
        price = price && accounting.formatMoney(price, "£", 0, ".", ",");
        var mapPath = "/img/map-round.png";
        var floorplanPath = "/img/floorplan-round.png";
        var infoPath = "/img/info-round.png";
        var videoPath = "/video/virtuocity.mp4";
        var mapStyle = {display: this.state.isMap ? 'block' : 'none'};
        var floorplanStyle = {display: this.state.isFloorplan ? 'block' : 'none'};
        var infoStyle = {display: this.state.isInfoWindow ? 'block' : 'none'};
        var videoStyle = {display: this.state.isVideo ? 'block' : 'none'};
        return (

            <div id="contentContainer">

                <div id="mainContent" className="col-sm-12 noPadding">

                    {this.props.header}

                    <div id="rooms" className="col-sm-4">

                        <div className="row-fluid">
                            <h2 id="propTitle">{this.data.home.name}</h2>
                            <h5>{price}</h5>
                            <p>
                                {this.data.home.address}
                            </p>
                            <p>{this.data.home.numBedrooms} <i className="fa fa-bed"></i> | {this.data.home.numBathrooms} <i className="fa fa-recycle"></i></p>
                            <p>
                                {this.data.home.desc}
                            </p>

                        </div>

                        <hr></hr>

                        <div id="roomHeader" className="row-fluid">
                            <h5><i className="fa fa-home"></i> Rooms</h5>
                            <div id="roomFilter">
                                <form className="new-note">
                                    <input
                                        id="search-rooms"
                                        type="text"
                                        ref="roomInput"
                                        placeholder="Filter.." />
                                </form>
                                <div id="addRoomBtn" className="pull-right">
                                    <a href="javascript:;" onClick={this._togglePopup}><i className="fa fa-plus"></i> Add Room</a>
                                </div>

                            </div>
                            <div id="roomPics" className="noPadding">

                                {this.renderRoomBoxes()}

                            </div>
                        </div>
                    </div>

                    <div id="content" className="col-sm-8 noPadding">

                      <div id="viewVR" className={this.state.isDualHeadset? "dual":""}>
                          <img id="map-overlay" style={mapStyle} className="generic-overlay" src={mapPath} />
                          <img id="floorplan-overlay" style={floorplanStyle} className="generic-overlay" src={floorplanPath} />
                          <img id="info-overlay" style={infoStyle} className="generic-overlay" src={infoPath} />
                          <video id="video-overlay" width="320" style={videoStyle} className="generic-overlay" src={videoPath} height="240" controls muted>
                                <source src="movie.mp4" type="video/mp4"/>
                          </video>
                          {this.renderSphere()}
                          {this.state.isDualHeadset ? this.renderSphere() : ""}
                          {this.setSplash()}
                      </div>

                      <div id="propDetails" className={this.state.isDualHeadset? "dualB":""}>

                        <div id="viewDetails" className="col-sm-8">
                            <h4>Viewer Options:</h4>
                            {this._renderViewOptions()}

                            <hr></hr>

                            <div>
                                <h4>Room Details</h4>
                                <p id="desc">{this.state.items.length ? this.state.items[0].desc : ""}</p>
                            </div>
                        </div>

                        <div id="plaque" className="col-sm-4">
                           // {this._renderPlaque()}
                        </div>

                      </div>
                    </div>

                    {this._renderAddRoom()}

                </div>

            </div>

        );
    },

    _togglePopup() {
        this.setState({ isPopup: !this.state.isPopup });
    },

    _addRoom(e) {
        e.preventDefault();
        //TODO: quit references to Find DOM Node
        // Find the text field via the React ref
        let name = React.findDOMNode(this.refs.nameInput).value.trim();
        let desc = React.findDOMNode(this.refs.descInput).value.trim();
        let picUrl = React.findDOMNode(this.refs.picUrl).value.trim();

        let rooms = Rooms.find({homeId: this.props.id}).fetch(),
            highest_position = utils.getHighestPosition(rooms);

        Rooms.insert({
            name: name,
            desc: desc,
            picUrl: picUrl,
            homeId: this.props.id,
            position: highest_position,
            createdAt: new Date()
        });

        // Clear form
        React.findDOMNode(this.refs.nameInput).value = "";
        React.findDOMNode(this.refs.descInput).value = "";
        React.findDOMNode(this.refs.picUrl).value = "";
    },

    _renderAddRoom() {

        if(!this.state.isPopup) {
            return null;
        }
        return (
            <div id="addRoom" className="container-fluid">
                <a href="javascript:;" className="close" onClick={this._togglePopup}><i className="fa fa-close fa-lg"></i></a>

                <form className="col-sm-8 col-sm-offset-2" role="addHome" onSubmit={this._addRoom}>
                  <h3>Add room to {this.data.home.name}</h3>
                  <hr></hr>
                  <div className="form-group">
                      <input type="text" className="form-control" ref="nameInput" placeholder="Kitchen, Living Room,"></input>
                  </div>
                  <div className="form-group">
                      <textarea type="text" className="form-control" ref="descInput" placeholder="Tell us about this room.."></textarea>
                  </div>
                  <h4>Room Picture URL:</h4>
                  <div className="form-group">
                      <input type="text" className="form-control" ref="picUrl" placeholder="Dropbox much?"></input>
                  </div>

                  <button type="submit" className="btn btn-default">Add Room</button>
                </form>
            </div>
        );
    },

    _renderViewOptions() {
        let modalOptions = {
          title: "Console Options",
          doneButton:"Send",
          doneButtonIcon:"glyphicon glyphicon-eye-open",
      };
        let defaultClasses = ['btn', 'btn-default'],
            introVideoClasses = classNames(defaultClasses, {active: this.state.isIntroVideo}),
            mapClasses = classNames(defaultClasses, {active: this.state.isMap}),
            floorLogoClasses = classNames(defaultClasses, {active: this.state.isFloorLogo}),
            plaqueClasses = classNames(defaultClasses, {active: this.state.isPlaque}),
            floorplanClasses = classNames(defaultClasses, {active: this.state.isFloorplan}),
            infoWindowClasses = classNames(defaultClasses, {active: this.state.isInfoWindow}),
            dualHeadsetClasses = classNames(defaultClasses, {active: this.state.isDualHeadset});
            videoClasses = classNames(defaultClasses, {active: this.state.isVideo});
            consoleClasses = classNames(defaultClasses, {active: this.state.isConsole});

        return (
            <div id="viewOptions">
                <ul className="list-inline">
                    <li>
                        <button onClick={this._toggleViewOption.bind(this, "isIntroVideo")} type="button" className={introVideoClasses} data-toggle="button" aria-pressed="false" autoComplete="off">
                            Intro Video
                        </button>
                    </li>
                    <li>
                        <button onClick={this._toggleViewOption.bind(this, "isFloorLogo")} type="button" className={floorLogoClasses} data-toggle="button" aria-pressed="false" autoComplete="off">
                            Logo
                        </button>
                    </li>
                    <li>
                        <button onClick={this._toggleViewOption.bind(this, "isMap")} id="mapButton" type="button" className={mapClasses} data-toggle="button" aria-pressed="false" autoComplete="off">
                            Map
                        </button>   
                    </li>
                    <li>
                        <button onClick={this._toggleViewOption.bind(this, "isFloorplan")} type="button" className={floorplanClasses} data-toggle="button" aria-pressed="false" autoComplete="off">
                            Floorplan
                        </button>
                    </li>
                     <li>
                        <button onClick={this._toggleViewOption.bind(this, "isVideo")} type="button" className={videoClasses} data-toggle="button" aria-pressed="false" autoComplete="off">
                            Video
                        </button>
                    </li>
                    <li>
                        <button onClick={this._toggleViewOption.bind(this, "isInfoWindow")} type="button" className={infoWindowClasses} data-toggle="button" aria-pressed="false" autoComplete="off">
                            Info
                        </button>
                    </li>
                    <li>
                        <button onClick={this._toggleViewOption.bind(this, "isConsole")} type="button" className={consoleClasses} data-toggle="button" aria-pressed="false" autoComplete="off">
                           Console
                        </button>
                    </li>
                    <li>
                        <button onClick={this._toggleViewOption.bind(this, "isDualHeadset")} type="button" className={dualHeadsetClasses} data-toggle="button" aria-pressed="false" autoComplete="off">
                           Dual Headset
                        </button>
                    </li>
                </ul>
                 <Modal options={modalOptions} callback={this.consoleModalCallback} objCall={this.consoleModalObjCall} id="consoleMoldalOptions" ref="consoleMoldalOptions">
                     <ConsoleOptionsModal callback={this.consoleModalCallback}  updateObjCall={this.updateObjCall}/>
                </Modal>

                {/*
                <div className="hudOptions">
                    {this.props.radioBtns}
                </div>
                */}
            </div>
        );
    },

    _renderPlaque() {
        return (
            <div id="circ" className="center-block">
                <h4 id="circTitle">{this.data.home.name}</h4>
                {/*                <p>Built {this.data.home.year}</p>  */}
            </div>
        );
    },

     _getHud() {
        return {'isIntroVideo': this.state.isIntroVideo,
                'isMap': this.state.isMap,
                'isFloorLogo': this.state.isFloorLogo,
                'isPlaque': this.state.isPlaque,
                'isFloorplan': this.state.isFloorplan,
                'isInfoWindow': this.state.isInfoWindow,
                'isVideo': this.state.isVideo,
                'text': $('#circTitle').text()}
    },

    changeTransition(transition='none') {
        Spheres.update({ _id: '5ff7bef11efaf8b657d709b9' }, { $set: {
            transition: transition.target.value
        }});
    },

    toggleHud(action) {
        console.log(this.data.sphere);
        console.log(this.state);
    },

    setSplash(){
        let color = $("#topBar").css('background-color');
        console.log(color);
        if (color){

            let bg = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            let logoUrl = "http://eye-control.ruselaboratories.com/img/logos/"+(Session.get('template') ? Session.get('template') : "logo" )+".png";
            // add intro information
             Spheres.update({ _id: '5ff7bef11efaf8b657d709b9' }, { $set: {
                "intro" : { 
                        // show realtor logo
                        "showLogo":true,
                        
                        // logo image, should be a png with alpha, and have a lot of alpha space around the logo for the blur fx
                        "logoUrl": logoUrl,

                        // background color that changes when logo appears
                        "bgColor":{ "r":bg[1], "g":bg[2], "b":bg[3], "a":1 },
                        
                        // logo shadow blob color
                        "floorColor":{ "r":1, "g":1, "b":1, "a":1 },

                        // show intro video?
                        "showIntroVideo":false
                    }
                }
            } );
         }
     },

    _toggleViewOption(optionName) {

    /**
         * React seems to make changing states a little more difficult than *I* think necessary.
         */
        let changedOption = !this.state[optionName];
        // dbAction is executed at the end of this function (if there is an action)
        let dbAction = undefined;
        // state is updated to next state at end of function
        let nextState = {};
        let home = this.data.home;
        let actionMap = {
            isInfoWindow: { 
                uiAction() { $('#info-overlay').toggle(); },
                dbAction: new InfoWindowAction(home)
            },
            isMap: { 
                uiAction() { $('#map-overlay').toggle(); },
                dbAction: new ImageAction('https://dl.dropboxusercontent.com/u/60203355/eyecontrol/map.png')
            },
            isFloorplan: { 
                uiAction() { $('#floorplan-overlay').toggle(); },
                dbAction: new FloorplanAction('https://dl.dropboxusercontent.com/u/60203355/eyecontrol/floorplan.png')
            },
            isVideo: {
                 uiAction() { $('#video-overlay').toggle(); },
                dbAction: new VideoAction('https://www.dropbox.com/sh/zk8yv34cpnl8a13/AADkN3PPq18_oZ-uk47WMzNia?dl=0')
            }
        };
         let isHudOption = actionMap.hasOwnProperty(optionName);
        if ( isHudOption ) {
            let actionSet = actionMap[optionName];
            // we do some jQuery to toggle the HUD, this should be updated to 2way binding
            if (actionSet.uiAction) {
                actionSet.uiAction();
            }
            // if we are turning a button off, then we do  a HudHideAction
            dbAction = changedOption ? actionSet.dbAction : new HideHudAction();
            // HUD actions are mutually exclusive, so we set all actions to false
            // We update the nextState just outside of this if/elseif block
            Object.keys(actionMap).forEach( v => nextState[v] = false );
        } else if ( optionName === 'isIntroVideo') {
            dbAction = changedOption ? new IntroVideoAction() : new NoIntroVideoAction();
        }
         else if (optionName === "isDualHeadset") {
            this.setState({isDualHeadset : !this.state.isDualHeadset });
            let dual = this.state.isDualHeadset;
        } 
        else if (optionName === "isConsole") {
            this.setState({isConsole : !this.state.isConsole});
            if (!this.state.isConsole) 
                this.refs.consoleMoldalOptions.open("#modalOptions");
            dbAction = new TextMessageAction("Hello, World!");
        } 
        
        nextState[optionName] = changedOption;
        // setState is not synchronous, this causes issues when _getHud() relies on the state
        // so do the hud updates and subsequent db updates in the callback
        this.setState(nextState, () => {
            let data = dbAction ? dbAction.getData() : {};
            data.hud = JSON.stringify(this._getHud());
            Spheres.update({ _id: '5ff7bef11efaf8b657d709b9' }, { $set: data });
        });
    }


});

HomeWrapper = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {
        let data = {rooms: [], hud: {}};
        let handles = [Meteor.subscribe("rooms"),
                       Meteor.subscribe("sphere", "5ff7bef11efaf8b657d709b9")];
        if (!handles.every(utils.isReady)) {
            return data;
        }
        data.hud = getCurrentHud();
        if (RoomSearch.getCurrentQuery()) {
            let status = RoomSearch.getStatus();
            if (status.loaded) {
                data.rooms = RoomSearch.getData();
             
            
            }
        } else {
            let rooms = Rooms.find({homeId: this.props.id}, {
                sort: {
                    position: 1
                }
            }).fetch();
            data.rooms = rooms;           
        }
       
        return data;
    },
      getInitialState() {
        return {
            inic: false,
        }
    },

    _showDefaultRoom(firstRoom){
        
        if (firstRoom && !this.state.inic){
              let sphere = Spheres.findOne('5ff7bef11efaf8b657d709b9'); 
              let transitionStyle = sphere.transition;
              let url = firstRoom.picUrl;
              let name = firstRoom.name;
              let desc = firstRoom.desc;
              let transition = new Transition(transitionStyle, url);
              let data = Object.assign({sphereUrl: url, momentName: name, momentDesc: desc}, transition.getData());

              Spheres.update({_id:"5ff7bef11efaf8b657d709b9"}, {$set: data});  
              this.setState({inic:true});
              console.log("move it");
          }   
    },


    componentWillMount(){
        Cookie.setViewed(this.props.id);
    },

    render: function(){
         this._showDefaultRoom(this.data.rooms[this.data.rooms.map(function(o){ return o.position}).indexOf(0)]);
        return(
            <Home rooms={this.data.rooms} hud={this.data.hud} {...this.props} />
        )
    }
});