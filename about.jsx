// MapKey = AIzaSyDI1UZpsaowlO7XYZK1V1d7cCRZ-fymBOs;

// Property component
About = React.createClass({

  render() {
    return (

      <div id="contentContainer">

        <div id="mainContent" className="col-sm-12 noPadding">

          {this.props.header}

          <div className="aboutPage text-center">

            <div className="aboutContent">
              <h1><span className="glyphicon glyphicon-sunglasses"></span> + <span className="glyphicon glyphicon-home"></span></h1>
              <h3>Virtual reality, meet real estate.</h3>
              <p>Eye Control allows Real Estate Agents to curate and play high-quality photosphere tours for a user wearing the GearVR headset. Using the Eye, Realtors can easily guide individual or multiple viewers through properties in real-time, with the ability to see what is being shown in the headset.</p>
            </div>

          </div>
        
        </div>

      </div>
 
    );
  }
});