import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { compose, mapProps } from 'recompose';
import { LinkUserPhoto } from 'components/shared/Links';
import { DivContributor, SpanPhoto } from './styles';

const Contributors = ({
  contributors, totalContributors,
}) => (
  <DivContributor>
    {totalContributors} contributors
    {' '}
    {contributors.map(user =>
      (<SpanPhoto key={user.userName}>
        <LinkUserPhoto user={user} width={20} height={20} />
      </SpanPhoto>)
    )}
  </DivContributor>
);

Contributors.propTypes = {
  contributors: PropTypes.array.isRequired,
  totalContributors: PropTypes.number.isRequired,
};

export default compose(
  withRelayFragment({
    commitConnection: graphql`
      fragment Contributors_commitConnection on CommitConnection {
        totalContributors
        contributors {
          userName
          photoUrl
        }
      }
    `,
  }),
  mapProps(({ commitConnection }) => ({ ...commitConnection }))
)(Contributors)
