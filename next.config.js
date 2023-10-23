const nextTranslate = require('next-translate-plugin')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextTranslate({
  output: 'standalone',
}))
