import React, { PropTypes } from 'react';
import styled from 'styled-components';
import {
  MdLocationOn, MdInsertLink, MdHistory, MdAccessTime,
} from 'react-icons/lib/md';
import { FaGithub } from 'react-icons/lib/fa';
import { Row, Col } from 'react-bootstrap';
import moment from 'moment';

const Icon = styled.span`
  vertical-align: bottom !important;
  font-size: 18px;
  margin-right: 6px;
`

const NumStatRow = styled(Row)`
  margin-bottom: 10px;
  text-align: center;
`

const NumStat = styled.div`
  color: #0C0D0E;
  font-weight: 700;
  font-size: 17px;
`

const InfoHead = styled.div`
  color: #808080;
  font-size: 14px;  
  border-bottom: 1px solid #999;
  margin-bottom: 10px;
  padding-bottom: 5px;
`

const FaIcon = styled(FaGithub)`
  margin-bottom: 3px;
  margin-right: 8px;
`

const GithubStats = ({ githubUser }) => (
  <div>
    <InfoHead>
      <FaIcon />Github Statistics
    </InfoHead>
    <NumStatRow>
      <Col md={3}>
        <NumStat>{githubUser.public_repos}</NumStat>
        repos
      </Col>
      <Col md={3}>
        <NumStat>{githubUser.public_gists}</NumStat>
        gists
      </Col>
      <Col md={3}>
        <NumStat>{githubUser.followers}</NumStat>
        followers
      </Col>
      <Col md={3}>
        <NumStat>{githubUser.following}</NumStat>
        following
      </Col>
    </NumStatRow>
    {githubUser.location &&
      <div>
        <Icon><MdLocationOn /></Icon>{githubUser.location}
      </div>
    }
    {githubUser.blog &&
      <div>
        <Icon><MdInsertLink /></Icon>
        <a href={githubUser.blog}>
          {githubUser.blog}
        </a>
      </div>
    }
    {githubUser.created_at &&
      <div>
        <Icon><MdHistory /></Icon>
        Github member since {' '}
        {moment(githubUser.created_at).fromNow()}
      </div>
    }
    {githubUser.updated_at &&
      <div>
        <Icon><MdAccessTime /></Icon>
        Last seen {' '}
        {
          moment(githubUser.updated_at).fromNow()
        } on Github
      </div>
    }
  </div>
)

GithubStats.propTypes = {
  githubUser: PropTypes.object.isRequired,
}

export default GithubStats
