// MapKey = AIzaSyDI1UZpsaowlO7XYZK1V1d7cCRZ-fymBOs;

// App component - represents the whole app
Map = React.createClass({
  // This mixin makes the getMeteorData method work

  mixins: [ReactMeteorData],
 
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
 
  renderHomes() {
    return this.data.homes.map((home) => {
      return <Home key={home._id} home={home} />;
    });
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
            <ul>
              {this.renderHomes()}
            </ul>
          </div>
        
        </div>

      </div>
 
    );
  }
});