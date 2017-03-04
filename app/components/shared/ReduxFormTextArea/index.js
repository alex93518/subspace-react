import React from 'react';

export const ReduxFormTextArea = field => (
  <div>
    <textarea {...field.input} rows={field.rows} className="form-control" />
    <div style={{ height: 5 }} />
    {field.meta.touched &&
      field.meta.error &&
      <span className="error">{field.meta.error}</span>}
  </div>
);
