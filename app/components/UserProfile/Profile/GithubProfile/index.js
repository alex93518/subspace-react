import React, { PropTypes } from 'react';
import { Row, Col, Panel } from 'react-bootstrap';
import styled from 'styled-components';
import { compose, branch, renderNothing } from 'recompose';
import GithubStats from './GithubStats';

const UserPanel = styled(Panel)`
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
        <Col md={7}>
          <HeadUserName>{githubData.login}</HeadUserName>
          {githubData.bio && <BioDiv>{githubData.bio}</BioDiv>}
        </Col>
        <Col md={5}>
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
