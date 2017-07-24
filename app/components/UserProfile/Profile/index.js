import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Tabs, Tab } from 'react-bootstrap';
import { compose, withState, mapProps, withHandlers } from 'recompose';
import withRelayFragment from 'relay/withRelayFragment';
import { graphql } from 'react-relay';
import R from 'ramda';
import FaPlusCircle from 'react-icons/lib/fa/plus-circle';
import FaStackOverflow from 'react-icons/lib/fa/stack-overflow';
import FaGithub from 'react-icons/lib/fa/github';
import FaGoogle from 'react-icons/lib/fa/google';
import FaAt from 'react-icons/lib/fa/at';
import {
  addGithubProvider, addStackexchangeProvider, addGoogleProvider,
} from 'redux/auth/actions';
import { getStackexchangeUserInfo } from 'utils/stackexchange';
import { getGithubUserInfo } from 'utils/github';
import LoadingIndicator from 'components/shared/LoadingIndicator';
import StackexchangeProfile from './StackexchangeProfile';
import GithubProfile from './GithubProfile';
import MainAccount from './MainAccount';
import { DivTabContent, SpanAddIcon, SpanIcon } from './styles';

const getTabTitle = (provider, providerData, isOwner) => {
  let providerAdd = null
  if (isOwner && !providerData) {
    providerAdd = <SpanAddIcon><FaPlusCircle /></SpanAddIcon>
  }

  let providerLogo = <SpanIcon />
  if (provider === 'Stackoverflow') {
    providerLogo = <SpanIcon><FaStackOverflow /></SpanIcon>
  } else if (provider === 'Github') {
    providerLogo = <SpanIcon><FaGithub /></SpanIcon>
  } else if (provider === 'Google') {
    providerLogo = <SpanIcon><FaGoogle /></SpanIcon>
  } else if (provider === 'Subspace') {
    providerLogo = <SpanIcon><FaAt /></SpanIcon>
  }

  return <span>{providerLogo}{provider}{providerAdd}</span>
}

const Profile = ({
  isOwner, user, children,
  stackexchangeProvider, googleProvider, githubProvider,
  stackexchangeData, githubData,
  tabKey, onTabSelect,
}) => (
  <div>
    <Tabs activeKey={tabKey} onSelect={onTabSelect} id="providerAccounts">
      <Tab
        eventKey={1}
        title={getTabTitle('Subspace', null, false)}
      >
        <DivTabContent>
          <MainAccount
            user={user}
            isOwner={isOwner}
            stackexchange={stackexchangeProvider}
            github={githubProvider}
            google={googleProvider}
            onProviderClick={onTabSelect}
          />
        </DivTabContent>
      </Tab>
      {
        (isOwner || stackexchangeProvider) &&
        <Tab
          eventKey={2}
          title={getTabTitle('Stackoverflow', stackexchangeProvider, isOwner)}
        >
          <DivTabContent>
            {
              stackexchangeData ?
                <StackexchangeProfile stackexchangeData={stackexchangeData} /> :
                <LoadingIndicator />
            }
          </DivTabContent>
        </Tab>
      }
      {
        (isOwner || githubProvider) &&
        <Tab
          eventKey={3}
          title={getTabTitle('Github', githubProvider, isOwner)}
        >
          <DivTabContent>
            {
              githubData ?
                <GithubProfile githubData={githubData} /> :
                <LoadingIndicator />
            }
          </DivTabContent>
        </Tab>
      }
    </Tabs>
    {children && (
      <Row>
        <Col md={12}>
          {children}
        </Col>
      </Row>
    )}
  </div>
);

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  children: PropTypes.node,
  stackexchangeProvider: PropTypes.object,
  googleProvider: PropTypes.object,
  githubProvider: PropTypes.object,
  stackexchangeData: PropTypes.object,
  githubData: PropTypes.object,
  isOwner: PropTypes.bool.isRequired,
  tabKey: PropTypes.number.isRequired,
  onTabSelect: PropTypes.func.isRequired,
}

export default compose(
  withRelayFragment({
    user: graphql`
      fragment Profile_user on User {
        id
        rawId
        userName
        fullName
        photoUrl
        providerAccounts(first: 10) {
          edges {
            node {
              userName
              provider
              providerId
            }
          }
        }
      }
    `,
  }),
  withState('tabKey', 'updateTabKey', 1),
  withState('stackexchangeData', 'updateStackexchangeData', null),
  withState('googleData', 'updateGoogleData', null),
  withState('githubData', 'updateGithubData', null),
  withHandlers({
    filterProvider: () => (provider, edges) => R.filter(R.where({
      node: R.propEq('provider', provider),
    }))(edges),
  }),
  mapProps(props => {
    const { user: { providerAccounts: { edges } } } = props
    const stackexchangeProvider = props.filterProvider('stackexchange', edges)
    const googleProvider = props.filterProvider('firebase-google.com', edges)
    const githubProvider = props.filterProvider('firebase-github.com', edges)
    const retProps = {
      ...props,
      stackexchangeProvider: stackexchangeProvider[0] ?
        stackexchangeProvider[0].node : null,
      googleProvider: googleProvider[0] ? googleProvider[0].node : null,
      githubProvider: githubProvider[0] ? githubProvider[0].node : null,
    }

    return retProps
  }),
  withHandlers({
    fetchGithubUserInfo: props => providerId => {
      getGithubUserInfo(providerId).then(
        res => res.json().then(
          data => {
            if (data.id) {
              props.updateGithubData(data)
            }
          }
        )
      )
    },
    fetchStackexchangeUserInfo: props => providerId => {
      getStackexchangeUserInfo(
        providerId,
        props.accessToken
      ).then(
        res => res.json().then(
          data => {
            if (data.items[0]) {
              props.updateStackexchangeData(data.items[0])
            }
          }
        )
      )
    },
  }),
  withHandlers({
    onTabSelect: props => (key, isChangeTab = true) => {
      if (isChangeTab && key !== 4) {
        props.updateTabKey(key);
      }

      if (key === 4 && !props.googleProvider && props.isOwner) {
        addGoogleProvider(props.user.id, props.user.rawId)
      }

      if (key === 3 && !props.githubProvider && props.isOwner) {
        addGithubProvider(
          props.user.id, props.user.rawId, props.fetchGithubUserInfo
        )
      }

      if (key === 2 && !props.stackexchangeProvider && props.isOwner) {
        addStackexchangeProvider(
          props.user.id, props.user.rawId, props.fetchStackexchangeUserInfo
        )
      }

      // Get stackoverflow data
      if (key === 2 &&
        props.stackexchangeProvider &&
        !props.stackexchangeData
      ) {
        props.fetchStackexchangeUserInfo(props.stackexchangeProvider.providerId)
      }

      // Get github data
      if (key === 3 && props.githubProvider && !props.githubData) {
        props.fetchGithubUserInfo(props.githubProvider.providerId)
      }
    },
  })
)(Profile)
