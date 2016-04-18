// Home Box component - represents a single todo item
HomeBox = React.createClass({

  

  deleteThisHome(evt) {
      evt.preventDefault();
      var result = confirm("Are you sure you want to delete " + this.props.home.name + "?");
      if (result === true) {
          Homes.remove({"_id": this.props.home._id});
      }
      return false;
  },

    selectHome(evt) {
        evt.preventDefault();
        
            window.location = 'home/' + this.props.home.name+"/"+this.props.home._id;
        
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

  lightenMarker(){
    var id = this.props.home._id;
    var color ;
    this.props.markers.forEach(function(element){
      if (element.id  == id){      
          color = element.getIcon();
          element.setIcon('img/light.png');
        }
    });
     this.setState( { oldColor : color} );
    return true;
  },

  handleOver(e) {
      this.setState( { over : true} );
    this.lightenMarker();
    return true;
  },
    handleOut() {
      this.setState( { over : false} );
    var id = this.props.home._id;
    var oldColor = this.state.oldColor;
    
    if (!oldColor) return;
    this.props.markers.forEach(function(element){
      if (element.id  == id){      
          element.setIcon(oldColor);
        }
    });
    return true;
  },


  render() {
    // Give homes a different className when they are checked off,
    // so that we can style them nicely in CSS
    let isViewed =Cookie.getViewed().indexOf(this.props.home._id) >= 0;    
    const homeClassName = this.props.home._id;
    const homeLink = 'home/' + this.props.home.name+"/"+this.props.home._id;
    var price = this.props.home.price;
    console.log(this.props.edit);
    let editMode = this.props.edit == "1" ? true : false;
    price = price && accounting.formatMoney(price, "£", 0, ".", ",");
    var vaultUrl = 'http://vault.ruselaboratories.com/proxy?url=' + encodeURIComponent(this.props.home.propPic) + '&resize=1&width=200';

      return (
                 <li id="homeBox" className={homeClassName + ' homeBox container-fluid'} onClick={this.selectHome} onMouseOver={this.handleOver}  onMouseOut={this.handleOut}>
              <div className="boxBorder"></div>              
              <p className="price">{price}</p>
              { /*          <a href="javascript:;" id="editToggle" className="edit"><i className="fa fa-pencil"></i></a>*/}
              {editMode ? <a href="javascript:;" className="delete" onClick={this.deleteThisHome}><i className="fa fa-close"></i></a> : ""}
              <div className="homePic col-sm-4 noPadding">
                  <img src={vaultUrl} />
              </div>
              <div className="propDetails col-sm-8">
                  
                  <h4 className="homeName"><small>{this.props.home.position+1}</small> <strong> {this.props.home.name}</strong></h4>
                  { isViewed  ? <p className="viewedTag">VIEWED</p> : ''}
                  <p className="homeDesc">
                      {this.props.home.address}
                  </p>
                  <p>{this.props.home.numBedrooms} <i className="fa fa-bed"></i> | {this.props.home.numBathrooms} <i className="fa fa-recycle"></i></p>
              </div>
              <br/>
          </li>
      );
  }
});
