// Task component - represents a single todo item
Task = React.createClass({
  propTypes: {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    task: React.PropTypes.object.isRequired
  },
 
  deleteThisTask() {
    Tasks.remove(this.props.task._id);
  },

  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    const taskClassName = this.props.task.checked ? "checked" : "";
    
    return (
      <li className={taskClassName}>
        <a href="#" className="delete" data-confirm="You sure to delete this?" onClick={this.deleteThisTask}><i className="fa fa-close"></i></a>
 
        <span className="text">{this.props.task.text}</span>
      </li>
    );
  }
});