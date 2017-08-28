import React from 'react';
import PropTypes from 'prop-types';
import Measure from 'react-measure';
import { compose, withState, withHandlers, mapProps } from 'recompose';
import { Scrollbars as BaseScrollbars } from 'react-custom-scrollbars';


const ScrollbarsBase = ({
  children,
  height,
  handleOnResize,
  ...rest
}) => (
  <BaseScrollbars
    style={{
      minHeight: '100vh',
      height,
    }}
    {...rest}
  >
    <Measure
      onResize={handleOnResize}
    >
      {({ measureRef }) =>
        (<div ref={measureRef}>
          {children}
        </div>)
      }
    </Measure>
  </BaseScrollbars>
)

ScrollbarsBase.propTypes = {
  children: PropTypes.node,
  handleOnResize: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
}

export const Scrollbars = compose(
  withState('height', 'setHeight', 0),
  withHandlers({
    handleOnResize: props => val => {
      props.setHeight(val.entry.height)
    },
  }),
  mapProps(({ setHeight, ...rest }) => ({ ...rest })),
)(ScrollbarsBase);
