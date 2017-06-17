import React, { PropTypes } from 'react';
import {
  signInWithGithub,
  signInWithGoogle,
  signInWithStackexchange,
} from 'redux/auth/actions';
import styled from 'styled-components';
import FaGoogle from 'react-icons/lib/fa/google';
import FaGithub from 'react-icons/lib/fa/github';
import FaStackOverflow from 'react-icons/lib/fa/stack-overflow';
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
    <ButtonSignIn onClick={signInWithStackexchange}>
      <IconSO />{pretext || ''} Stackoverflow
    </ButtonSignIn>
  </div>
)

SocialLogin.propTypes = {
  pretext: PropTypes.string,
}

export default SocialLogin
