<template>
    <div>
        <div class="addr-box">
            <div style="width:100%;display: flex;">
                <div class="addr-content" v-if="hasAddr" @click="goAddrList">
                    <div class="addr-top">
                        <div class="flex1">收货人：{{addr.name}}</div>
                        <div class="flex1">{{addr.phoneNum}}</div>
                    </div>
                    <div class="addr-bottom">
                        <div>收货地址：{{addr.area}}{{addr.specificAddress }}</div>
                    </div>
                </div>
                <div class="addr-content" v-if="!hasAddr">
                    <router-link to="/addressDetail">您还没有添加收货地址！</router-link>
                </div>
                <div class="more">
                    <span></span>
                </div>
            </div>
            <div class="line"></div>
        </div>
        <div class="list">
            <div class="item" v-for="p in pList">
                <div class="top">
                    <div class="flex3">
                        <span class="h1">{{p.name}}</span>
                    </div>
                    <div class="flex2">
                        <span class="h2" v-show="p.model">{{p.model}}</span>
                    </div>
                    <div class="flex2 text-right">
                        <span class="h2 red text-right">￥{{p.price}}</span>
                    </div>
                </div>
                <div class="bottom">
                    <div class="flex3">
                        <span class="h2">{{p.from?p.from:(p.unit?p.unit:p.specification)}}</span>
                    </div>
                    <div class="flex2">
                        <span class="h2">库存：{{p.quantity}}</span>
                    </div>
                    <div class="flex2" style="text-align: right;">
                        <span class="h2 text-right">x {{p.mycount}}</span>
                    </div>
                </div>
            </div>

        </div>
        <div class="cart-foot">
            <div class="flex1">

            </div>
            <div class="flex3">

            </div>
            <div class="flex3">
                <span>总计：<span class="red">￥{{priceAll}}</span></span>
            </div>
            <div class="flex2">
                <div class="sub" @click="submit">提交({{quantityAll}})</div>
            </div>
        </div>
    </div>
</template>

<script type="es6">
    export default {
        data() {
            return {
                pList:[],
                stuffs:[],
                hasAddr:false,
                addrList:[],
                addr:{
                    name:'',
                    phoneNum:'',
                    area:'',
                    specificAddress:''
                },
                addrId:'',
                price:0,   //总价
                quantity:0,    //总数
            }
        },
        mounted () {
             this.pList = JSON.parse(window.localStorage.getItem('pList'));
             for(let i=0;i<this.pList.length;i++){
                 this.stuffs.push({
                     sid:this.pList[i].id,
                     price:this.pList[i].price,
                     count:this.pList[i].mycount
                 })
             }
             this.addrId = this.$route.query.addrId;
             console.log(this.addrId);
             this.getAddrList();
        },
        components: {

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
            priceAll () {
                this.price = Number(0);
                for(let i=0;i<this.pList.length;i++){
                    if(this.pList[i].check){
                        this.price += Number(this.pList[i].price) * Number(this.pList[i].mycount);
                    }
                }
                return this.price.toFixed(2);
            },
            quantityAll () {
                this.quantity = Number(0);
                for(let i=0;i<this.pList.length;i++){
                    if(this.pList[i].check){
                        this.quantity += this.pList[i].mycount;
                    }
                }
                return this.quantity;
            }
        },
        methods: {
            submit () {
                this.$emit('loadShow',true);
                let j = {
                    farm:this.farmId,
                    stuffs:this.stuffs,
                    shippingAddressId:this.addrId
                }
                let json = JSON.stringify(j);
                this.$http.post('/storage/farm/order/add?token='+this.token,json).then(msg=>{
                    this.$emit('loadShow',false);
                    if(msg.data.code == 200){
                        this.$router.push('/finish');
                    }
                }).catch(err=>{
                    this.$emit('loadErrShow',true);
                })
            },
            getAddrList () {
                this.$emit('loadShow',true);
                this.$http.get('/storage/farm/shippingcart/findaddress?token='+this.token).then(msg=>{
                    this.$emit('loadShow',false);
                    this.addrList = msg.data.result.addresslist;
                    if(this.addrList.length>0){
                        this.hasAddr = true;
                        if(this.addrId){
                            for(let i=0;i<this.addrList.length;i++){
                                if(this.addrList[i].id == this.addrId){
                                    this.addr = this.addrList[i];
                                }
                            }
                        }else {
                            for(let i=0;i<this.addrList.length;i++){
                                if(this.addrList[i].defaultId == 1){
                                    this.addr = this.addrList[i];
                                    this.addrId = this.addr.id;
                                }
                            }
                        }


                    }else {
                        this.hasAddr = false;
                    }
                }).catch(err=>{
                    this.$emit('loadErrShow',true)
                })
            },
            goAddrList () {
                this.$router.push({path:'/addressList',query:{order:true}})
            },
        }
    }
</script>

<style scoped>
    .addr-content {
        width:80%;
        padding:20px;
    }
    .addr-top {
        display:flex;
        margin-bottom: 10px;
    }
    .addr-bottom {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .more {
        width:20%;
        display:flex;
        justify-content: center;
        align-items: center;
    }
    .more span {
        display:block;
        width:7px;
        height:12px;
        background: url("../../assets/img/more.png");
        background-size: 100%;
    }
    .line {
        padding-top: 9px;
        background: url("../../assets/img/line.png");
        background-size: 100%;
    }
    .cart-foot {
        position:fixed;
        left:0;
        bottom:0;
        height:40px;
        line-height: 40px;
        width:100%;
        display:flex;
        background-color: #fff;
    }
    .sub {
        width:100%;
        height:100%;
        color:#fff;
        text-align: center;
        font-size: 15px;
        background:#fc761f; /* 一些不支持背景渐变的浏览器 */
        background:-moz-linear-gradient(top, #fc761f, #f5560f);
        background:-webkit-gradient(linear, 0 0, 0 bottom, from(#fc761f), to(#f5560f));
        background:-o-linear-gradient(top, #fc761f, #f5560f);
    }
    .list {
        background-color: #e5e3e3;
        margin-bottom: 99px;
        padding-bottom: 1px;
    }
    .item {
        background-color: #fff;
        margin-bottom: 10px;
        position:relative;
        padding:0 20px;
        padding-top: 10px;
    }
    .top,.bottom {
        display:flex;
        height:30px;
        line-height: 30px;
    }
    .flex1 {
        flex:1;
        display:flex;
        align-items: center;
    }
    .flex2 {
        flex:2;
        align-items: center;
    }
    .text-right {
        text-align: right;
    }
    .flex3 {
        flex:3;
        align-items: center;
    }
    .h1 {
        color:#222;
        font-size: 15px;
    }
    .h2 {
        color:#565656;
        font-size: 12px;
    }
    .red {
        color:#fa1f1f;
    }
</style>























