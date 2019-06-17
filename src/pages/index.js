import React from 'react';
import { Link } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

const IndexPage = () => {
  return (
    <Layout>
      <SEO title="Home" />

      <Link to="/play-visual">Play audio with real-time spectogram</Link>
    </Layout>
  );
};

export default IndexPage;
