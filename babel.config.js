module.exports = function (api) {
  api.cache(true);

  const plugins = [];

  // Dodaj plugin do obsługi zmiennych środowiskowych z pliku .env
  plugins.push([
    'module:react-native-dotenv',
    {
      moduleName: '@env',
      path: '.env',
      blacklist: null,
      whitelist: null,
    },
  ]);

  return {
    presets: ['babel-preset-expo'],
    plugins,
  };
};