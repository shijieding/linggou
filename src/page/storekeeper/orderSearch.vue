<template>
    <div>
        <div>
            <div class="hdg-search">
                <div class="hdg-search-outer">
                    <input class="input" type="search" style="color:#444;" @keyup.enter="getTstore" v-model="orderId" placeholder="输入订单编号"/>
                    <!--<span class="close" v-if="!showSearch" @click="clear"><img style="width:17px;height:17px;" src="@/assets/img/delete.png" alt=""></span>-->
                    <span class="search" @click="getTstore"><img style="width:17px;height:17px;" src="@/assets/img/newsearch.png" alt=""></span>
                </div>
                <span class="hdg-back" @click="cancelSearch">取消</span>
            </div>
            <div style="height: 60px;"></div>
            <div v-if="nodata">
                <p style="margin-left: 20px;font-size: 12px;">没有查询到该订单，请输入完整的订单号</p>
            </div>
            <div class="goods">
                <div class="good" v-for="order in orderList">
                    <div style="padding-bottom: 10px;">
                        <div class="good_bottom" v-for="(o,index) in order.stuffs">
                            <p><span>{{1+index}}. {{o.stuffName}}</span><span style="color:#666;">x {{o.quantity}}</span></p>
                        </div>
                    </div>

                    <div class="good_top">
                        <div class="good_L">
                            <p>订单编号：<span>{{order.orderCode}}</span></p>
                            <p v-if="order.orderState == '1'">提交时间：<span>{{order.submitTime}}</span></p>
                            <p v-if="order.orderState == '1'">审核时间：<span>{{order.checkTime}}</span></p>
                            <p v-if="order.orderState == '2'">出库时间：<span>{{order.exportTime}}</span></p>
                            <p v-if="order.orderState == '2'">物流状态：<span style="color:#fca030">{{order.orderStateDesc}}</span></p>
                        </div>
                        <p class="good_r" @click="outS(order.orderCode)" v-if="order.orderState == '1'">出库</p>
                    </div>
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
    import '@/assets/css/breeder.css';
    import Alert from '../../components/Alert'
    export default {
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
        components:{
            Alert
        },
        data() {
            return {
                orderId:'',
                orderList:[],
                nodata:false,
                isAlert:false,
                storeAlready:false,
            }
        },
        created(){
        },
        methods:{
            cancelSearch:function(){
                this.$router.go(-1);
            },
            clear () {
                this.orderId = '';
                this.showSearch = true;
                this.orderList = [];
            },
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
                        this.getTstore();
                    }).catch((err)=>{
                        this.$emit('loadErrShow',true);
                    })
                }
            },
            getTstore () {
                this.$emit('loadShow',true);
                this.$http.get('/storage/'+this.farmId+'/order/findOrderByid?orderCode='+this.orderId+'&token='+this.token).then((msg)=>{
                    this.$emit('loadShow',false);
                    this.orderList = msg.data.result.order;
                    if(this.orderList.length==0){
                        this.nodata = true;
                    }else {
                        this.nodata = false;
                    }
                }).catch((err)=>{
                    this.$emit('loadErrShow',true);
                })
            }
        }
    }
</script>

<style scoped>
    .hdg-search {
        width: 100%;
        position: fixed;
        background-color: #fff;
        left:0;
        top:0;
    }
    .hdg-search-outer {
        position:relative;
        border-radius: 5px;
        border:1px solid #bebebe;
        left: 2em;
        width:75%;
        display:flex;
        flex-direction: row;
        align-items: center;
        margin:10px 0;
    }
    .input {
        flex:5;
    }
    .search {
        flex:1;
        text-align: center;
    }
    .close {
        flex:1;
        text-align: center;
    }
    .hdg-search-tab .hdg-search-tab-nav ul {
        background: #bebebe;
        border-radius: 6px;
        width: 80px;
        overflow: hidden;
    }
    .hdg-search-tab .hdg-search-tab-nav ul:after {
        position: absolute;
        left: 20px;
        top: 5px;
        content: '';
        display: inline-block;
        width: 10px;
        height: 10px;
        background: #bebebe;
        -webkit-transform: rotate(45deg);
    }

    .hdg-search-tab .hdg-search-tab-nav li {
        border-top: 1px solid #707476;
        margin-top: -1px;
        height: 35px;
        line-height: 35px;
        text-align: center;
    }

    .hdg-search-tab-nav.off {
        display: none;
    }
    .hdg-search input {
        height:33px;
        width:55%;
        border-radius: 5px;
        line-height: 33px;
        font-size: 1.3em;
        padding-left: 0.5em;
    }
    .hdg-back {
        font-size: 1.4em;
        color: #fca030;
        position: absolute;
        right: 10px;
        top: 0;
        padding: 10px;
        line-height: 30px;
    }
    .goods{
        width: 100%;
        margin-bottom: 80px;
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
    @media only screen and (max-width:360px) {
        .good_L>p:first-child,.good_L>p:last-child{
            font-size: 14px;
        }
        .good_L>P:nth-child(2){
            font-size: 12px;
        }
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


</style>
