FlowRouter.route('/', {
  action: function() {
    ReactLayout.render(App, {
      header: <Header />,
      map: <Map />
    });
  }
});

FlowRouter.route('/home1', {
  action: function() {
    ReactLayout.render(Property, {
      header: <Header />,
      property: <property />
    });
  }
});