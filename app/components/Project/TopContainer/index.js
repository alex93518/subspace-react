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
import Granim from 'granim';
import { particles } from './particles'
import {
  RepoTitle, NavLabel, Icon, MainNavTabs, NavItem, Badge,
} from './styles';

const getNavConfig = ({ owner: { userName }, name, stashes: { totalCount } }) => [
  {
    link: `/${userName}/${name}/#home`,
    label: (
      <NavLabel>
        <Icon><MdHome /></Icon> Home
      </NavLabel>
    ),
    gradients: [['#333b43', '#626b74']],
  },
  {
    link: `/${userName}/${name}`,
    label: (
      <NavLabel>
        <Icon><GoCode /></Icon> Code
      </NavLabel>
    ),
    gradients: [['#333b43', '#626b74']],
  },
  {
    link: `/${userName}/${name}#issues`,
    label: (
      <NavLabel>
        <Icon><GoIssueOpened /></Icon> Goals &amp; Issues
      </NavLabel>
    ),
    gradients: [['#333b43', '#626b74']],
  },
  {
    link: `/${userName}/${name}#metaspace`,
    label: (
      <NavLabel>
        <Icon><FaObjectGroup /></Icon> Metaspace
      </NavLabel>
    ),
    gradients: [['#333b43', '#626b74']],
  },
  {
    link: `/${userName}/${name}/master/pendingcontributions`,
    label: (
      <NavLabel>
        <Icon><GoRepoPush /></Icon> Pending Contributions
        <Badge badgeContent={totalCount} color="accent">
          <span />
        </Badge>
      </NavLabel>
    ),
    gradients: [['#3561bf', '#00a8cb']],
  },
]

class TopContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    if (this.granimCanvas) {
      const {
        activeKey, arrayNavs,
        repository: { name, owner },
      } = this.props
      const gradientStates = R.mergeAll(arrayNavs.map(nav => ({
        [nav.link]: {
          gradients: nav.gradients,
          loop: false,
        },
      })))

      const currentActiveKey = arrayNavs[activeKey] ?
        activeKey : `/${owner.userName}/${name}`

      this.props.setGranimInstance(new Granim({
        element: this.granimCanvas,
        name: 'basic-gradient',
        direction: 'diagonal',
        opacity: [1, 1],
        isPausedWhenNotInView: true,
        stateTransitionSpeed: 500,
        states: {
          'default-state': {
            gradients: gradientStates[currentActiveKey].gradients,
            loop: false,
          },
          ...gradientStates,
        },
      }))
    }
  }

  render() {
    const {
      activeKey, arrayNavsKeys, handleSelect, arrayNavs,
      repository: { name, owner, isPrivate },
    } = this.props
    return (
      <div>
        <canvas
          ref={el => { this.granimCanvas = el }}
          style={{
            position: 'absolute',
            zIndex: 0,
            width: '100vw',
            height: 114,
          }}
        ></canvas>
        <div style={{ position: 'absolute', zIndex: 0 }}>
          <Particles
            params={particles}
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
              isHead
            />
          </RepoTitle>
          <MainNavTabs
            bsStyle="tabs"
            onSelect={handleSelect}
            activeKey={
              arrayNavsKeys[activeKey] ?
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
  }
}

TopContainer.propTypes = {
  repository: PropTypes.object.isRequired,
  activeKey: PropTypes.string,
  handleSelect: PropTypes.func.isRequired,
  arrayNavs: PropTypes.array.isRequired,
  arrayNavsKeys: PropTypes.object.isRequired,
  setGranimInstance: PropTypes.func.isRequired,
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
  withState('granimInstance', 'setGranimInstance', null),
  withHandlers({
    handleSelect: props => link => {
      props.setActiveKey(link)
      props.history.push(link)
      if (props.granimInstance) {
        props.granimInstance.changeState(link)
      }
    },
  }),
  mapProps(props => {
    const { owner, name, stashes } = props.repository
    const arrayNavs = getNavConfig({ owner, name, stashes })
    const arrayNavsKeys = R.mergeAll(arrayNavs.map(nav => ({ [nav.link]: true })))
    return {
      arrayNavs,
      arrayNavsKeys,
      ...props,
    }
  }),
)(TopContainer);
