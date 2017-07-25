import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import { compose, branch, renderNothing } from 'recompose';
import StackexchangeRepBadge from './StackexchangeRepBadge';
import StackexchangeInfo from './StackexchangeInfo';
import { UserPanel, RowInfoPanel, HeadUserName, BioDiv } from './styles';

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
