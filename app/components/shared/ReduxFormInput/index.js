import React from 'react';

export const ReduxFormInput = field => (
  <div>
    <input
      {...field.input}
      type={field.type}
      placeholder={field.placeholder}
      className="form-control"
    />
    <div style={{ height: 5 }} />
    {field.meta.touched &&
      field.meta.error &&
      <span className="error">{field.meta.error}</span>}
  </div>
);
