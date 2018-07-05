<template>
    <div>
        <ul class="addrList"  v-if="hasAddr">
            <li class="addrItem" v-for="addr in addrList" @click="goOrder(addr.id)">
                <div class="top">
                    <div class="flex h1">
                        <div class="flex1">{{addr.name}}</div>
                        <div class="flex1 right">{{addr.phoneNum}}</div>
                    </div>
                    <div>
                        <span>收货地址：{{addr.area}}{{addr.specificAddress }}</span>
                    </div>
                </div>
                <div class="bottom flex">
                    <div class="flex1" @click.stop="setDefault(addr)">
                        <div><span class="check" :class="[addr.defaultId?'checked':'']"></span>默认地址</div>
                    </div>
                    <div class="flex1 right">
                        <span style="margin-right: 20px;" @click.stop="write(addr)">编辑</span>
                        <span @click.stop="clear(addr)">删除</span>
                    </div>
                </div>
            </li>
        </ul>
        <div style="margin: 20px;text-align: center;" v-if="!hasAddr">
            <p>您还没有添加收货地址！</p>
        </div>
        <div class="btn-box">
            <div class="btn" @click="goDetail">
                添加新地址
            </div>
        </div>
        <transition name="fade">
            <div class="alert" v-show="isAlert">
                <Alert @on-close="myCloseAlert">
                    <p slot="delete">确定要删除此收货地址吗？</p>
                </Alert>
            </div>
        </transition>
    </div>
</template>

<script type="es6">
    import Alert from '@/components/Alert'
    export default {
        data() {
            return {
                isAlert:false,
                hasAddr:false,
                addrList:[],
                clearAddr:'',
                isOrder:false,
            }
        },
        components: {
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
            // console.log(this.$route.query.order);
            if(this.$route.query.order){
                this.isOrder = true;
            }
            this.getAddrList();
        },
        methods: {
            getAddrList () {
                this.$emit('loadShow',true);
                this.$http.get('/storage/farm/shippingcart/findaddress?token='+this.token).then(msg=>{
                    this.$emit('loadShow',false);
                    this.addrList = msg.data.result.addresslist;
                    if(this.addrList.length>0){
                        this.hasAddr = true;
                    }else {
                        this.hasAddr = false;
                    }
                }).catch(err=>{
                    this.$emit('loadErrShow',true)
                })
            },
            setDefault (addr) {
                this.$emit('loadShow',true);
                this.$http.get('/storage/farm/shippingcart/defaultaddress?addressId='+addr.id+'&token='+this.token).then(msg=>{
                    this.$emit('loadShow',false);
                    this.getAddrList();
                }).catch(err=>{
                    this.$emit('loadErrShow',true)
                })
            },
            goOrder (id) {
                console.log(id);
                this.$router.push({path:'/order',query:{addrId:id}});
            },
            goDetail () {
                this.$router.push('/addressDetail');
            },
            write (addr) {
                this.$router.push({path:'/addressDetail',query:{addrDetail:addr}});
            },
            clear (addr) {
                this.isAlert = true;
                this.clearAddr = addr;
            },
            myCloseAlert (bool) {
                if(bool){
                    this.$emit('loadShow',true);
                    this.$http.get('/storage/farm/shippingcart/deladdress?addressId='+this.clearAddr.id+'&defaultId='+this.clearAddr.defaultId+'&token='+this.token).then(msg=>{
                        this.$emit('loadShow',false);
                        this.getAddrList();
                    }).catch(err=>{
                        this.$emit('loadErrShow',true)
                    })
                }else {

                }
                this.isAlert = false;
            }
        }
    }
</script>

<style scoped>
    .addrList {
        color:#333;
    }
    .addrItem {
        border-bottom: 5px solid #f1f0f0;
    }
    .top {
        border-bottom: 1px solid #ccc;
        padding:10px;
    }
    .bottom {
        padding:10px;
    }
    .flex {
        display:flex;
    }
    .flex1 {
        flex:1;
    }
    .h1 {
        font-size: 14px;
        margin-bottom: 5px;
    }
    .h2 {
        font-size: 12px;
    }
    .h3 {
        font-size: 10px;
    }
    .right {
        text-align: right;
    }
    span.check {
        width:10px;
        height:10px;
        display:inline-block;
        border-radius: 50%;
        margin-right: 10px;
        /*transform:translateY(2px);*/
        background: url("../../assets/img/check.png");
        background-size: 100%;
    }
    span.checked {
        background: url("../../assets/img/checked.png");
        background-size: 100%;
    }
    .btn-box {
        position:fixed;
        left:0;
        bottom:0;
        width:100%;
        padding:30px 0;
        background-color: #fff;
        z-index: 100;
    }
    .btn {
        width:187px;
        height: 33px;
        margin:0 auto;
        line-height: 33px;
        background-color: #fca030;
        color:#fff;
        font-size: 14px;
        border-radius: 20px;
        text-align: center;
    }
</style>