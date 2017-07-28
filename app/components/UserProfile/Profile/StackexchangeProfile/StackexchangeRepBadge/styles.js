import styled from 'styled-components';
import FaStackOverflow from 'react-icons/lib/fa/stack-overflow';

export const Reputation = styled.div`
  padding: 5px 0;
  font-size: 22px;
  font-weight: 300;
  color: #181a1c;
`

export const LabelUppercase = styled.span`
  text-transform: uppercase;
  font-size: 11px;
  font-weight: 500;
  color: #999;
  vertical-align: middle;
`

export const Badge = styled.span`
  display: inline-block;
  margin: 2px;
  padding: 7px;
  border: 1px solid transparent;
  border-radius: 2px;
`

export const BadgeGold = styled(Badge)`
  background: #fff8e2;
  border-color: #ece3c8;
`

export const BadgeSilver = styled(Badge)`
  background: #edeeef;
  border-color: #e0e1e3;
`

export const BadgeBronze = styled(Badge)`
  background: #f9ebe1;
  border-color: #f1decc;
`

export const BadgeDot = styled.span`
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

export const DotGold = styled(BadgeDot)`
  background: #FFCC01;
`

export const DotSilver = styled(BadgeDot)`
  background: #B4B8BC;
`

export const DotBronze = styled(BadgeDot)`
  background: #D1A684;
`

export const BadgeCount = styled.span`
  color: #535a60;
  font-size: 12px;
  font-weight: bold;
`

export const SOIcon = styled(FaStackOverflow)`
  vertical-align: baseline !important;
  font-size: 15px;
  color: #999;
`
