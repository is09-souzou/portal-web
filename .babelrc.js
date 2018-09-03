const config = {
  presets: [
    "@babel/preset-react",
    "@babel/preset-typescript"
  ],
  plugins: [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-json-strings",
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-syntax-import-meta"
  ]
};

module.exports = config;
