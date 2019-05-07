import VueSocketIO from 'vue-socket.io';

// "async" is optional
export default async ({ Vue, store }) => {
  Vue.use(new VueSocketIO({
    debug: true,
    connection: process.env.SOCKET_URL,
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
    },
    options: {} // Optional options
  }));
};
