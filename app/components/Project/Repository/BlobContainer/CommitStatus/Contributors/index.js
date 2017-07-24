import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import styled from 'styled-components';
import { compose, mapProps } from 'recompose';
import { LinkUserPhoto } from 'components/shared/Links';

const DivContributor = styled.div`
  padding: 10px;
  border-top: 0px;
  border:1px solid #c8e1ff;
  border-radius:3px;
  border-top-right-radius:0;
  border-top-left-radius:0;
`

const SpanPhoto = styled.span`
  margin-left: 5px;
`

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
    contributors: graphql`
      fragment Contributors_contributors on CommitConnection {
        totalContributors
        contributors {
          userName
          ...LinkUserPhoto_user
        }
      }
    `,
  }),
  mapProps(({ contributors }) => ({ ...contributors }))
)(Contributors)
