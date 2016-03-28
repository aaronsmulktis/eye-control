
Modal = React.createClass({
    getInitialState() {
        return {
            visible : false
        }
    },
    open(modalSelector){

       modalSelector = "#"+this.props.id;
       var callback = this.props.callback;
       var callbackChild = (this.props.children && this.props.children.props) ? this.props.children.props.callback : null;
       $(modalSelector).modal('show');
       $(modalSelector).on('hidden.bs.modal', function () {
         if (callbackChild) {callbackChild();  }
         else if (callback) {callback(); }
         return true;
      })       
    }, 
    
    render : function() {
       
        return (
        <div id={this.props.id} className="modal fade" tabIndex="-1" role="dialog">
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