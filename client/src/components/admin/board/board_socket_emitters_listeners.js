import React, {useState, useContext, useCallback, useEffect} from 'react';
import {socket} from '../../../features/context/socketcontext_whiteboard';
// import { useSocket } from '../../features/context/SocketContext';
import {fabric} from 'fabric'

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
export const AddDrawEmitter = obj => {
  //console.log('addDrawEmitter', obj)
  return socket.emit('onPathCreated', obj)
}
export const AddObjectEmitter = obj => {
  //console.log('addObjectEmitter', obj)
  socket.emit('onObjectAdded', obj)
}

export const ModifyObjectEmitter = (obj) => {
  socket.emit('onObjectModified', obj)
}

export const RemoveObjectEmitter = (obj) => {
  socket.emit('onObjectRemoved', obj)
}

// listeners
export const AddDrawListener = canvas => {
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

export const AddObjectListener = canvas => {
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
      // } else if (obj.type === 'line' ) {
      //   console.log('listener')
      //   console.log(obj)
      //   var points = [obj.left,obj.top,obj.left+obj.width,obj.top+obj.height];
      //   console.log(points)
      //   object = new fabric.Line(points, {
      //     left:obj.left,
      //     top:obj.top,
      //     strokeWidth: obj.strokeWidth,
      //     stroke:obj.stroke,
      //     fill: obj.fill,
      //     width:obj.width,
      //     height:obj.height,
      //     // x1:obj.left,
      //     // y1:obj.top,
      //     // x2:obj.top+obj.left,
      //     // y2:obj.top+obj.height,
      //     originX: 'left',
      //     originY: 'top'
      //   });
      //   object = new fabric.Line(obj);
      } else if (obj.type === 'text' || obj.type === 'i-text') {
        object = new fabric.IText(obj.text, { 
          left: obj.left, 
          top: obj.top,
          fontWeight: 'normal',
          fontSize: 40,
          textAlign: 'left',
          fill: obj.fill,
          visible: true,
        })
      } else {
        return
      }
      
      object.set({id: id})
      canvas.add(object)
      //canvas.selection=true;
      canvas.renderAll()
    }
    
  })
}

export const ModifyObjectListener = canvas => {
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

export const RemoveObjectListener = canvas => {
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