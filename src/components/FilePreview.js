import React, { useCallback } from 'react';

export default function FilePreview({ file, onClear }) {
  const handleClear = useCallback(
    event => {
      if (typeof onClear === 'function') {
        onClear(event);
      }

      event.preventDefault();
    },
    [onClear]
  );

  return (
    <div style={{ marginBottom: 20 }}>
      File: <i>{file.name}</i> ({file.type}){' '}
      <small>
        (
        <a href="#clear-file" onClick={handleClear}>
          clear
        </a>
        )
      </small>
    </div>
  );
}
