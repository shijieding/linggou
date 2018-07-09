<template>
    <div>
        <router-view v-on:loadShow="loadShow" v-on:loadErrShow="loadErrShow"></router-view>
        <Load v-show="loading"></Load>
        <LoadErr v-show="loaderr" v-on:loadErrShow="loadErrShow"></LoadErr>
        <div class="dsj_footer" v-show="showFoot">
            <div class="footer_flex">
                <a :href="history">
                    <span class="foot-item f1"></span>
                    <p>我的猪场</p>
                </a>
                <router-link :to="{path:'/staffView/product'}">
                    <span class="foot-item f2"></span>
                    <p>领购</p>
                </router-link>
                <router-link :to="{path:'/staffView/cart'}">
                    <span class="foot-item f3"></span>
                    <p>购物车</p>
                </router-link>
                <router-link :to="{path:'/staffView/myRecord'}">
                    <span class="foot-item f4"></span>
                    <p>我的</p>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
    import $ from 'jquery'
    import Load from '@/components/loading'
    import LoadErr from '@/components/loadErr'
/*    // let d = document.referrer;
    let d = 'http://wqs.znswsse.com/myfarm#/app_main/farm-nursery';
    console.log('地址'+d);*/

    export default {
        data() {
            return {
                showFoot:true,
                // src:d,
                // history:'',
                t:'',
                f:'',
                screenHeight:'',
                loading:false,
                loaderr:false
            }
        },
        components:{
            Load,LoadErr
        },
        computed:{
            token () {
                return this.$store.state.token;
            },
            farmId () {
                return this.$store.state.farmId;
            },
            history () {
              return this.$store.state.farmSrc;
            }
        },
        created(){
            let htmlHeight = $('body').height()-1;
            $(window).resize(function(){
                let height = $('body').height();
                console.log(height);
                if(height < htmlHeight){
                    $('div.dsj_footer').hide();
                }else if(height >= htmlHeight){
                    $('div.dsj_footer').show();
                }
            });
            /*this.history = window.localStorage.getItem('history');
            if(this.history){
                console.log('已经存在记录')
            }else {
                window.localStorage.setItem('history',this.src);
                this.history = window.localStorage.getItem('history');
            }*/


            if(this.$route.query.q_token && this.$route.query.q_farm) {
                this.t = this.$route.query.q_token;
                this.f = this.$route.query.q_farm;
                window.localStorage.setItem('dsjtoken',this.t);
                window.localStorage.setItem('dsjfarmId',this.f);
            }
            this.getToken();
            this.getFarmId();
            // this.getFarmSrc();
        },
        methods:{
            getToken () {
                this.$store.commit('getToken',this.t);
            },
            getFarmId () {
                this.$store.commit('getFarmId',this.f);
            },
/*            getFarmSrc () {
                console.log(this.src);
                this.$store.commit('getFarmSrc',this.src);
            },*/
            loadShow (bool) {
                if(bool){
                    this.loading = true;
                }else {
                    this.loading = false;
                }
            },
            loadErrShow (bool) {
                console.log('app');
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
<style src="@/assets/css/breeder.css"></style>
<style scoped>
    .dsj_footer .footer_flex p {
        color:#868686;
    }
    .footer_flex .router-link-active p {
        color:#fca030;
    }
    .foot-item {
        width:20px;
        height:20px;
        display:block;
        margin:0 auto;
        margin-top: 8px;
        background-size: 100%;
        background-repeat: no-repeat;
    }
    .f1 {
        background-image: url("../../assets/img/pig.png");
    }
    .router-link-active .f1 {
        background-image: url("../../assets/img/pigc.png");
    }
    .f2 {
        background-image: url("../../assets/img/getgood.png");
    }
    .router-link-active .f2 {
        background-image: url("../../assets/img/getgoodc.png");
    }
    .f3 {
        background-image: url("../../assets/img/cart.png");
    }
    .router-link-active .f3 {
        background-image: url("../../assets/img/cartc.png");
    }
    .f4 {
        background-image: url("../../assets/img/my.png");
    }
    .router-link-active .f4 {
        background-image: url("../../assets/img/myc.png");
    }


    body, html {
        margin: 0;
        padding: 0;
        font-size: 10px;
        height:100%;
    }

    body {
        font-family: Helvetica;
        overflow: scroll;
        overflow-x: auto
    }

    dd, div, dl, dt, h1, h2, h3, h4, h5, h6, img, input, li, ol, p, span, table, ul {
        margin: 0;
        padding: 0;
        border: 0;
        list-style: none;
        list-style-type: none
    }

    button, input, select {
        outline: 0;
        border: none
    }

    a {
        text-decoration: none
    }
    /*顶部列表*/
    .dsj_header {
        background-color: #f3f3f3;
        color: #222;
    }
    .dsj_header>ul {
        display: flex;
        height: 45px;
        line-height: 45px;
        justify-content:space-around;
    }
    .dsj_header>ul li {
        /*width: 20%;*/
        text-align: center;
        font-size: 15px;
    }
    .dsj_header>ul a.cur {
        border-bottom: 2px solid #555;
    }
    .dsj_header>ul a {
        color: #222;
        height: 100%;
        display: block;
        box-sizing: border-box;
        text-decoration: none;
    }
    a {
        text-decoration: none;
    }
    a:-webkit-any-link {
        color: -webkit-link;
        text-decoration: underline;
        cursor: auto;
    }


    .putInPig{
        min-height: 450px;
        /*border: 1px solid red;*/
        margin: 30px 50px;
    }

    .zwt_select{
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
    }
    .zwt_select>span{
        font-size: 16px;
        color: #0e0d0d;
        line-height: 40px;
    }
    .zwt_select>select{
        border: 1px solid #ccc;
        width: 188px;
        height: 42px;
        appearance:none;
        -moz-appearance:none;
        -webkit-appearance:none;
        background: url("../../assets/img/area_tip03.png") no-repeat scroll right center transparent;
        padding-right: 24px;
    }

    .zwt_select>input{
        border: 1px solid #ccc;
        width: 187px;
        height: 42px;
        text-align: center;
    }

    .zwt_select>select option{
        text-align: center;

    }
    select::-ms-expand { display: none; }

    .putIn_btn{
        display: block;
        background: #50555B;
        font-size: 16px;
        color: #fff;
        width:80px;
        height: 40px;
        margin: 0 auto;
        border-radius: 5px;

    }
    /*下拉菜单*/
    .dropdownContainer{position: relative;height: 42px;width: 188px;/*margin: 0 auto;*/}


    .dropdownDefault{border:1px solid #ddd;line-height: 40px;text-indent: 0.5em;}
    .dropdownContainer .downArrow{position: absolute;right: 12px;top: 18px;width: 20px;}
    .dropdrown-menu{position: absolute;top:100%;width: 100%;left: 0;display: none;border: 1px solid #ccc;  box-sizing:border-box;border-top: none;}
    .dropdrown-menu li{line-height: 40px; border-bottom: 1px solid #ccc; background: #fff;}
    .dropdrown-menu li:last-child{border: none;display: flex;justify-content:space-around;}
    .dropdrown-menu li a{display: inline-block;width: 100%;text-align:center;color:#666;text-decoration: none;}
    .dropdrown-menu li a:hover{background: #0078b6;font-size: 1.1em;}
    /*.arrow{width: 0;height: 0;display: inline-block;cursor: pointer;}*/
    /*.downArrow{border-left: 6px solid transparent;border-right: 6px solid transparent;border-top: 12px solid #fff;}*/
    .dropdrown-menu li:last-child>span{font-size: 16px;color: #565656;background: #fff;text-align: center;width: 50%;box-sizing:border-box;}
    .dropdrown-menu li:last-child>span:first-child{border-right: 1px solid #ccc;}


    /*遮挡层*/
    .overflowHiden{
        width: 100%;
        min-height:667px;
        position: absolute;
        background: #CCC;
        top: 0;
        left: 0;
        opacity: .3;
        filter: alpha(opacity=30);
        display: none;
    }
    /*弹出框*/
    .putInName{
        display: none;
        width: 280px;
        height: 150px;
        position: fixed;
        top: 50%;
        left: 50%;
        margin-top:-75px;
        margin-left: -140px;
        border-radius: 10px;
        background: #fff;
        z-index: 99;
    }
    .putInName h3{
        text-align: center;
        /*line-height: 30px;*/
        margin-top: 10px;
        color:#4c4c4c;
        font-size: 16px;
        font-weight: normal;
    }
    .putInName input{
        width: 200px;
        height: 30px;
        border: 1px solid #ccc;
        border-radius: 3px;
        margin: 10px auto;
        text-indent: 10px;
        display: block;
    }
    .putInName p{
        font-size: 16px;
        border-top:1px solid #ccc;
        border-radius:0 0 10px 10px;

        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 40px;
    }
    .putInName p>span{
        float: left;
        width: 50%;
        line-height: 40px;
        text-align: center;
    }
    .putInName p>span:first-child{
        box-sizing:border-box;
        border-right: 1px solid #ccc;
    }

    /*底部菜单样式*/
    .dsj_footer {
        position: fixed;
        bottom: 0;
        left: 0;
        height: 50px;
        width: 100%;
        background-color: #e5e3e3;
        border-top: 1px solid #b7b7b7;
    }
    .footer_flex{
        display: flex;
        justify-content: space-around;
        height:100%;
    }
    .footer_flex a{
        width:calc(100%/3);
        border-right:1px solid #b7b7b7;
        box-sizing:border-box;
        text-decoration: none;
    }
    .footer_flex a:last-child{
        border: none;
    }
    .footer_flex img{
        width: 30px;
        margin: 0 auto;
        display: block;
    }
    .footer_flex p{
        text-align: center;
        font-size: 14px;
        color: #333;
    }
</style>
