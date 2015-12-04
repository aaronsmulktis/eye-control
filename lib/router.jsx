FlowRouter.route('/', {
  action: function() {
    ReactLayout.render(MapWrapper, {
      header: <Header />
    }
    );
    initialize();
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
      // items: this.data.notes
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
