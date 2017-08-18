import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState, withHandlers, mapProps } from 'recompose';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { Grid } from 'react-bootstrap';
import RepoLink from 'components/shared/repo/TitleLink'
import Particles from 'react-particles-js';
import GoCode from 'react-icons/lib/go/code'
import GoIssueOpened from 'react-icons/lib/go/issue-opened'
import GoRepoPush from 'react-icons/lib/go/repo-push';
import FaObjectGroup from 'react-icons/lib/fa/object-group';
import MdHome from 'react-icons/lib/md/home';
import { withRouter } from 'react-router-dom';
import R from 'ramda';
import { particles } from './particles'
import { RepoTitle, NavLabel, Icon, MainNavTabs, NavItem } from './styles';

const getNavConfig = ({ owner: { userName }, name, stashes: { totalCount } }) => [
  {
    link: `/${userName}/${name}/#home`,
    label: (
      <NavLabel>
        <Icon><MdHome /></Icon> Home
      </NavLabel>
    ),
  },
  {
    link: `/${userName}/${name}`,
    label: (
      <NavLabel>
        <Icon><GoCode /></Icon> Code
      </NavLabel>
    ),
  },
  {
    link: `/${userName}/${name}#issues`,
    label: (
      <NavLabel>
        <Icon><GoIssueOpened /></Icon> Goals &amp; Issues
      </NavLabel>
    ),
  },
  {
    link: `/${userName}/${name}#metaspace`,
    label: (
      <NavLabel>
        <Icon><FaObjectGroup /></Icon> Metaspace
      </NavLabel>
    ),
  },
  {
    link: `/${userName}/${name}/master/pendingcontributions`,
    label: (
      <NavLabel>
        <Icon><GoRepoPush /></Icon> { totalCount } Pending Contributions
      </NavLabel>
    ),
  },
]

const TopContainer = ({
  activeKey, handleSelect, arrayNavs,
  repository: { name, owner, isPrivate },
}) => (
  <div>
    <div style={{ position: 'absolute', zIndex: 0 }}>
      <Particles
        params={particles}
        style={{ background: 'linear-gradient(159deg,#3561bf -26%,#00a8cb 79%)' }}
        height={114}
        width={'100vw'}
      />
    </div>
    <Grid>
      <RepoTitle style={{ position: 'relative' }}>
        <RepoLink
          repoName={name}
          isPrivate={isPrivate}
          userName={owner.userName}
          isWhite
        />
      </RepoTitle>
      <MainNavTabs
        bsStyle="tabs"
        onSelect={handleSelect}
        activeKey={
          R.filter(R.propEq('link', activeKey))(arrayNavs) ?
            activeKey : `/${owner.userName}/${name}`
        }
      >
        {arrayNavs.map(({ link, label }) => (
          <NavItem key={link} eventKey={link}>
            {label}
          </NavItem>
        ))}
      </MainNavTabs>
    </Grid>
  </div>
)

TopContainer.propTypes = {
  repository: PropTypes.object.isRequired,
  activeKey: PropTypes.string,
  handleSelect: PropTypes.func.isRequired,
  arrayNavs: PropTypes.array.isRequired,
}

export default compose(
  withRouter,
  withRelayFragment({
    repository: graphql`
      fragment TopContainer_repository on Repository {
        name
        isPrivate
        owner {
          userName
        }
        stashes {
          totalCount
        }
      }
    `,
  }),
  withState('activeKey', 'setActiveKey',
    props => props.history.location.pathname
  ),
  withHandlers({
    handleSelect: props => link => {
      props.setActiveKey(link)
      props.history.push(link)
    },
  }),
  mapProps(props => {
    const { owner, name, stashes } = props.repository
    const arrayNavs = getNavConfig({ owner, name, stashes })

    return {
      arrayNavs,
      ...props,
    }
  })
)(TopContainer);
