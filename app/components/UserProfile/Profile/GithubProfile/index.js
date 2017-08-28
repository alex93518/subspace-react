import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import { compose, branch, renderNothing } from 'recompose';
import GithubStats from './GithubStats';
import { UserPanel, RowInfoPanel, HeadUserName, BioDiv } from './styles';

const GithubProfile = ({ githubData }) => (
  <Row>
    <Col md={3}>
      <UserPanel>
        <img
          alt={githubData.login}
          src={githubData.avatar_url}
          width={140}
          height={140}
          style={{ marginBottom: 10 }}
        />
      </UserPanel>
    </Col>
    <Col md={9}>
      <RowInfoPanel>
        <Col md={6}>
          <HeadUserName>{githubData.login}</HeadUserName>
          {githubData.bio && <BioDiv>{githubData.bio}</BioDiv>}
        </Col>
        <Col md={6}>
          <GithubStats githubUser={githubData} />
        </Col>
      </RowInfoPanel>
    </Col>
  </Row>
)

GithubProfile.propTypes = {
  githubData: PropTypes.object,
}

export default compose(
  branch(
    props => props.githubData === null,
    renderNothing
  )
)(GithubProfile)
