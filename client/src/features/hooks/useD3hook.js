import React from 'react';
import * as d3 from 'd3';

const useD3hook = (treeFn, dependencies) => {
  const ref = React.useRef();
  //let initState = React.useRef(true)

  React.useEffect(() => {
//     if(initState.current) {
//       initState.current = false
//     } else {
//       treeFn(d3.select(ref.current));
// console.log('useD3hook inside initState')
//     }
    treeFn(d3.select(ref.current));
console.log('useD3hook')
    return () => {};
  }, dependencies);
  
  return ref;
}

export default useD3hook
