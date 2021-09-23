/* eslint no-unused-vars: 0 */

/**
 * "Abstract" like base class for a Canvas tool
 */
class FabricCanvasTool {
  constructor(canvas) {
    this._canvas = canvas;
    this.isDragging = false;
    this.selection = true;
  }

  configureCanvas(props) {}

  doMouseUp(event) {
    var that = this;
    this._canvas.on('mouse:up', function(event) {
      // on mouse up we want to recalculate new interaction
      // for all objects, so we call setViewportTransform
      this.setViewportTransform(this.viewportTransform);
      that.isDragging = false;
      that.selection = true;
    });
  }

  doMouseDown(event) {
    var that = this;
    this._canvas.on('mouse:down', function(event) {
      var evt = event.e;
      if (evt.altKey === true) {
        that.isDragging = true;
        that.selection = false;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
      }
    });
  }

  doMouseMove(event) {
    var that = this;
    this._canvas.on('mouse:move', function(event) {
      if (that.isDragging) {
        var e = event.e;
        var vpt = this.viewportTransform;
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        this.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
      }
    });
  }

  doMouseOut(event) {}

  doMouseWheel(event) {
    //console.log(event)
    let canv = this._canvas;
    this._canvas.on('mouse:wheel', function(event) {
      //if (event.e.altKey === true) {
        var delta = event.e.deltaY > 0.9 ? event.e.deltaY * 0.1 : event.e.deltaY * 0.2;
        var zoom = canv.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        canv.zoomToPoint({ x: event.e.offsetX, y: event.e.offsetY }, zoom);
        event.e.preventDefault();
        event.e.stopPropagation();
      //}
        
    });
  }
}

export default FabricCanvasTool;
