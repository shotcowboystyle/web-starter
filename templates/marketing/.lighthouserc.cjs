module.exports = {
  ci: {
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.95 }],
      },
    },
    collect: {
      numberOfRuns: 2,
      staticDistDir: './dist/client',
      url: ['/', '/blog/future-of-web-dev/'],
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
