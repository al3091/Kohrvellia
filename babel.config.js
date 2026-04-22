module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Metro (web) can't handle import.meta — replace with {} so import.meta.env is undefined
      ({ types: t }) => ({
        visitor: {
          MetaProperty(path) {
            if (
              path.node.meta.name === 'import' &&
              path.node.property.name === 'meta'
            ) {
              path.replaceWith(t.objectExpression([]));
            }
          },
        },
      }),
    ],
  };
};
