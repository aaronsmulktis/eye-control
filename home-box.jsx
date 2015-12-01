// Home Box component - represents a single todo item
HomeBox = React.createClass({

  mixins: [sortable.ItemMixin],
  
  propTypes: {
    // This component gets the home to display through a React prop.
    // We can use propTypes to indicate it is required
    homeBox: React.PropTypes.object.isRequired
  },

  deleteThisHome() {
    Homes.remove(this.props.home._id);
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
    // Give homes a different className when they are checked off,
    // so that we can style them nicely in CSS
    const homeClassName = this.props.home.name;
    const homeLink = 'home/' + this.props.home._id;

    return (
      <li id="homeBox" className={homeClassName + ' noPadding homeBox container-fluid'}>
        <a href="javascript:;" id="editToggle" className="edit"><i className="fa fa-pencil"></i></a>
        <a href="javascript:;" className="delete" onClick={this.deleteThisHome}><i className="fa fa-close"></i></a>
        <div className="homePic col-sm-4 noPadding">
          <a href={homeLink}><img src={this.props.home.propPic} /></a>
        </div>
        <div className="propDetails col-sm-8">
          <h4 className="homeName"><a href={homeLink}>{this.props.home.name}</a></h4>
          <p className="homeDesc">{this.props.home.address}</p>
        </div>
      </li>
    );
  }
});