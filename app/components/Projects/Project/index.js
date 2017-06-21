import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment'
import Relay from 'react-relay/classic'
import styled from 'styled-components'
import { Panel, Row, Col } from 'react-bootstrap'
import RepoLink from 'components/shared/repo/TitleLink'

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`
const Topic = styled.span`
  margin-right: 10px;
  padding: 3px 10px;
  border-radius: 5px;
  border: 1px solid lightgrey;
`
const CreationDate = styled.div`
  margin-top: 15px;
`

const Project = ({
  project: {
    name,
    createdAt,
    owner,
    project: {
      goals,
      description,
      topics: {
        edges: topics,
      },
    },
  },
}) => (
  <Panel>
    <Row>
      <Col sm={9} md={9}>
        <TitleRow>
          <RepoLink userName={owner.userName} repoName={name} />
          {topics.map(({ node: { value } }) => (
            <Topic key={value}>{value}</Topic>
          ))}
        </TitleRow>
        {goals && <div>Goals: {goals}</div>}
        <div>{description}</div>
      </Col>
      <Col sm={3} md={3} className="text-right">
        <div>Contributors</div>
        <div>Live Users</div>
        <CreationDate>
          Created: {moment(createdAt).format('MMMM Do YYYY')}
        </CreationDate>
      </Col>
    </Row>
  </Panel>
)

Project.propTypes = {
  project: PropTypes.object.isRequired,
}

export default Relay.createContainer(Project, {
  fragments: {
    project: () => Relay.QL`
      fragment on Repository {
        id
        name
        isPrivate
        createdAt
        owner {
          userName
        }
        project {
          goals
          description
          topics(first: 10) {
            edges {
              node {
                value
              }
            }
          }
        }
      }
    `,
  },
})
