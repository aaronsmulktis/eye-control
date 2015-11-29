Property = React.createClass({
	
	mixins: [ReactMeteorData],

	getMeteorData() {
		return {
			notes: Notes.find({}, {
				sort: {
				  createdAt: -1
				}
			}).fetch(),
				rooms: Rooms.find({}, {
				sort: {
				  createdAt: -1
				}
			}).fetch()
		}
	},

	getInitialState() {
		return {
			isPopup: false,
		}
	},

	renderNotes() {
		// Get notes from this.data.notes
		let notes = this.data.notes.map((note) => {
			return <Note key={note._id} note={note} />;
		});

		return (
			<div id="viewNotes">
				<header>
					<form className="new-note" onSubmit={this._addNote} >
						<input
						type="text"
						ref="noteInput"
						placeholder="Add a note..." />
					</form>
					<ul>
						{notes}
					</ul>
				</header>
			</div>
		);
	},

	// renderRoomBoxes() {

	// 	var listItems = this.state.items.map(function (text, i) {
 //      		return <li ref={i}>{text}</li>
	//   	});
            
 //      	console.log(SortableMixin, this);
 //        return (
 //        	<ul>{listItems}</ul> 
 //  		);

	// 	// Get rooms from this.data.rooms
	// 	// return this.data.rooms.map((room) => {
	// 	// 	return <RoomBox key={room._id} room={room} />;
	// 	// });
	// },

	render() {

		return (

			<div id="contentContainer">
				<div id="mainContent" className="col-sm-12 col-lg-10 col-lg-offset-1 noPadding">
			
					{this.props.header}
			
					<div id="viewVR">
						<iframe src={this.props.sphere} frameborder="0" className="vr-iframe" height="100%" width="100%"></iframe>
					</div>
			
					<div id="propDetails">
						<div id="viewDetails" className="col-sm-4 noPadding">
			
							{this._renderViewOptions()}
			
							{this.renderNotes()}
			
						</div>
			
						{this._renderPlacque()}
			
						{this.props.sortableList}
					</div>
			
					{/* Add Room Modal */}
			
					{this._renderAddRoom()}
			
				</div>
			</div>

		);
	},

	_togglePopup() {
		this.setState({ isPopup: !this.state.isPopup });
	},

	_addNote(e) {
		e.preventDefault();

		// Find the text field via the React ref
		var text = React.findDOMNode(this.refs.noteInput).value.trim();

		Notes.insert({
		  text: text,
		  createdAt: new Date() // current time
		});

		// Clear form
		React.findDOMNode(this.refs.noteInput).value = "";
	},

	_addRoom(e) {
		e.preventDefault();

		// Find the text field via the React ref
		let name = React.findDOMNode(this.refs.nameInput).value.trim();
		let desc = React.findDOMNode(this.refs.descInput).value.trim();

		Rooms.insert({
			name: name,
			desc: desc,
			createdAt: new Date() // current time
		});

		// Clear form
		React.findDOMNode(this.refs.nameInput).value = "";
		React.findDOMNode(this.refs.descInput).value = "";

		this._togglePopup;
	},

	_renderAddRoom() {

		if(!this.state.isPopup) return null;
		
		return (
			<div id="addRoom" className="container-fluid">
				<a href="javascript:;" className="close" onClick={this._togglePopup}><i className="fa fa-close fa-lg"></i></a>
				<h3>Add a room to 100 Freeman St.</h3>
				
				<form role="addHome vertCenter" onSubmit={this._addRoom}>
					<div className="form-group">
						<input type="text" className="form-control" ref="nameInput" placeholder="Kitchen, Living Room,"></input>
					</div>
					<div className="form-group">
						<textarea type="text" className="form-control" ref="descInput" placeholder="Tell us about this room.."></textarea>
					</div>
					<div className="form-group">
						<label for="propPic">Room Picture:</label>
						<input type="file" ref="propPicInput" placeholder></input>
					</div>
					<button type="submit" className="btn btn-default">Add Room</button>
				</form>
			</div>
		);
	},

	_renderViewOptions() {
		return (
			<div id="viewOptions" className="20padding">
				<ul className="list-inline nav-justified">
					<li>
						<button type="button" className="btn btn-default" data-toggle="button" aria-pressed="false" autocomplete="off">
						<span className="glyphicon glyphicon-comment"></span>
						</button>
					</li>
					<li>
						<button type="button" className="btn btn-default" data-toggle="button" aria-pressed="false" autocomplete="off">
						<span className="glyphicon glyphicon-home"></span>
						</button>
					</li>
					<li>
						<button type="button" className="btn btn-default" data-toggle="button" aria-pressed="false" autocomplete="off">
						<span className="glyphicon glyphicon-headphones"></span>
						</button>
					</li>
					<li>
						<button type="button" className="btn btn-default" data-toggle="button" aria-pressed="false" autocomplete="off">
						<span className="glyphicon glyphicon-heart"></span>
						</button>
					</li>
					<li>
						<button type="button" className="btn btn-default" data-toggle="button" aria-pressed="false" autocomplete="off">
						<span className="glyphicon glyphicon-map-marker"></span>
						</button>
					</li>
				</ul>
			</div>
		);
	},

	_renderPlacque() {
		return (
			<div id="placque" className="col-sm-4">
				<div id="circ" className="center-block">
					<h4 id="circTitle" contentEditable="true">Official Name of Place</h4>
					<p>Est. 1894</p>
					<a href="javascript:;"><i className="fa fa-pencil"></i></a>
				</div>
			</div>
		);
	}
});