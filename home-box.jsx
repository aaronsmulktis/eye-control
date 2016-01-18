// Home Box component - represents a single todo item
HomeBox = React.createClass({

  mixins: [sortable.ItemMixin],

  deleteThisHome() {
      var result = confirm("Are you sure you want to delete " + this.props.home.name + "?");
      if (result === true) {
          Homes.remove({"_id": this.props.home._id});
      }
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
    var vaultUrl = 'http://vault.ruselaboratories.com/proxy?url=' + encodeURIComponent(this.props.home.propPic) + '&resize=1&width=200';

    return (
      <li href={homeLink} id="homeBox" className={homeClassName + ' noPadding homeBox container-fluid'}>
        <a href={homeLink} id="homeLink">
          <div className="boxBorder"></div>
          <p className="price">{this.props.home.price}</p>
          <a href="javascript:;" id="editToggle" className="edit"><i className="fa fa-pencil"></i></a>
          <a href="javascript:;" className="delete" onClick={this.deleteThisHome}><i className="fa fa-close"></i></a>
          <div className="homePic col-sm-4 noPadding">
            <img src={vaultUrl} />
          </div>
          <div className="propDetails col-sm-8">
            <h4 className="homeName">{this.props.home.name}</h4>
            <p className="homeDesc">
              {this.props.home.street}, {this.props.home.apt} <br />
              {this.props.home.city}, {this.props.home.postal} <br />
              {this.props.home.country}
            </p>
            <p>{this.props.home.rooms} <i className="fa fa-bed"></i> | {this.props.home.baths} <i className="fa fa-recycle"></i></p>
          </div>
        </a>
      </li>
    );
  }
});
