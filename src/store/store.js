import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

const store = new Vuex.Store({
    state:{
        // farmId:'test123',

        token:'f06b17e2dfcc4b6ff0015daafdd80d88',
        farmId:'5a30b4f8164288115ca4da31',
        // token:'',
        // farmId:'',
        farmSrc:''
    },
    mutations:{
        getToken (state,t) {
            if(t){
                console.log('store获取token');
                state.token = t;
            }else {
                console.log('localstorage获取token');
                // state.token = window.localStorage.getItem('dsjtoken');
                state.token = 'f06b17e2dfcc4b6ff0015daafdd80d88';
            }
        },
        getFarmId (state,f) {
            if(f){
                state.farmId = f;
            }else {
                state.farmId = window.localStorage.getItem('dsjfarmId');
                state.farmId = '5a30b4f8164288115ca4da31';
            }

        },
        getFarmSrc (state,s) {
            state.farmSrc = s;
        }
    }

});
export default store;
