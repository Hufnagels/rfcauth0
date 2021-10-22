import React from 'react';

// Material

// custom
import Map from './Map';
import MapToolbar from './MapToolbar';
import Wrapper from '../../../components/common/Wrapper';

const Mindmap = () => {

  return (
      <Wrapper>
        <MapToolbar />
        <Map />
      </Wrapper>
  );
}

export default Mindmap;