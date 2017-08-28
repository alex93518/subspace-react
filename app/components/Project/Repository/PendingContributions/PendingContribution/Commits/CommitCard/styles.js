import styled from 'styled-components';
import CardBase, { CardHeader as CardHeaderBase } from 'components/shared/Card';

export const CardHeader = styled(CardHeaderBase)`
  line-height: 24px;
  padding: 10px 20px !important;
  & div > .commitTitle {
    font-size: 15px !important;
    line-height: 24px !important;
    color: rgba(255,255,255,1) !important;
    font-weight: 500 !important;
  }
  & div > .commitSubheader {
    color: rgba(255,255,255,0.7) !important;
    & span > a {
      font-weight: 500 !important;
      color: rgba(255,255,255,0.9) !important;
    }
  }
  button > a {
    font-family: "Roboto", sans-serif;
    color: #999 !important;
  }
  .btn-group .btn+.btn {
    padding-bottom: 3px;
  }
`

export const Card = styled(CardBase)`
  margin-bottom: 5px;
  border-radius: 10px !important;
  background: #607D8B !important;
  & div > .expandIcon {
    color: #fff !important;
  }
`
