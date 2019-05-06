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
      token: null,
      user: {},
      socket: {},
      windowTitle: 'MultiChat',
      chatHistory: {}
    },
    mutations: {
      initialiseStore (state) {
        // Check if the ID exists
        if (localStorage.getItem('store')) {
          // Replace the state object with the stored item
          this.replaceState(
            Object.assign(state, JSON.parse(localStorage.getItem('store')))
          );
        }
      },
      setTitle (state, payload) {
        state.windowTitle = payload;
        window.document.title = `Multichat ${state.windowTitle}`;
      },
      setUserData (state, payload) {
        state.user = payload;
      },
      setToken (state, payload) {
        state.token = payload;
      },
      setSocket (state, payload) {
        state.socket = payload;
      },
      addToChatHistory (state, payload) {
        state.chatHistory[payload] = true;
      }
    },
    actions: {
      setUserData (context, payload) {
        let localUserData = context.state.user;
        localUserData = Object.assign({}, localUserData, payload); // Anexar/Substituir dados do usuário conforme payload
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

  Store.commit('initialiseStore');

  // Subscribe to store updates
  Store.subscribe((mutation, state) => {
    // Store the state object as a JSON string
    let savedState = Object.assign({}, state);
    delete savedState.socket;
    localStorage.setItem('store', JSON.stringify(savedState));
  });

  return Store;
}
