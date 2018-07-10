<template>
<div>
    <Load v-show="loading"></Load>
    <LoadErr v-show="loaderr" v-on:loadErrShow="loadErrShow"></LoadErr>
	<div class="dsj_head" style="position: fixed;width:100%;height:60px;background-color: #fff;">
        <div class="dsj_head_container">
        	<a :class="['pending'==vCheck?'cur':'']" @click="doRequest('0')">待审核</a>
        	<a :class="['checked'== vCheck?'cur':'']" @click="doRequest('1')">已审核</a>
        </div>
    </div>
    <div class="dsj_list" style="padding-top: 60px;">
        <div class="hdg-order-no" v-if="hasNoOrder">
            <div class="orderBlank"></div>
            <p style="text-align: center;margin-bottom:20px;font-size: 14px;">暂无相关订单</p>
        </div>
        <div class="hdg-order-no" v-if="hasErrorOrder">服务器出错了</div>
        <div class="dsj_item"  v-for="order in orderList">
            <div style="border-bottom: 1px solid #cacaca;padding-bottom: 5px;margin-bottom: 5px;">
                <p class="dsj_p_li" v-for="(detail,index) in order.stuffs">
                    <span class="dsj_p_text" style="font-size: 14px;color:#333;">{{index+1}}.{{detail.stuffName}}</span><span class="dsj_p_num">x {{detail.quantity}}</span></p>
            </div>
            <div style="display:flex;flex-direction: row">
                <div class="" style="flex:7;">
                    <p class="dsj_p_head" v-if="order.belongUserName">申请人：{{order.belongUserName}}</p>
                    <p class="dsj_p_head">订单编号：{{order.orderCode}}</p>
                    <p class="dsj_p_head">提交时间：{{order.submitTime}}</p>
                    <p class="dsj_p_head" v-if="order.nowState=='审核失败'" style="color:#fca030;">失败原因：{{order.checkLogDesc}}</p>
                </div>
                <div class="dsj_btn_box" style="position: inherit;flex: 3;display:flex;align-items: flex-end;justify-content: flex-end;" v-if="vCheck=='checked'">
                    <button class="dsj_succ" style="background-color: transparent;"
                            v-if="order.nowState=='审核成功'">审核成功</button>
                    <button class="dsj_succ red" style="background-color: transparent;" v-else>审核失败</button>
                </div>
            </div>

            <div class="dsj_btn_box" style="position: inherit;" v-if="vCheck=='pending'">
                <button class="dsj_btn dsj_err" @click="refuse(order.orderCode)">拒绝</button>
                <button class="dsj_btn dsj_succ" @click="pass(order.orderCode)">通过</button>
            </div>

        </div>
    </div>

    <div class="dsj_mask" v-if="motaiBox">
        <div class="dsj_alert">
            <div class="dsj_alert_title">
                <p>请填写拒绝原因</p>
                <div class="reason-box">
                    原因：<input type="text" readonly v-model="reaText" @click="showReason" class="reason">
                    <div class="rlist" v-if="sReason">
                        <div class="ritem" v-for="(r,index) in reason" @click="choseReason(r.id)">
                            <div class="riteml">
                                {{index+1}}、{{r.text}}
                            </div>
                            <div class="ritemr">
                                <span :class="[r.check?'cur':'']"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="dsj_alert_btn" style="display:flex;">
                <a @click="confirmSelf" class="close" style="flex:1;border-right: 1px solid #bebebe;">确定</a>
                <a @click="closeSelf" class="close" style="flex:1">取消</a>
            </div>
        </div>
    </div>
    <transition name="fade">
        <div class="alert" v-show="isAlert">
            <Alert @on-close="myCloseAlert">
                <p slot="delete">请核对订单详情，点击确认通过审核</p>
            </Alert>
        </div>
    </transition>
</div>

</template>

<script type="text/javascript">
    import Load from '@/components/loading'
    import LoadErr from '@/components/loadErr'
    import Alert from '../../components/Alert'
    let d = document.referrer;
    const reason = [
        {id:1,text:'库存不足',check:false},
        {id:2,text:'商品异常',check:false},
        {id:3,text:'其他',check:false}
    ];
	export default {
	    computed:{
            token () {
                return this.$store.state.token;
            },
            farmId () {
                return this.$store.state.farmId;
            }
	    },
		data() {
			return {
			    t:'',
                f:'',
                motaiBox:false,
                isAlert:false,
                orderList:[],
                reaText:'',
                reason:reason,
                vCheck:'pending',
                sReason:false,
                selectedOrder:'',
                hasNoOrder:false,
                hasErrorOrder:false,
                loading:false,
                loaderr:false
            }
		},
        created(){
            if(this.$route.query.q_token && this.$route.query.q_farm) {
                this.t = this.$route.query.q_token;
                this.f = this.$route.query.q_farm;
                window.localStorage.setItem('dsjtoken',this.t);
                window.localStorage.setItem('dsjfarmId',this.f);
            }

            this.getToken();
            this.getFarmId();
            this.doRequest('0');
        },
/*        beforeRouteUpdate(to,from,next) {
          let t = to.query.ck;
          this.hasErrorOrder = false;
          this.hasNoOrder = false;
          this.doRequest(t);
          next();
        },*/
        components:{
            Load,LoadErr,Alert
        },
        methods:{
            getToken () {
                this.$store.commit('getToken',this.t);
            },
            getFarmId () {
                this.$store.commit('getFarmId',this.f);
            },
            doRequest:function(p) {
                this.loadShow(true);
                p == '0' ? this.vCheck = 'pending' : this.vCheck = 'checked';
                    this.orderList=[];
                this.loading = true;
                this.$http.get('/storage/'+this.farmId+'/order/auditlist?otype='+p+'&token='+this.token).then(response=>{
                    this.loadShow(false);
                    if(response.data.code === 200) {
                        var list = response.data.result;
                        if(list.length > 0){
                            this.orderList = list;
                            this.hasNoOrder = false;
                        }else {
                            this.hasNoOrder = true;
                        }
                    } else {
                            this.hasErrorOrder = true;
                            // alert(response.data.result.message)
                    }

                }).catch(function(error) {
                    this.hasErrorOrder = true;
                    this.loadErrShow(true);
                });
            },
            showReason () {
                this.sReason = true;
            },
            choseReason (id) {
                for(let i=0;i<this.reason.length;i++){
                    this.reason[i].check = false;
                    if(this.reason[i].id == id){
                        this.reason[i].check = true;
                        this.reaText = this.reason[i].text;
                    }
                }
                this.sReason = false;
            },
            myCloseAlert (n) {
                this.isAlert = false;
                if(n){
                    let data = {
                        farmId:this.farmId,
                        orderId:this.selectedOrder,
                        checkCode:1,
                        checkDesc:''
                    };
                    let json = JSON.stringify(data);
                    this.loadShow(true);
                    this.$http.post('/storage/farm/order/audit?token='+this.token,json).then((response)=> {
                        if(response.data.code == 200){
                            this.loadShow(false);
                            this.doRequest('1');
                        }
                    }).catch(msg=>{
                        this.loadErrShow(true);
                    });
                }
            },
            pass (p) {         //点击通过
                this.selectedOrder = p;
                this.isAlert = true;
            },
            refuse(p){          //点击拒绝
                this.selectedOrder = p;
                this.motaiBox = true;
            },
            confirmSelf:function(){
                this.motaiBox = false;
                let data = {
                    farmId:this.farmId,
                    orderId:this.selectedOrder,
                    checkCode:2,
                    checkDesc:this.reaText
                };
                let json = JSON.stringify(data);
                this.loadShow(true);
                this.$http.post('/storage/farm/order/audit?token='+this.token,json).then((response)=> {
                    if(response.data.code == 200){
                        this.loadShow(false);
                        this.doRequest('1');
                    }else {
                        alert('未知错误，请重新登陆')
                    }

                }).catch(msg=>{
                    this.loadErrShow(true);
                });
            },
            closeSelf:function() {
                this.motaiBox = false;
            },
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
<style type="text/css" src="../../assets/css/index-m.css"></style>
<style type="text/css" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
/**/
.reason-box {
    position:relative;
}
.rlist {
    position:absolute;
    right:0;
    bottom:-73px;
    width:129px;
    height: 72px;
    border:1px solid #999;
    font-size: 12px;
    background-color: #fff;
    overflow-y: scroll;
}
.ritem {
    display:flex;
    flex-direction: row;
}
.riteml {
    flex:5;
    text-align: left;
    padding-left: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.ritemr {
    flex:1;
    display:flex;
    align-items: center;
    justify-content: center;
}
.ritemr span {
    display:block;
    width:10px;
    height:10px;
    border:1px solid #999;
    border-radius: 50%;
}
.ritemr span.cur {
    background-color: #fca030;
}
.reason {
    border:1px solid #999;width:110px;height:20px;line-height: 20px;
    background: url('../../assets/img/more.png') no-repeat 99px center;
    background-size: 6px 10px;
    padding-left: 5px;
    font-size: 12px;
}
.dsj_mask {
    position:fixed;
    z-index: 998;
    left:0;
    top:0;
    right:0;
    bottom:0;
    height:100%;
    background:rgba(0,0,0,0.2);
    display:block;
}
.dsj_alert {
    width:65%;
    margin:180px auto;
    font-size: 1.6em;
    text-align: center;
    color:#454545;
    background-color: #fff;
    opacity: 1;
    border-radius: 15px;
}
.dsj_alert_title {
    padding:1.5em;
    line-height: 1.5em;
}
.dsj_alert_btn {
    height:3em;
    line-height: 3em;
    color:#454545;
    border-top:1px solid #bebebe;
}
.dsj_alert_btn a {
    color:#454545;
    display:block;
    width:40%;
}
.hdg-order-no {
    text-align: center;
    line-height: 50px;
    height: 50px;
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
