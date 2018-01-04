import Vue from 'vue';
import Vuex from 'vuex';
import { MutationTree, ActionTree } from 'vuex';
import * as T from '../types/common';
import * as App from "./app";
Vue.use(Vuex)

export interface RootState {
  appModule: App.AppState
}
 
export default new Vuex.Store<RootState>({
  modules: {
    appModule: App.module,
  }
});