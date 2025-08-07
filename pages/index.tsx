import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';

interface FreeGuideAccessProps {
  htmlContent: string;
  cssContent: string;
}

export const getServerSideProps: GetServerSideProps<FreeGuideAccessProps> = async () => {
  try {
    const response = await fetch('https://go.usmarketmastery.com/free-guide-access');
    const text = await response.text();

    // Simple regex to extract body content and style tags. This might not be robust for all pages.
    const bodyMatch = text.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    let htmlContent = '';
    if (bodyMatch && bodyMatch[1]) {
      htmlContent = bodyMatch[1];
    }

    const styleMatches = text.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    let cssContent = '';
    if (styleMatches) {
      cssContent = styleMatches.join('\n');
    }

    return {
      props: {
        htmlContent,
        cssContent,
      },
    };
  } catch (error) {
    console.error('Error fetching content:', error);
    return {
      props: {
        htmlContent: '<p>Error loading content.</p>',
        cssContent: '',
      },
    };
  }
};

const FreeGuideAccess: React.FC<FreeGuideAccessProps> = ({ htmlContent, cssContent }) => {
  return (
    <>
      <Head>
        <title>Free Guide Access</title>
        <style>{cssContent}</style>
      </Head>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </>
  );
};

export default FreeGuideAccess;