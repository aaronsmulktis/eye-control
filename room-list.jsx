Item = React.createClass({
	mixins: [sortable.ItemMixin],
	
	render() {
		return <li>item: {this.props.item}</li>;
	}
});

Rooms = React.createClass({
	mixins: [sortable.ListMixin],
	componentDidMount() {
		this.setState({ items: this.props.items });
	},
	render() {
		var items = this.state.items.map(function(item, i) {
			// Required props in Item (key/index/movableProps)
			return <Item key={item} item={item} index={i} {...this.movableProps}/>;
	    }, this);

	    return <ul>{items}</ul>;
	}
});