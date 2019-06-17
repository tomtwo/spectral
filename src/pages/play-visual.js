import React, { useState, useCallback } from 'react';
// import { Link } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';
import FilePreview from '../components/FilePreview';
import FileDropzone from '../components/FileDropzone';
import SpectralCanvas from '../components/SpectralCanvas';

async function readBlobAsArrayBuffer(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsArrayBuffer(blob);
  });
}

const IndexPage = () => {
  const [file, setFile] = useState(null);
  const [fileArrayBuffer, setFileArrayBuffer] = useState(null);

  const onDrop = useCallback(async acceptedFiles => {
    console.log('got files>', ...acceptedFiles);

    const file = acceptedFiles[0];
    setFile(file);

    const arraybuf = await readBlobAsArrayBuffer(file);
    setFileArrayBuffer(arraybuf);
  }, []);

  const onClear = useCallback(() => {
    setFile(null);
    setFileArrayBuffer(null);
  }, []);

  return (
    <Layout>
      <SEO title="Play Visual" />

      {file ? (
        <FilePreview file={file} onClear={onClear} />
      ) : (
        <FileDropzone onDrop={onDrop} />
      )}
      {fileArrayBuffer && <SpectralCanvas arraybuf={fileArrayBuffer} />}
    </Layout>
  );
};

export default IndexPage;
