import React from 'react';
import { useDropzone } from 'react-dropzone';

export default function FileDropzone({ onDrop }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} style={{ height: '50vh', textAlign: 'center' }}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag files here to analyse + play</p>
      )}
    </div>
  );
}
