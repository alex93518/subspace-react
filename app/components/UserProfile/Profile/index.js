import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Tabs, Tab } from 'react-bootstrap';
import Relay from 'react-relay/classic';
import { createContainer } from 'recompose-relay';
import styled from 'styled-components';
import { compose, withState, mapProps, withHandlers } from 'recompose';
import R from 'ramda';
import FaPlusCircle from 'react-icons/lib/fa/plus-circle'
import FaStackOverflow from 'react-icons/lib/fa/stack-overflow'
import FaGithub from 'react-icons/lib/fa/github'
import FaGoogle from 'react-icons/lib/fa/google'
import FaAt from 'react-icons/lib/fa/at'
import {
  addGithubProvider, addStackexchangeProvider, addGoogleProvider,
} from 'redux/auth/actions';
import { getStackexchangeUserInfo } from 'utils/stackexchange';
import { getGithubUserInfo } from 'utils/github';
import StackexchangeProfile from './StackexchangeProfile'
import GithubProfile from './GithubProfile';
import MainAccount from './MainAccount';

const DivTabContent = styled.div`
  padding: 20px;
  border: 1px solid #ddd;
  border-top: 0px;
  background: #fcfcfc;
`

const SpanIcon = styled.span`
  vertical-align: text-bottom;
  margin-right: 4px;
`

const SpanAddIcon = styled.span`
  vertical-align: text-bottom;
  margin-left: 6px;
  color: #898989;
  font-size: 12px;
`

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
  } else if (provider === 'Terrella') {
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
        title={getTabTitle('Terrella', null, false)}
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
            <StackexchangeProfile stackexchangeData={stackexchangeData} />
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
            <GithubProfile githubData={githubData} />
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
  createContainer({
    fragments: {
      user: () => Relay.QL`
        fragment on User {
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
    },
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
