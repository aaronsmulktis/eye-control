// Map component - entry component setup in router
Map = React.createClass({
    // This mixin makes the getMeteorData method work

    mixins: [ReactMeteorData, sortable.ListMixin],

    // Loads items from the Homes collection and puts them on this.data.homes
    getMeteorData() {
        var data = {};
        var handle = Meteor.subscribe("homes");

        if (handle.ready()) {
            data = {homes: Homes.find({}, {
                sort: {
                    createdAt: -1
                }
            }).fetch()
            }
        }
        return data;
    },

    renderHomeBoxes() {
        if (!this.data.homes) {
            return;
        }
        if (this.state.items.length == 0 && this.data.homes.length > 0) {
            this.setState({'items': this.data.homes});
        }
        var homes = this.state.items && this.state.items.length > 0 ? this.state.items : this.data.homes;
        var processedHomes = [];
        for (var i=0; i<homes.length;i++) {
            var home = homes[i],
                position = home.position || i;
            processedHomes[position] = <HomeBox key={home._id} home={home} name={home.name} propPic={home.propPic} latitude={home.latitude} longitude={home.longitude} index={position} {...this.movableProps}/>;
        }
        return <ul>{processedHomes}</ul>;
    },


    render() {
        if (!this.data.homes) {
            return (
                <div>Loading...</div>
            );
        }
        return (

            <div id="contentContainer" className="container-fluid noPadding">
                <div id="mainContent" className="col-sm-12 col-lg-10 col-lg-offset-1 noPadding">
                    <header>
                        {this.props.header}
                    </header>
                    <div className="container-fluid noPadding">
                        <div className="propList col-xs-6">
                            <h4 className="text-right">Property List</h4>
                            {this.renderHomeBoxes()}
                        </div>
                        <div id="mainMap" className="col-xs-6 noPadding">
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
