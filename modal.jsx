Modal = React.createClass({
    getInitialState() {
        return {
            visible : false
        }
    },
    onOpenPopup(content){
        console.log("open");
        
    },
    open(){
        console.log($('.modal').modal('show'));
        console.log("d");  
        console.log(this.props.options);
        
},
    componentDidUpdate() {
     
    },
    
    render : function() {
       
        return (
        <div id="modalVR" className="modal fade" tabindex="-1" role="dialog">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h5 className="modal-title"> {this.props.options.title} </h5>
      </div>
      <div className="modal-body">
        
      </div>
      <div className="modal-footer">
         <span className={this.props.options.optButton}></span><button type="button"  className="btn btn-primary" >{this.props.options.optButton}</button>
         <button type="button"  className="btn btn-primary" >{this.props.options.opt2Button}</button>
         <button type="button"  className="btn btn-default " data-dismiss="modal">{this.props.options.doneButton}</button>
      </div>
    </div>
  </div>
</div>
        );
    }
});