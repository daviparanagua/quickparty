import Vue from 'vue';
import Vuex from 'vuex';
import uuid from 'uuid/v4';

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
        let localUserData = JSON.parse(localStorage.getItem('user') || '{}'); // Obter dados do usuário do localStorage
        Object.assign(localUserData, payload); // Anexar/Substituir dados do usuário conforme payload

        console.log(payload);

        localUserData.uuid = localUserData.uuid || uuid();

        localStorage.setItem('user', JSON.stringify(localUserData)); // Salvar valores alterados no localStorage
        context.commit('setUserData', localUserData); // Inserir valores no state
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
