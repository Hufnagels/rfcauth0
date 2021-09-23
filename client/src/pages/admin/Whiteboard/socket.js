import React, {useState, useContext, useCallback, useEffect} from 'react';
import {socket, SocketContext} from '../../../features/context/socketcontext';
import {fabric} from 'fabric'

// export default function Socket() {
//   const wbsocket = useContext(SocketContext);
//   return wbsocket;
// }
const displaySocketDataFromJSONString = (data, canvasS) => {
  var canvasString = "{\"objects\":[";
  canvasString += data;
  canvasString += "], \"background\":\"\"}";
  var tmpCanvas = new fabric.Canvas();
  tmpCanvas.loadFromJSON(canvasString);
  for(var k in tmpCanvas.getObjects()) {
    canvasS.add(tmpCanvas._objects[k]);
  }
  tmpCanvas = null;
  canvasS.renderAll();
}

// emitters
export const addDrawEmitter = obj => {
  //console.log('addDrawEmitter', obj)
  socket.emit('onPathCreated', obj)
}
export const addObjectEmitter = obj => {
  //console.log('addObjectEmitter', obj)
  socket.emit('onObjectAdded', obj)
}

export const modifyObjectEmitter = (obj) => {
  socket.emit('onObjectModified', obj)
}

export const removeObjectEmitter = (obj) => {
  socket.emit('onObjectRemoved', obj)
}

// listeners
export const addDrawListener = canvas => {
  //socket.off('new-path')
  socket.on('new-path', data => {
    const { obj, id, username, email, roomname } = data;
    let object;
//console.log('addDrawListener')
    if(typeof id === 'undefined' || id === '') return
    displaySocketDataFromJSONString(obj, canvas);
    //displaySocketDataFromJSONString(obj, canvas);
    //object.set({id: id})
    //canvas.add(object)
    canvas.renderAll()
  })
  
}
export const addObjectListener = canvas => {
  socket.off('new-add')
  socket.on('new-add', data => {
//console.log(data)
    const {obj, id} = data
    let object
    let isExist = false;
    canvas.getObjects().forEach(object => {
      if (object.id === id) {
        isExist = true
      }
    })
    if(!isExist) {
      if (obj.type === 'rect') {
        object = new fabric.Rect({
          left:obj.left,
          top:obj.top,
          height: obj.height,
          width: obj.width,
          stroke: obj.stroke,
          strokeWidth: obj.strokeWidth,
          fill: obj.fill,
          transparentCorners: false,
          globalCompositeOperation: "source-over",
          clipTo: null,
        })
      } else if (obj.type === 'circle') {
        object = new fabric.Circle({
          left:obj.left,
          top:obj.top,
          radius: obj.radius,
          stroke: obj.stroke,
          strokeWidth: obj.strokeWidth,
          fill: obj.fill,
          transparentCorners: false,
          globalCompositeOperation: "source-over",
          clipTo: null,
        })
      } else if (obj.type === 'triangle') {
        object = new fabric.Triangle({
          left:obj.left,
          top:obj.top,
          width: obj.width,
          height: obj.height,
          stroke: obj.stroke,
          strokeWidth: obj.strokeWidth,
          fill: obj.fill,
          transparentCorners: false,
          globalCompositeOperation: "source-over",
          clipTo: null,
        })
      } else if (obj.type === 'line' ) {
        var points = [obj.x1,obj.y1,obj.x2,obj.y2];
        object = new fabric.Line(points, {
          left:obj.left,
          top:obj.top,
          strokeWidth: obj.strokeWidth,
          fill: obj.fill,
          stroke: obj.stroke,
          x1:obj.x1,
          y1:obj.y1,
          x2:obj.x2,
          y2:obj.y2,
          originX: 'center',
          originY: 'center'
        });
      } else if (obj.type === 'text') {
        object = new fabric.Text('Sample', { 
          left: obj.left, 
          top: obj.top,
          fontWeight: 'normal',
          fontSize: 40,
          textAlign: 'left',
          fill: obj.fill,
          text:'Sample',
          colorProperties: {
            fill: obj.fill
          },
        })
      } else {
        return
      }
      
      object.set({id: id})
      canvas.add(object)
      canvas.selection=true;
      canvas.renderAll()
    }
    
  })
}

export const modifyObjectListener = canvas => {
  socket.on('new-modification', data => {
    const { obj, id } = data
    canvas.getObjects().forEach(object => {
      if (object.id === id) {
        object.set(obj)
        object.setCoords()
        canvas.renderAll()
      }
    })
  })
}

export const removeObjectListener = canvas => {
  socket.off('new-remove')
  socket.on('new-remove', data => {
    const { obj, id } = data
    canvas.getObjects().forEach(object => {
      if (object.id === id) {
        canvas.remove(object)
        canvas.renderAll()
      }
    })
  })
}

//export default socket