import React from 'react';
import styled from 'styled-components';
import { Grid } from 'react-bootstrap';

const MainContainer = styled.div`
  border-top: 1px solid #eaecef;
`
const FooterContainer = styled(Grid)`
  padding-top: 20px;
  padding-bottom: 20px;
  line-height: 1.5;
  color: #586069;
`

const Footer = () => (
  <MainContainer>
    <FooterContainer>
      <div>
        <span>© 2017 Terrella, Inc.</span>
      </div>
    </FooterContainer>
  </MainContainer>
)

export default Footer
