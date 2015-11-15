Header = React.createClass({
  render() {
    return (
      <nav id="topBar" className="navbar navbar-fixed">
        <div className="container-fluid">

          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a href="/" className="navbar-brand">Eye <i className="fa fa-eye 90degCC"></i> Control</a>
          </div>

          <div className="collapse navbar-collapse">
            <div id="searchBar" className="navbar-left">
              <form className="navbar-form navbar-left" role="search">
                <div className="form-group">
                  <input type="text" className="form-control" placeholder="Lookup anything..."></input>
                </div>
                <button type="submit" className="btn btn-default">Go</button>
              </form>
            </div>
            <ul className="navbar-nav navbar-right">
              <li><a href="/map">Map</a></li>
              <li><a href="#">Add Property</a></li>
              <li><a href="#">About</a></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});