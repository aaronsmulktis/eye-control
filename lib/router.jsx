FlowRouter.route('/', {
  action: function() {
    ReactLayout.render(Map, {
      header: <Header />
    });
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

FlowRouter.route('/home1', {
  action: function() {
    ReactLayout.render(Property, {
      header: <Header />,
      sphere: 'http://vault.ruselaboratories.com/vr?image_url=https://www.dropbox.com/s/tzvc9t2otjhd3qt/nctech-iris360-prototype-sample02.jpg?dl=0'
    });
  }
});