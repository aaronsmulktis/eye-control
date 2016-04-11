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
    var image = $(".gmnoprint > img")[this.props.home.position];
    console.log(image);
    this.props.home.isViewing = true;
    $(image).remove();
    //$(image).attr('src','http://design.ubuntu.com/wp-content/uploads/ubuntu-logo32.png');
    return true;
  },

  handleOver(e) {
    e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    this.lightenMarker();
    return true;
  },
    handleOut() {
      console.log("out");
      return true;
  },


  render() {
    // Give homes a different className when they are checked off,
    // so that we can style them nicely in CSS
    let isViewed =Cookie.getViewed().indexOf(this.props.home._id) >= 0;    
    const homeClassName = this.props.home._id;
    const homeLink = 'home/' + this.props.home.name+"/"+this.props.home._id;
    var price = this.props.home.price;
    price = price && accounting.formatMoney(price, "£", 0, ".", ",");
    var vaultUrl = 'http://vault.ruselaboratories.com/proxy?url=' + encodeURIComponent(this.props.home.propPic) + '&resize=1&width=200';

      return (
                 <li id="homeBox" className={homeClassName + ' homeBox container-fluid'} onClick={this.selectHome} onMouseOver={this.handleOver}  onMouseOut={this.handleOut}>
              <div className="boxBorder"></div>              
              <p className="price">{price}</p>
              {/*          <a href="javascript:;" id="editToggle" className="edit"><i className="fa fa-pencil"></i></a>*/}
              <a href="javascript:;" className="delete" onClick={this.deleteThisHome}><i className="fa fa-close"></i></a>
              <div className="homePic col-sm-4 noPadding">
                  <img src={vaultUrl} />
              </div>
              <div className="propDetails col-sm-8">
                  
                  <h4 className="homeName"><small>{this.props.home.position+1}</small> <strong> {this.props.home.name}</strong></h4>
                  {isViewed ? <p className="viewedTag">VIEWED</p> : ''}
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
