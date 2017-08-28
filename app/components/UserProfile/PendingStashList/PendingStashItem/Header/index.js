import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import moment from 'moment';
import { LinkProject } from 'components/shared/Links';
import { shortBranchName } from 'utils/string';
import { MainSpan, TimeSpan } from './styles';

const Header = ({
  createdAt,
  pendingStashItem: {
    name, repository,
    repository: { owner: { userName } },
  },
}) => (
  <MainSpan>
    <LinkProject vars={{ userName, projectName: repository.name }}>
      {repository.name}
    </LinkProject> / {shortBranchName(name)}
    <TimeSpan>
      pushed {moment(createdAt).fromNow()}
    </TimeSpan>
  </MainSpan>
)

Header.propTypes = {
  pendingStashItem: PropTypes.object.isRequired,
  createdAt: PropTypes.number.isRequired,
}

export default createFragmentContainer(Header, {
  pendingStashItem: graphql`
    fragment Header_pendingStashItem on Ref {
      repository {
        name
        owner {
          userName
        }
      }
      name
    }
  `,
})
