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

FlowRouter.route('/list', {
  action: function() {
    // getMeteorData() {
    //   return {
    //     notes: Notes.find({}, {
    //       sort: {
    //         createdAt: -1
    //       }
    //     }).fetch()
    //   }
    // };

    ReactLayout.render(List, {
      header: <Header />,
      // items: this.data.notes
    });
  }
});

FlowRouter.route('/home1', {
  action: function() {
    ReactLayout.render(Home, {
      header: <Header />
    });
  }
});

// FlowRouter.route('/home/:_id', {
//   action: function(params) {
//     ReactLayout.render(Home, {
//       header: <Header />
//     });
//   }
// });

FlowRouter.route('/home/:id', {
  name: 'home',
  // subscriptions: function(params) {
  //   this.register('singlePost', Meteor.subscribe('singlePost', params.id));
  // },
  action: function(params) {
    ReactLayout.render(Home, {
      header: <Header />,
      id: params.id,
      slug: params.slug
    });
    // ReactLayout.setRootProps({
    //   className: "ui middle aligned center aligned grid"
    // });
  }
});