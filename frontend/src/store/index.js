import Vue from 'vue';
import Vuex from 'vuex';

// import example from './module-example'

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({

    state: {
      user: {},
      windowTitle: 'MultiChat'
    },
    mutations: {
      setTitle (state, payload) {
        state.windowTitle = payload;
        window.document.title = `Multichat ${state.windowTitle}`;
      },
      setUserData (state, payload) {
        state.user = payload;
      }
    },
    actions: {
      setUserData (context, payload) {
        let localUserData = JSON.parse(localStorage.getItem('user') || '{}');
        Object.assign(localUserData, payload);
        localStorage.setItem('user', JSON.stringify(localUserData));
        context.commit('setUserData', localUserData);
      }
    },
    modules: {
      // example
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  });

  return Store;
}
