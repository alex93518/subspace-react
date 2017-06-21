import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Panel } from 'react-bootstrap';
import styled from 'styled-components';
import { compose, branch, renderNothing } from 'recompose';
import StackexchangeRepBadge from './StackexchangeRepBadge';
import StackexchangeInfo from './StackexchangeInfo';

const UserPanel = styled(Panel)`
  box-shadow: inset 0 90px 0 #e7e8ea;
  text-align: center;
`

const RowInfoPanel = styled(Row)`
  margin-top: 10px;
`

const HeadUserName = styled.h2`
  margin-top: 0px;
`

const BioDiv = styled.div`
  font-size: 15px;
  line-height: 20px;
  padding-right: 20px;
`

const StackexchangeProfile = ({ stackexchangeData }) => (
  <Row>
    <Col md={3}>
      <UserPanel>
        <img
          alt={stackexchangeData.display_name}
          src={stackexchangeData.profile_image}
          width={120}
          height={120}
          style={{ marginBottom: 10 }}
        />
        <StackexchangeRepBadge
          stackexchangeUser={stackexchangeData}
        />
      </UserPanel>
    </Col>
    <Col md={9}>
      <RowInfoPanel>
        <Col md={6}>
          <HeadUserName>{stackexchangeData.display_name}</HeadUserName>
          <BioDiv
            dangerouslySetInnerHTML={
              ({ __html: stackexchangeData.about_me })
            }
          />
        </Col>
        <Col md={6}>
          <StackexchangeInfo
            stackexchangeUser={stackexchangeData}
          />
        </Col>
      </RowInfoPanel>
    </Col>
  </Row>
)

StackexchangeProfile.propTypes = {
  stackexchangeData: PropTypes.object,
}

export default compose(
  branch(
    props => props.stackexchangeData === null,
    renderNothing
  )
)(StackexchangeProfile)
