<template>
    <div>
        <div class="dsj_header" style="position:fixed;top:0;width:100%;z-index:1000;">
            <ul>
                <li>
                    <a @click="doRequest('0')" v-bind:class="['0'==vFilter?'cur':'']">
                        待审核</a>
                </li>
                <li>
                    <a @click="doRequest('1')" v-bind:class="['1'==vFilter?'cur':'']">已审核</a>
                </li>
                <li>
                    <a @click="doRequest('2')" v-bind:class="['2'==vFilter?'cur':'']">待收货</a>
                    <span v-if="num">{{num}}</span>
                </li>
                <li>
                    <a @click="doRequest('3')" v-bind:class="['3'==vFilter?'cur':'']">已完成</a>
                </li>
            </ul>
        </div>
        <div class="goods" style="margin-top:55px;">
            <div class="hdg-order-no" v-if="hasNoOrder">
                <div class="orderBlank"></div>
                <p style="text-align: center;margin-bottom:20px;font-size: 14px;">暂无相关订单</p>
            </div>
            <!--<div class="dsj_item" v-for="order in orderList">
                <p class="dsj_p_head">订单编号：{{order.orderCode}}</p>
                <p class="dsj_p_head">提交时间：{{order.submitTime}}</p>
                <p class="dsj_p_head" v-if="order.checkTime">审核时间：{{order.submitTime}}</p>
                <p class="dsj_p_head" v-if="order.completeTime">完成时间：{{order.submitTime}}</p>
                <p class="dsj_p_li" v-for="(detail,index) in order.stuffs">
                    <span class="dsj_p_text">{{index+1}}.{{detail.stuffName}}</span><span class="dsj_p_num">{{detail.quantity}}</span></p>
                <span class="dsj_mes dsj_err">{{order.nowState}}</span>
            </div>-->
            <div class="good" v-for="order in orderList" v-if="!hasNoOrder">
                <div style="padding-bottom: 10px;">
                    <div class="good_bottom" v-for="(o,index) in order.stuffs">
                        <p><span>{{1+index}}. {{o.stuffName}} <span v-if="o.stuffFrom" style="color:#999">({{o.stuffFrom}})</span></span><span style="color:#666;">x {{o.quantity}}</span></p>
                    </div>
                </div>

                <div class="good_top">
                    <div class="good_L">
                        <p>订单编号：<span>{{order.orderCode}}</span></p>
                        <p>提交时间：<span>{{order.submitTime}}</span></p>
                        <p v-if="order.orderState == '1'">审核时间：<span>{{order.checkTime}}</span></p>
                        <p v-if="order.orderState == '2'">出库时间：<span>{{order.exportTime}}</span></p>
                        <p v-if="order.orderState == '3'">到货时间：<span>{{order.completeTime}}</span></p>
                        <p v-if="order.orderState == '1' && order.nowState == '审核失败'" style="color:#ef8201">失败原因：<span>{{order.checkLogDesc}}</span></p>
                        <p v-if="order.orderState == '2'">物流信息：<span style="color:#fca030">运输中</span></p>
                    </div>
                    <div class="good_r">
                        <span class="nowState red" v-if="order.orderState==0">{{order.orderStateDesc}}</span>
                        <span class="nowState" v-if="order.orderState==1" :class="[order.nowState == '审核成功'?'green':'red']">{{order.nowState}}</span>
                        <span class="nowState red" v-if="order.orderState==3">{{order.orderStateDesc}}</span>
                        <span class="confirm" v-if="order.orderState==2" @click="confirm(order.orderCode)" style="padding:0 10px;border:1px solid #fca030;border-radius: 15px;color:#fca030;">确认收货</span>
                    </div>
                </div>
            </div>
        </div>
        <transition name="fade">
            <div class="alert" v-show="showToast">
                <toast>
                    <p slot="toast">收货成功</p>
                </toast>
            </div>
        </transition>
    </div>
</template>

<script type="text/javascript">
    import toast from '@/components/toast'
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
        data() {
            return {
                orderList:[],
                vFilter:'0',
                showToast:false,
                hasNoOrder:false,
                src:'',
                num:'',
            }
        },
        components:{
           toast
        },
        created(){
            this.getNum();
            this.doRequest('0');
        },
        methods:{
            doRequest:function(p) {
                let $this = this;
                this.vFilter = p;
                console.log(this.vFilter);
                console.log(p);
                this.$emit('loadShow',true);
                this.$http.get('/storage/'+this.farmId+'/self/orders?otype='+p+'&token='+this.token).then(function(response){
                    $this.$emit('loadShow',false)
                    if(response.data.code == 200){
                        var list = response.data.result;
                        if(list.length == 0){
                            $this.hasNoOrder = true;
                            $this.orderList = [];
                        } else {
                            $this.hasNoOrder = false;
                            $this.orderList = list;
                        }
                    }else {
                        alert('未知错误，请重新登陆');
                    }

                }).catch(err=>{
                    this.$emit('loadErrShow',true)
                });
            },
            getNum () {
              this.$emit('loadShow',true);
              this.$http.get('/storage/'+this.farmId+'/self/orders?otype=2&token='+this.token).then((response) => {
                this.$emit('loadShow',false)
                if(response.data.code == 200){
                  var list = response.data.result;
                  if(list.length !== 0){
                    this.num = list.length;
                  }else {
                    this.num = '';
                  }
                }else {
                  alert('未知错误，请重新登陆');
                }

              }).catch(err=>{
                this.$emit('loadErrShow',true)
              });
            },
            confirm (oid) {
                this.$emit('loadShow',true);
                this.$http.get('/storage/farm/shippingcart/orderconfirm?orderCode='+oid+'&token='+this.token).then((response)=>{
                    this.$emit('loadShow',false);
                    this.doRequest('2');
                    this.getNum();
                    this.showToast = true;
                    window.setTimeout(()=>{
                        this.showToast = false;
                    },1000);
                }).catch((err)=>{
                    this.$emit('loadErrShow',true)
                });
            }
        }
    }
</script>

<!--<style  type="text/css" src="@/assets/css/index.css"></style>-->
<style scoped>
    .dsj_header ul li {
      position:relative;
    }
    .dsj_header ul li span {
      position:absolute;
      top:8px;
      right:-10px;
      background-color: #fa1f1f;
      width:12px;
      height:12px;
      font-size: 10px;
      border-radius: 12px;
      text-align: center;
      line-height: 12px;
      color:#fff;
    }
    .hdg-order-no {
        text-align: center;
        line-height: 50px;
        height: 50px;
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
        display:flex;
    }
    .good_L {
        flex:2;
    }
    .good_r {
        flex:1;
    }
    .good_L>p {
        font-size: 12px;
        color:#666;
        line-height: 18px;
    }

    .good_r {
        line-height: 26px;
        text-align: right;
        font-size: 12px;
        display:flex;
        justify-content: flex-end;
        align-items: flex-end;
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
    .green {
        color:#30b433;
    }
    .red {
        color:#fa1f1f;
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
