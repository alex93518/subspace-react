import React, { PropTypes } from 'react';
import styled from 'styled-components';
import {
  MdLocationOn, MdInsertLink, MdHistory, MdAccessTime,
} from 'react-icons/lib/md';
import { FaStackOverflow } from 'react-icons/lib/fa';
import { Row, Col } from 'react-bootstrap';
import moment from 'moment';

const Icon = styled.span`
  vertical-align: bottom !important;
  font-size: 18px;
  margin-right: 6px;
`

const NumStatRow = styled(Row)`
  margin-bottom: 10px;
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

const FaIcon = styled(FaStackOverflow)`
  margin-bottom: 3px;
  margin-right: 8px;
`

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
