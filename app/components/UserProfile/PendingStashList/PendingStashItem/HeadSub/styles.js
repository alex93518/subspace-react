import styled from 'styled-components';
import { yellow800, green500 } from 'material-ui/styles/colors'
import MdWarning from 'react-icons/lib/md/warning';

export const AddMetaDiv = styled.div`
  color: ${yellow800};
  font-weight: 400;
  font-size: 13px;
`

export const ReadyPublishDiv = styled.div`
  color: ${green500};
`

export const IconWarning = styled(MdWarning)`
  margin-right: 5px;
  margin-bottom: 2px;
`
