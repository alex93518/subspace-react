import React from 'react';
import styled from 'styled-components';
import Spinner from 'react-spinkit';

const Aligner = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`

const AlignerItem = styled.div`
  max-width: 50%;
`

const LoadingIndicator = () => (
  <Aligner>
    <AlignerItem>
      <Spinner fadeIn="half" name="line-scale" color="goldenrod" />
    </AlignerItem>
  </Aligner>
);

export default LoadingIndicator;
