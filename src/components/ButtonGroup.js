import React from 'react';
import styled from 'styled-components';

const Buttons = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const Button = styled.button`
  border: 2px solid #333;
  background-color: transparent;
  padding: 10px 30px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #333;
    color: #fff;
  }
`;

// eslint-disable-next-line react/prop-types
const ButtonGroup = ({ enabled }) => (
  <Buttons>
    <Button className='toggleTimerButton' type='button'>
      {!enabled ? 'Start' : 'Stop'}
    </Button>
    <Button className='resetButton' type='button'>
      Reset
    </Button>
    <Button className='waitButton' type='button'>
      Wait
    </Button>
  </Buttons>
);

export default ButtonGroup;
