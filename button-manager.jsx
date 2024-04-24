class Util {
    static object_compare(obj1, obj2) {
        let json1 = JSON.stringify(obj1);
        let json2 = JSON.stringify(obj2);
        return json1 === json2;
    }
    static array_compare(arr1, arr2) {
        return this.object_compare(arr1, arr2);
    }
}

class Action {
    getData() { }
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
                url: 'intro_video_url.webm'
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

ButtonManager = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        return {
            home: this.props.home
        };
    },

    getInitialState() {
        return {
            type: 'image',
            url: '',
            name: ''
        }
    },

    addHUDAction() {
        if (!this.state.url || !this.state.name) return;
        let home = this.data.home;
        let hudActions = home.hudActions ? home.hudActions : [];
        hudActions.push({
            type: this.state.type,
            url: this.state.url,
            name: this.state.name
        });
        Homes.update({_id: this.data.home._id}, {$set: {hudActions}});
        this.setState({
            url: '',
            name: ''
        });
    },

    removeHudAction(index) {
        let hudActions = this.data.home.hudActions;
        hudActions.splice(index, 1);
        Homes.update({_id: this.data.home._id}, {$set: {hudActions}});
    },

    renderAvailableHudActions() {
        if (!this.data.home) return;
        if (!this.data.home.hudActions) return;

        return this.data.home.hudActions.map((home, index) => {
            return <li> {home.name}
                <span className="pull-right" key={index} onClick={this.removeHudAction.bind(this, index)}>&times;</span>
            </li>;
        });
    },

    render() {
        let typeLink = {
            value: this.state.type,
            requestChange: type => this.setState({type})
        };
        let urlLink = {
            value: this.state.url,
            requestChange: url => this.setState({url})
        };
        let nameLink = {
            value: this.state.name,
            requestChange: name => this.setState({name})
        };
        return (
            <div>
                <h3>HUD Actions</h3>

                <select className="form-control" valueLink={typeLink}>
                    <option value="image">Image Action</option>
                    <option value="video">Video Action</option>
                </select>
                <input className="form-control" type="text" placeholder="URL" valueLink={urlLink}/>
                <input className="form-control" type="text" placeholder="Name" valueLink={nameLink}/>


                <button className="btn btn-default btn-block" onClick={this.addHUDAction}>Add Hud Action</button>

                {this.renderAvailableHudActions()}
            </div>
        );
    }
});

HudButtons = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        return {
            home: this.props.home,
            sphere: this.props.sphere
        };
    },

    updateHud(action) {
        let dbAction = action.getData();
        let hudObjects = dbAction.hudObjects;
        if (Util.array_compare(hudObjects, this.data.sphere.hudObjects)) {
            hudObjects = [];
        }
        Spheres.update({_id: '5ff7bef11efaf8b657d709b9'}, {$set: {hudObjects}});
    },

    renderButtons() {
        if (!this.data.home || !this.data.home.hudActions) return;

        return this.data.home.hudActions.map( (action, index) => {
            let hudAction;
            if (action.type === 'image') {
                hudAction = new ImageAction(action.url);
            } else if (action.type === 'video') {
                hudAction = new VideoAction(action.url);
            }

            // hudActions on the home record are a different format to the hudObjects on the sphere record
            // we can get the hudObject from the above hudAction, to compare
            let active = false;
            if (hudAction) {
                let hudObjects = hudAction.getData().hudObjects;
                active = Util.array_compare(hudObjects, this.data.sphere.hudObjects) ? true : false;
            }

            let classes = `btn btn-default ${active ? 'active' : ''}`;

            return (
                <button key={index} type="button" className={classes} onClick={this.updateHud.bind(this, hudAction)}>
                {action.name}
                </button>
            );
        });

    },

    render() {
        return (
            <div className="btn-group">
                {this.renderButtons()}
            </div>
        );
    }
});


HudObjects = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        return {
            sphere: this.props.sphere
        };
    },

    render() {
        if (!this.data.sphere) return;

        let overlays = this.data.sphere.hudObjects
            .map((hudObj, index) => {
                if (hudObj.class === 'image') {
                    return <img key={index} className='generic-overlay' style={{display: 'block'}} src={hudObj.params.url}/>
                } else if (hudObj.class === 'video') {
                    return (
                        <video className='generic-overlay' style={{display: 'block'}} autoPlay loop>
                            <source src={hudObj.params.url}/>
                        </video>
                    )
                }
            });
        return (<div>{overlays}</div>);
    }
});
