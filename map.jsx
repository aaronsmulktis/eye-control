// Map component - entry component setup in router
Map = React.createClass({
  // This mixin makes the getMeteorData method work

  mixins: [ReactMeteorData, sortable.ListMixin],
 
  // Loads items from the Homes collection and puts them on this.data.homes
  getMeteorData() {
    return {
      homes: Homes.find({}, {
        sort: {
          createdAt: -1
        }
      }).fetch()
    }
  },

  componentDidMount() {
   this.setState({ items: this.data.homes });
  },
 
  renderHomeBoxes() {

    var homes = this.state.items.map(function(home, i) {
      // Required props in Item (key/index/movableProps)
      return <HomeBox key={home._id} home={home} name={home.name} propPic={home.propPic} latitude={home.latitude} longitude={home.longitude} index={i} {...this.movableProps}/>;
    }, this);

    return <ul>{homes}</ul>;
  },

  render() {
    return (

      <div id="contentContainer" className="container-fluid noPadding">

        <div id="mainContent" className="col-sm-12 col-lg-10 col-lg-offset-1 noPadding">

          <header>
            {this.props.header}
          </header>

          <div id="mainMap" className="row-fluid"></div>

          <div className="propList row-fluid">
              {this.renderHomeBoxes()}
          </div>
        
        </div>

      </div>
 
    );
  }
});