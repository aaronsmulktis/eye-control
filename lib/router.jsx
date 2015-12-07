FlowRouter.route('/', {
  action: function() {
    ReactLayout.render(MapWrapper, {
      header: <Header />
    });
  }
});

FlowRouter.route('/add', {
  action: function() {
    ReactLayout.render(Add, {
      header: <Header />
    });
  }
});

FlowRouter.route('/about', {
  action: function() {
    ReactLayout.render(About, {
      header: <Header />
    });
  }
});

FlowRouter.route('/list', {
  action: function() {
    ReactLayout.render(List, {
      header: <Header />,
    });
  }
});

FlowRouter.route('/home/:id', {
  name: 'home',
  action: function(params) {
    ReactLayout.render(HomeWrapper, {
      header: <Header />,
      id: params.id
    });
  }
});
