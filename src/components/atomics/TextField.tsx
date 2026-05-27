import * as React from 'react';
import { TextField } from '@mui/material';

interface ISearchFieldProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchField: React.FC<ISearchFieldProps> = ({ label, value, onChange }) => (
  <TextField label={label} variant="outlined" value={value} onChange={onChange} />
);

export default SearchField;
