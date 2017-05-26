import React, { PropTypes } from 'react';
import {
  authActions,
  signInWithGithub,
  signInWithGoogle,
} from 'redux/auth/actions';
import styled from 'styled-components';
import { FaGoogle, FaGithub, FaStackOverflow } from 'react-icons/lib/fa';
import { ButtonGit } from 'components/shared/ButtonGit';

const ButtonSignIn = styled(ButtonGit)`
  height: 32px;
  width: 245px;
  margin-bottom: 7px;
`

const IconGithub = styled(FaGithub)`
  font-size: 22px;
  margin-right: 8px;
`

const IconGoogle = styled(FaGoogle)`
  font-size: 19px;
  margin-right: 8px;
`

const IconSO = styled(FaStackOverflow)`
  font-size: 19px;
  margin-right: 8px;
`

const SocialLogin = ({ pretext }) => (
  <div>
    <ButtonSignIn onClick={signInWithGoogle}>
      <IconGoogle />{pretext || ''} Google
    </ButtonSignIn>
    <ButtonSignIn onClick={signInWithGithub}>
      <IconGithub />{pretext || ''} GitHub
    </ButtonSignIn>
    <ButtonSignIn onClick={authActions.signInWithStackexchange.init}>
      <IconSO />{pretext || ''} Stackoverflow
    </ButtonSignIn>
  </div>
)

SocialLogin.propTypes = {
  pretext: PropTypes.string,
}

export default SocialLogin
