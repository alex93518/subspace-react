import React from 'react';
import PropTypes from 'prop-types';
import {
  SOIcon, Reputation, LabelUppercase, BadgeGold, DotGold,
  BadgeCount, BadgeSilver, DotSilver, BadgeBronze, DotBronze,
} from './styles'

const StackexchangeRepBadge = ({ stackexchangeUser }) => (
  <div>
    <div>
      <h4><SOIcon /> Stackoverflow</h4>
    </div>
    <Reputation>
      {`${stackexchangeUser.reputation} `}
      <LabelUppercase>reputation</LabelUppercase>
    </Reputation>
    <BadgeGold title={`${stackexchangeUser.badge_counts.gold} gold badge`}>
      <DotGold />
      <BadgeCount>{stackexchangeUser.badge_counts.gold}</BadgeCount>
    </BadgeGold>
    <BadgeSilver
      title={
        `${stackexchangeUser.badge_counts.silver} silver badge`
      }
    >
      <DotSilver />
      <BadgeCount>{stackexchangeUser.badge_counts.silver}</BadgeCount>
    </BadgeSilver>
    <BadgeBronze
      title={
        `${stackexchangeUser.badge_counts.bronze} bronze badge`
      }
    >
      <DotBronze />
      <BadgeCount>{stackexchangeUser.badge_counts.bronze}</BadgeCount>
    </BadgeBronze>
  </div>
)

StackexchangeRepBadge.propTypes = {
  stackexchangeUser: PropTypes.object.isRequired,
}

export default StackexchangeRepBadge
