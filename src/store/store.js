import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

const store = new Vuex.Store({
    state:{
        // farmId:'test123',

        token:'',
        farmId:'',
        // token:'',
        // farmId:'',
        farmSrc:'http://wqs.znswsse.com/myfarm#/app_main/farm-nursery'
    },
    mutations:{
        getToken (state,t) {
            if(t){
                state.token = t;
            }else {
                // state.token = window.localStorage.getItem('dsjtoken');
                state.token = 'ffa0cb38cf1cab519b7a1d3d73e56008';
            }
        },
        getFarmId (state,f) {
            if(f){
                state.farmId = f;
            }else {
                // state.farmId = window.localStorage.getItem('dsjfarmId');
                state.farmId = '5a5d584b16428803c0c82f13';
            }

        },
        getFarmSrc (state,s) {
            state.farmSrc = s;
        }
    }

});
export default store;
