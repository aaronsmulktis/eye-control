// Home Box component - represents a single todo item
HomeBox = React.createClass({

  

  deleteThisHome(evt) {
      evt.nativeEvent.stopImmediatePropagation();
      evt.cancelBubble = true
      this.refs.deleteModal.open("#modalOptions");
      return false;
  },
  deleteCallBack(result){
    if (result === true) {
         var id = this.props.home._id;
         Homes.remove({"_id": id});
         this.props.markers.forEach(function(element){
              if (element.id  == id){      
                  element.setVisible(false); ;
                } 
        });
    }
    return false;
  },
  editThisHome(evt) {
      evt.nativeEvent.stopImmediatePropagation();
      evt.cancelBubble = true
      console.log(this.refs);
      this.refs["editModal"+this.props.home._id].open("#modalOptions");
      return false;
  },
  editCallBack(result){
    if (result === true) {
        Homes.update({ _id: this.props.home._id }, { $set: {
            name: this.refs.editName.value
        }});
    }
    return false;
  },
    selectHome(evt) {
        evt.nativeEvent.stopImmediatePropagation();
        evt.cancelBubble = true
          
        if ($(evt.target).hasClass("homeBox") )  
            window.location = 'home/' + this.props.home.name+"/"+this.props.home._id + (this.props.edit == "1"  ? "?edit=1" :"");
        else return false;
        
    },

  getInitialState() {
      return {
          condition:false
      }
  },

  handleClick() {
      this.setState( { condition : !this.state.condition } );
  },

  lightenMarker(icon){
    var id = this.props.home._id;
    var color ;
    this.props.markers.forEach(function(element){
      if (element.id  == id){      
          color = element.getIcon();
          element.setIcon(icon);
        } 
    });
     this.setState( { oldColor : color} );
    return true;
  },

  handleOver(e) {
      this.setState( { over : true} );
    this.lightenMarker('img/light.png');
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
    $(function() {
            $( "#rooms-list" ).sortable();
            $( "#rooms-list" ).disableSelection();
        });
        console.log("mount");
    let isViewed =Cookie.getViewed().indexOf(this.props.home._id) >= 0;    
    const homeClassName = this.props.home._id;
    const homeLink = 'home/' + this.props.home.name+"/"+this.props.home._id;
    var price = this.props.home.price;
    let editMode = this.props.edit == "1" ? true : false;
    price = price && accounting.formatMoney(price, "£", 0, ".", ",");
    var vaultUrl = 'http://vault.ruselaboratories.com/proxy?url=' + encodeURIComponent(this.props.home.propPic) + '&resize=1&width=200';
    let deleteModalOptions = {
          title: "Delete Home",
          doneButton:"Delete",
          doneButtonIcon:"glyphicon glyphicon-close",
      };
        let editModalOptions = {
          title: "Edit Home",
          doneButton:"Edit",
          doneButtonIcon:"glyphicon glyphicon-edit",
      };
      return (
              <li id="homeBox" className={homeClassName + ' homeBox container-fluid'} onClick={this.selectHome} onMouseOver={this.handleOver}  onMouseOut={this.handleOut}>
              <div className="boxBorder"></div>              
              <p className="price">{price}</p>
              
              {editMode ? <a href="javascript:;" className="delete" onClick={this.deleteThisHome}><i className="fa fa-close"></i></a> : ""}
              {editMode ? <a href="javascript:;" className="edit" onClick={this.editThisHome}><i className="fa fa-edit"></i></a> : ""}
              <div className="homePic col-sm-4 noPadding">
                  <img src={vaultUrl} />
              </div>
              <div className="propDetails col-sm-8">
                  
                  <h4 className="homeName"><small>{String.fromCharCode(this.props.home.position+65)}</small> <strong> {this.props.home.name}</strong></h4>
                  { isViewed  ? <p className="viewedTag">VIEWED</p> : ''}
                  <p className="homeDesc">
                      {this.props.home.address}
                  </p>
                  <p>{this.props.home.numBedrooms} <i className="fa fa-bed"></i> | {this.props.home.numBathrooms} <i className="fa fa-recycle"></i></p>
              </div>
              <br/>
              <Modal options={deleteModalOptions} ref="deleteModal"  id="deleteModal"  onDone={this.deleteCallBack}>
                <strong>  {"Are you sure you want to delete " + this.props.home.name + "?"}</strong>     
              </Modal>
              <Modal options={editModalOptions} ref={"editModal"+this.props.home._id} id={"editModal"+this.props.home._id}  onDone={this.editCallBack}>
                <strong> Property Name:  </strong>   
                  <input type="text" placeholder={this.props.home.name} ref="editName" />
              </Modal>
          </li>
      );
  }
});
