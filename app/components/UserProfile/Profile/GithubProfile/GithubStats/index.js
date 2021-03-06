import React from 'react';
import PropTypes from 'prop-types';
import MdLocationOn from 'react-icons/lib/md/location-on'
import MdInsertLink from 'react-icons/lib/md/insert-link'
import MdHistory from 'react-icons/lib/md/history'
import MdAccessTime from 'react-icons/lib/md/access-time'
import { Col } from 'react-bootstrap';
import moment from 'moment';
import { InfoHead, FaIcon, NumStatRow, NumStat, Icon } from './styles';

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
