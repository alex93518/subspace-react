import React from 'react';
import { FieldContainer, FieldInput } from './styles';

export const TextInput = field => (
  <FieldContainer width={field.width}>
    <FieldInput
      {...field.input}
      type={field.type}
      placeholder={field.placeholder}
      className="form-control"
    />
    <div style={{ height: 5 }} />
    {field.meta.touched &&
      field.meta.error &&
      <span className="error">{field.meta.error}</span>}
  </FieldContainer>
);
