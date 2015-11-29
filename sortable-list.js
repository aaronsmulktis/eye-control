SortableList = React.createClass({

    mixins: [SortableMixin],

    getInitialState: function() {
        return {
            items: ['Mixin', 'Sortable']
        };
    },

    handleSort: function (evt) {},

    render: function() {
        return <ul>{
            this.state.items.map(function (text) {
                return <li>{text}</li>
            })
        }</ul>
    }
});