import VueTimeago from 'vue-timeago';

// "async" is optional
export default async ({ Vue }) => {
  Vue.use(VueTimeago, {
    name: 'Timeago', // Component name, `Timeago` by default
    locale: 'pt', // Default locale
    // We use `date-fns` under the hood
    // So you can use all locales from it
    locales: {
      'pt': require('date-fns/locale/pt')
    }
  });
};
