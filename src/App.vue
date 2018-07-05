<template>
  <div id="app">
      <router-view v-on:loadShow="loadShow" v-on:loadErrShow="loadErrShow"></router-view>
      <Load v-show="loading"></Load>
      <LoadErr v-show="loaderr" v-on:loadErrShow="loadErrShow"></LoadErr>
  </div>
</template>

<script type="text/javascript">
    import Load from '@/components/loading'
    import LoadErr from '@/components/loadErr'

    export default {
        data() {
            return {
                loading:false,
                loaderr:false
            }
        },
        components:{
            Load,LoadErr
        },
        methods:{
            loadShow (bool) {
                if(bool){
                    this.loading = true;
                }else {
                    this.loading = false;
                }
            },
            loadErrShow (bool) {
                if(bool){
                    this.loaderr = true;
                }else {
                    this.loaderr = false;
                    this.$router.go(0);
                }
            }
        }
    }
</script>
<style src="./assets/css/breeder.css"></style>
<style>
    body {
        font-size: 10px!important;
    }
    /*过渡动画*/
    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
        opacity: 0
    }
    .slide-enter-active {
        transition: all .3s;
        position:relative;
        z-index: -99;
    }
    .slide-leave-active {
        transition: all .3s;
        position:relative;
        z-index: -99;
    }
    .slide-enter, .slide-leave-to {
        transform: translateY(-50px);
        position:relative;
        z-index: -99;
    }
    input[type=number] {
        -moz-appearance:textfield;
    }
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
</style>

