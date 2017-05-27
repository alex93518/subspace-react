import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { FaStackOverflow } from 'react-icons/lib/fa';

const Reputation = styled.div`
  padding: 5px 0;
  font-size: 22px;
  font-weight: 300;
  color: #181a1c;
`

const LabelUppercase = styled.span`
  text-transform: uppercase;
  font-size: 11px;
  font-weight: 500;
  color: #999;
  vertical-align: middle;
`

const Badge = styled.span`
  display: inline-block;
  margin: 2px;
  padding: 7px;
  border: 1px solid transparent;
  border-radius: 2px;
`

const BadgeGold = styled(Badge)`
  background: #fff8e2;
  border-color: #ece3c8;
`

const BadgeSilver = styled(Badge)`
  background: #edeeef;
  border-color: #e0e1e3;
`

const BadgeBronze = styled(Badge)`
  background: #f9ebe1;
  border-color: #f1decc;
`

const BadgeDot = styled.span`
  display: inline-block;
  position: relative;
  top: -1px;
  margin: 0;
  margin-right: 4px;
  width: 8px;
  height: 8px;
  vertical-align: middle;
  border-radius: 50%;
  background-image: none;
`

const DotGold = styled(BadgeDot)`
  background: #FFCC01;
`

const DotSilver = styled(BadgeDot)`
  background: #B4B8BC;
`

const DotBronze = styled(BadgeDot)`
  background: #D1A684;
`

const BadgeCount = styled.span`
  color: #535a60;
  font-size: 12px;
  font-weight: bold;
`

const SOIcon = styled(FaStackOverflow)`
  vertical-align: baseline !important;
  font-size: 15px;
  color: #999;
`

const StackexRepBadge = ({ stackexUser }) => (
  <div>
    <div>
      <h4><SOIcon /> Stackoverflow</h4>
    </div>
    <Reputation>
      {`${stackexUser.reputation} `}
      <LabelUppercase>reputation</LabelUppercase>
    </Reputation>
    <BadgeGold title={`${stackexUser.badge_counts.gold} gold badge`}>
      <DotGold />
      <BadgeCount>{stackexUser.badge_counts.gold}</BadgeCount>
    </BadgeGold>
    <BadgeSilver title={`${stackexUser.badge_counts.silver} silver badge`}>
      <DotSilver />
      <BadgeCount>{stackexUser.badge_counts.silver}</BadgeCount>
    </BadgeSilver>
    <BadgeBronze title={`${stackexUser.badge_counts.bronze} bronze badge`}>
      <DotBronze />
      <BadgeCount>{stackexUser.badge_counts.bronze}</BadgeCount>
    </BadgeBronze>
  </div>
)

StackexRepBadge.propTypes = {
  stackexUser: PropTypes.object.isRequired,
}

export default StackexRepBadge
