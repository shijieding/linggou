<template>
    <div>
        <div class="box">
            <div style="display:flex;justify-content: center;align-items:center;font-size: 18px;line-height: 30px;">
                <div class="nick"></div>物品领购成功
            </div>
            <div class="btn-box">
                <router-link to="/staffView/product">继续领取商品</router-link>
                <a :href="src">返回我的猪场</a>
            </div>
        </div>
    </div>
</template>

<script type="es6">
    export default {
        data() {
            return {
                history:''
            }
        },
        computed:{
            token () {
                if(this.$store.state.token){
                    return this.$store.state.token;
                }else {
                    let t = window.localStorage.getItem('dsjtoken');
                    return t;
                }

            },
            farmId () {
                if(this.$store.state.farmId){
                    return this.$store.state.farmId;
                }else {
                    let f = window.localStorage.getItem('dsjfarmId');
                    return f;
                }

            },
            src () {
                return this.$store.state.farmSrc;
            }
        },
        created () {
            this.history = window.localStorage.getItem('history');
        },
        methods: {}
    }
</script>

<style scoped>
    div.box {
        padding-top: 200px;
        text-align: center;
    }
    .nick {
        width:18px;
        height:18px;
        background: url("../../assets/img/nick.png");
        background-size: 100%;
        margin-right: 20px;
    }
    .btn-box {
        margin-top: 30px;
    }
    .btn-box a {
        padding:8px 12px;
        border-radius: 3px;
        font-size: 14px;
        border:1px solid #666;
        margin:0 20px;
    }
</style>
