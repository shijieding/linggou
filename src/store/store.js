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
                state.token = '89b41064531c9cd9a8874a39f3b4fee8';
            }
        },
        getFarmId (state,f) {
            if(f){
                state.farmId = f;
            }else {
                // state.farmId = window.localStorage.getItem('dsjfarmId');
                state.farmId = '5a30b4f8164288115ca4da31';
            }

        },
        getFarmSrc (state,s) {
            state.farmSrc = s;
        }
    }

});
export default store;
