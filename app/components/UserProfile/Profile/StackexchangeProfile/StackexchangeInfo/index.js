import React from 'react';
import PropTypes from 'prop-types';
import MdLocationOn from 'react-icons/lib/md/location-on'
import MdInsertLink from 'react-icons/lib/md/insert-link'
import MdHistory from 'react-icons/lib/md/history'
import MdAccessTime from 'react-icons/lib/md/access-time'
import { Col } from 'react-bootstrap';
import moment from 'moment';
import { InfoHead, FaIcon, NumStatRow, NumStat, Icon } from './styles';

const StackexchangeInfo = ({ stackexchangeUser }) => (
  <div>
    <InfoHead>
      <FaIcon />Stackoverflow Statistics
    </InfoHead>
    <NumStatRow>
      <Col md={6}>
        <NumStat>{stackexchangeUser.answer_count}</NumStat>
        answers
      </Col>
      <Col md={6}>
        <NumStat>{stackexchangeUser.question_count}</NumStat>
        questions
      </Col>
    </NumStatRow>
    {stackexchangeUser.location &&
      <div>
        <Icon><MdLocationOn /></Icon>{stackexchangeUser.location}
      </div>
    }
    {stackexchangeUser.website_url &&
      <div>
        <Icon><MdInsertLink /></Icon>
        <a href={stackexchangeUser.website_url}>
          {stackexchangeUser.website_url}
        </a>
      </div>
    }
    {stackexchangeUser.creation_date &&
      <div>
        <Icon><MdHistory /></Icon>
        Stackoverflow member since {' '}
        {moment.unix(stackexchangeUser.creation_date).fromNow()}
      </div>
    }
    {stackexchangeUser.last_access_date &&
      <div>
        <Icon><MdAccessTime /></Icon>
        Last seen {' '}
        {
          moment.unix(stackexchangeUser.last_access_date).fromNow()
        } on Stackoverflow
      </div>
    }
  </div>
)

StackexchangeInfo.propTypes = {
  stackexchangeUser: PropTypes.object.isRequired,
}

export default StackexchangeInfo
