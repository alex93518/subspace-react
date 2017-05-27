import React, { PropTypes } from 'react';
import styled from 'styled-components';
import {
  MdLocationOn, MdInsertLink, MdHistory, MdAccessTime,
} from 'react-icons/lib/md';
import moment from 'moment';

const Icon = styled.span`
  vertical-align: bottom !important;
  font-size: 18px;
  margin-right: 6px;
`

const StackexInfo = ({ stackexUser }) => (
  <div>
    {stackexUser.location &&
      <div>
        <Icon><MdLocationOn /></Icon>{stackexUser.location}
      </div>
    }
    {stackexUser.website_url &&
      <div>
        <Icon><MdInsertLink /></Icon>
        <a href={stackexUser.website_url}>
          {stackexUser.website_url}
        </a>
      </div>
    }
    {stackexUser.creation_date &&
      <div>
        <Icon><MdHistory /></Icon>
        Stackoverflow member since {' '}
        {moment.unix(stackexUser.creation_date).fromNow()}
      </div>
    }
    {stackexUser.last_access_date &&
      <div>
        <Icon><MdAccessTime /></Icon>
        Last seen {' '}
        {moment.unix(stackexUser.last_access_date).fromNow()} on Stackoverflow
      </div>
    }
  </div>
)

StackexInfo.propTypes = {
  stackexUser: PropTypes.object.isRequired,
}

export default StackexInfo
