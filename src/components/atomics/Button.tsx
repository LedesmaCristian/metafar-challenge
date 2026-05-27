import * as React from 'react';
import Button from '@mui/material/Button';
import { IButtonProps } from '../../types';

const CustomButton: React.FC<IButtonProps> = ({ type, variant, children }) => (
  <Button type={type} variant={variant}>
    {children}
  </Button>
);

export default CustomButton;
