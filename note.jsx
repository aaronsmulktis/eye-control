// Note component - represents a single todo item
Note = React.createClass({
  propTypes: {
    // This component gets the note to display through a React prop.
    // We can use propTypes to indicate it is required
    note: React.PropTypes.object.isRequired
  },

  deleteThisNote() {
    Notes.remove(this.props.note._id);
  },

  render() {
    // Give notes a different className when they are checked off,
    // so that we can style them nicely in CSS
    const noteClassName = this.props.note.checked ? "checked" : "";

    return (
      <li className={noteClassName}>
        <a href="javascript:;" className="delete" data-confirm="You sure to delete this?" onClick={this.deleteThisNote}><i className="fa fa-close"></i></a>

        <span className="text">{this.props.note.text}</span>
      </li>
    );
  }
});