<template>
    <div>
        <div class="dsj_header">
            <ul>
                <li><a href="javascript:;" @click="getTstore(1)" class="router-link-active" :class="[!storeAlready?'cur':'']">未出库订单</a></li>
                <li><a href="javascript:;" @click="getTstore(2)" class="router-link-active"  :class="[storeAlready?'cur':'']">已出库订单</a></li>
            </ul>
            <div class="search">
                <router-link to="/orderSearch">
                    <img style="width:17px;height:17px;display:block;margin:2px auto 3px;" src="@/assets/img/newsearch.png" alt="">
                    <span style="font-size: 10px;margin-top: -3px;color:#333;">搜索</span>
                </router-link>
            </div>
        </div>
        <div v-if="nodata" style="padding-top: 80px;text-align: center;">
            <div class="orderBlank"></div>
            <p style="text-align: center;margin-bottom:20px;font-size: 14px;">暂无相关订单</p>
        </div>
        <div class="goods" v-if="!nodata">
            <div class="good" v-for="order in orderList">
                <div style="padding-bottom: 10px;">
                    <div class="good_bottom" v-for="(o,index) in order.stuffs">
                        <p><span>{{1+index}}. {{o.stuffName}}<span v-if="o.stuffFrom" style="color:#999;">({{o.stuffFrom}})</span></span><span style="color:#666;">x {{o.quantity}}</span></p>
                    </div>
                </div>

                <div class="good_top">
                    <div class="good_L">
                        <p class="dsj_p_head" v-if="order.belongUserName">申请人：{{order.belongUserName}}</p>
                        <p>订单编号：<span>{{order.orderCode}}</span></p>
                        <p v-if="order.orderState == '1'">提交时间：<span>{{order.submitTime}}</span></p>
                        <p v-if="order.orderState == '1'">审核时间：<span>{{order.checkTime}}</span></p>
                        <p v-if="order.orderState == '2'">出库时间：<span>{{order.exportTime}}</span></p>
                        <p v-if="order.orderState != '1'">物流状态：<span style="color:#fca030">{{order.orderStateDesc}}</span></p>
                    </div>
                    <p class="good_r" @click="outS(order.orderCode)" v-if="order.orderState == '1'">出库</p>
                </div>
            </div>
        </div>
        <transition name="fade">
            <div class="alert" v-show="isAlert">
                <Alert @on-close="myCloseAlert">
                    <p slot="delete">请核对订单详情，点击确认出库</p>
                </Alert>
            </div>
        </transition>
    </div>
</template>

<script type="text/javascript">
    import Alert from '../../components/Alert'
    import '@/../static/mescroll.min.css'
    import '@/../static/mescroll.m'
    import MeScroll from 'mescroll.js'
    export default {
        data() {
            return {
                storeAlready:false,
                isAlert:false,
                order:'',
                nodata:false,
                orderList:[]
            }
        },
        components:{
            Alert
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
        },
        mounted () {
            this.getTstore(1);
            /*this.mescroll = new MeScroll("mescroll", {
                up: {
                    auto:true,
                    isBoth:false,
                    callback: this.getTstore,
                }
            });*/
        },
        methods:{
            outS (order) {
                this.order = order;
                this.isAlert = true;
            },
            myCloseAlert (n) {
                this.isAlert = false;
                if(n){
                    let json = {
                        farmId:this.farmId,
                        orderId:this.order
                    };
                    this.$emit('loadShow',true);
                    this.$http.post('/storage/farm/order/export?token='+this.token,json).then((msg)=>{
                        this.$emit('loadShow',false);

                        this.getTstore(2);
                    }).catch((err)=>{
                        this.$emit('loadErrShow',true);
                    })
                }
            },
            getTstore (n) {
                if(n==1){
                    this.storeAlready = false;
                }else {
                    this.storeAlready = true;
                }
                this.$emit('loadShow',true);
                this.$http.get('/storage/'+this.farmId+'/order/warehouselist?otype='+n+'&token='+this.token).then((msg)=>{
                    this.$emit('loadShow',false);
                    this.orderList = msg.data.result.warehouseList;
                    if(this.orderList.length==0){
                        this.nodata = true;
                    }else {
                        this.nodata = false;
                    }
                }).catch((err)=>{
                    console.log(err);
                    this.$emit('loadErrShow',true);
                })
            }
        }
    }
</script>

<style scoped>
    body,html{margin:0;padding:0;font-size:10px}body{font-family:Helvetica;overflow:scroll;overflow-x:auto}dd,div,dl,dt,h1,h2,h3,h4,h5,h6,img,input,li,ol,p,span,table,ul{margin:0;padding:0;border:0;list-style:none;list-style-type:none}button,input,select{outline:0;border:none}a{text-decoration:none}

     div.search {
         position:absolute;
         top:15px;
         right:20px;
         width:29px;
         height:29px;
         text-align: center;
     }
    .dsj_header {
        color: #333;
        background-color: #fff;
        width:100%;
        height:66px;
        position:fixed;
        left:0;
        top:0;
    }
    .dsj_header>ul {
        display: flex;
        height: 39px;
        line-height: 39px;
        width:231px;
        justify-content:space-around;
        margin:13px auto;
        border:1px solid #fca030;
        border-radius: 5px;
    }
    .dsj_header>ul li {
        text-align: center;
        font-size: 15px;
        width:100%;
    }
    .dsj_header>ul a.cur{
        background-color: #fca030;
        border:none;
        color:#333;
    }

    .dsj_header>ul a {
        color: #333;
        height: 100%;
        display: block;
        box-sizing: border-box;
        text-decoration: none;
    }


    .goods{
        width: 100%;
        padding-bottom: 80px;
        margin-top: 66px;
        /*background: #F2F2F2;*/
    }
    .good{
        margin-top: 15px;
        padding-top:15px;
        background: #f7f7f7;
    }
    .good_top{
        width: 90%;
        overflow: hidden;
        margin: 0 auto;
        justify-content: space-around;
        border-top: 1px solid #cec1c1;
        padding-top:10px;
        padding-bottom: 10px;
    }
    .good_L {
        float:left;
    }
    .good_r {
        float:right;
    }
    .good_L>p {
        font-size: 12px;
        color:#666;
        line-height: 18px;
    }


    .good_r{
        background: #fca030;
        line-height: 26px;
        width:53px;
        height:26px;
        text-align: center;
        font-size: 12px;
        color: #464646;
        border-radius: 5px;
        margin-top: 26px;
    }
    .good_bottom{
        width: 90%;
        margin: 0 auto;
    }
    .good_bottom p{
        font-size: 14px;
        display: flex;
        justify-content:  space-between;
        line-height: 24px;
    }

    /*弹出框*/
    .putInName{
        display: none;
        width: 280px;
        height: 200px;
        position: fixed;
        top: 50%;
        left: 50%;
        margin-top:-100px;
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
    .putInName div.inputContent{
        width: 80%;
        margin: 15px auto;
        display: flex;
        justify-content: space-between;
    }
    .putInName div.inputContent>span{
        line-height: 35px;
    }
    .putInName input{
        width: 160px;
        height: 35px;
        border: 1px solid #ccc;
        border-radius: 3px;
        /*margin: 10px auto;*/
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
        background-color: #ccc;
    }
    .footer_flex{
        display: flex;
        justify-content: space-around;
    }
    .footer_flex a{
        width:calc(100%/3);
        border-right:1px solid #a3a1a1;
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
        font-size: 16px;
        color: #333;
    }
    .orderBlank {
        width:100px;
        height:100px;
        margin:100px auto;
        margin-bottom: 20px;
        background: url("../../assets/img/orderBlank.png");
        background-size: 100%;
    }
</style>
<!--http://wqs.znswsse.com/fg/storage/farmStorage/storage/5a30b4f8164288115ca4da31/export/orders-->
