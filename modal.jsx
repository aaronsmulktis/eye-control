
Modal = React.createClass({
    getInitialState() {
      console.log(this.props);
        return {
            visible : false
        }
    },
    open(modalSelector){

       modalSelector = "#"+this.props.id;
       var callback = this.props.callback;
       $(modalSelector).modal('show');
       $(modalSelector).on('hidden.bs.modal', function () {
          callback();
      })       
    }, 
    
    render : function() {
       
        return (
        <div id={this.props.id} className="modal fade" tabindex="-1" role="dialog">
  <div className="modal-dialog">
    <div className={this.props.options.class + " modal-content"}>
      <div className="modal-header">
        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h5 className="modal-title"> {this.props.options.title} </h5>
      </div>
      
      <div className="modal-body">
         {this.props.children}
      </div>
      <div id="Body"></div>
      { this.props.options.noFooter ? "" :
      <div className="modal-footer">
        <button type="button"  className="btn btn-primary" > <span className={this.props.options.optButtonIcon}></span>{this.props.options.optButton}</button>
         <button type="button"  className="btn btn-primary" > <span className={this.props.options.opt2ButtonIcon}></span>{this.props.options.opt2Button}</button>
         <button type="button"  className="btn btn-default " data-dismiss="modal"> <span className={this.props.options.doneButtonIcon}></span>{this.props.options.doneButton}</button>
      </div>
      }
    </div>
  </div>
</div>
        );
    }
});