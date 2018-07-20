<template>
    <div>
        <div class="modal">
            <div class="input-box" v-if="showQuantity">
                <span class="close" @click="closeInputBox"></span>
                <div>
                    <div><input type="number" @blur="closeInputBox" v-model="quantity" v-focus style="font-size: 24px;" placeholder="0"></div>
                    <div style="font-size: 17px; line-height: 40px;">当前库存：{{pDetail.quantity}}</div>
                </div>
                <div style="position:relative;">
                    <div @click="finish(pDetail.id)" class="btn" style="position:absolute;right:20px;top:8px;width:75px;height:30px;line-height: 30px;color:#fff;background-color: #fca030">完成</div>
                </div>
            </div>
            <div class="input-box" v-if="showPrice">
                <span class="close" @click="closeInputBox"></span>
                <div>
                    <div><input type="number" @blur="closeInputBox" v-model="price" v-focus style="font-size: 24px;" placeholder="0"></div>
                    <div style="font-size: 17px; line-height: 40px;">当前价格：{{pDetail.price}}</div>
                </div>
                <div style="position:relative;">
                    <div @click="finish(pDetail.id)" class="btn" style="position:absolute;right:20px;bottom:10px;width:75px;height:30px;line-height: 30px;color:#fff;background-color: #fca030">完成</div>
                </div>
            </div>
            <div class="detail-box" v-if="!showPrice && !showQuantity">
                <div class="top">
                    <div class="pleft">
                        <h1>{{pDetail.name}}</h1>
                        <p v-if="pDetail.from">来源：{{pDetail.from}}</p>
                        <p>库存：{{pDetail.quantity}}</p>
                        <p v-if="pDetail.unit">单位：{{pDetail.unit}}</p>
                        <p v-if="pDetail.model">型号：{{pDetail.model}}</p>
                        <p v-if="pDetail.specification">规格：{{pDetail.specification}}</p>
                    </div>
                    <div class="pright" @click="writeQuantity(pDetail.nowState)">
                        <span :class="[pDetail.nowState==1?'':'write']"></span>
                    </div>
                </div>
                <div class="center">
                    <div class="pleft red">
                        <p style="color:#e4393c;">售价：￥{{pDetail.price}}</p>
                    </div>
                    <div class="pright" @click="writePrice(pDetail.nowState)">
                        <span :class="[pDetail.nowState==1?'':'write']"></span>
                    </div>
                </div>
                <div class="bottom">
                    <div class="btn" @click="downProduct(pDetail.id)" v-if="pDetail.nowState==1">下架此商品</div>
                    <div class="btn" @click="upProduct(pDetail.id)" v-if="pDetail.nowState==0">上架此商品</div>
                </div>
                <div class="close" @click="closeD">

                </div>
            </div>
        </div>
        <transition name="fade">
            <div class="alert" v-show="isAlert">
                <Alert @on-close="myCloseAlert">
                    <p slot="delete">请先下架商品，再进行编辑</p>
                </Alert>
            </div>
        </transition>
    </div>
</template>

<script type="es6">
    import Alert from '../../components/Alert'

    export default {
        data() {
            return {
                showQuantity:false,
                showPrice:false,
                isAlert:false,
                quantity:'',
                price:'',
            }
        },
        props:[
            'pDetail'
        ],
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
        created () {
            // console.log(this.pDetail);
        },
        methods: {
            closeD () {
                this.$emit('close');
            },
            closeInputBox () {
                this.showPrice = false;
                this.showQuantity = false;
            },
            writePrice (state) {
                if(!state){
                    this.showPrice = true;
                    this.quantity = '';
                    this.price = '';
                }else {
                    this.isAlert = true;
                }
            },
            myCloseAlert () {
                this.isAlert = false;
            },
            upProduct (id) {
                let data = {
                    proId:id,
                    otype:1
                };
                this.$emit('loadShow',true);
                this.$http.post('/storage/'+this.farmId+'/stuff/shelf?token='+this.token,data).then(msg=>{
                    this.$emit('loadShow',false);
                    this.$emit('finish');
                    this.closeD();
                }).catch(err=>{
                    this.$emit('loadErrShow',true);
                    this.$emit('loadShow',false);
                })
            },
            downProduct (id) {
                let data = {
                    proId:id,
                    otype:0
                };
                this.$emit('loadShow',true);
                this.$http.post('/storage/'+this.farmId+'/stuff/shelf?token='+this.token,data).then(msg=>{
                    this.$emit('loadShow',false);
                    this.$emit('finish');
                    this.closeD();
                }).catch(err=>{
                    this.$emit('loadErrShow',true);
                    this.$emit('loadShow',false);
                })
            },
            writeQuantity (state) {
                if(!state){
                    this.showQuantity = true;
                }else {
                    this.isAlert = true;
                }
            },
            finish (id) {
                this.showPrice = false;
                this.showQuantity = false;
                this.quantity = this.quantity?Number(this.quantity):-1;
                this.price = this.price?Number(this.price):-1;
                let data = {
                    proId:id,
                    proCount:this.quantity,
                    proPrice:this.price
                };
                console.log(data);
                this.$emit('loadShow',true);
                this.$http.post('/storage/'+this.farmId+'/stuff/replenish?token='+this.token,data).then(msg=>{
                    this.$emit('loadShow',false);
                    if(msg.data.code == 200){
                        if(this.quantity == -1){
                            this.pDetail.price = this.price;
                        }else {
                            this.pDetail.quantity = this.quantity;
                        }
                    }
                    this.$emit('finish');
                }).catch(err=>{
                    this.price = '';
                    this.quantity = '';
                    console.log('succ');
                    this.$emit('loadErrShow',true);
                })

            }
        }
    }
</script>

<style scoped>
    .input-box {
        position:fixed;
        bottom:0;
        left:0;
        width:100%;
        background-color: #fff;
        padding:15px 0;
        box-sizing: border-box;
        display:flex;
        flex-direction: row;
    }
    .input-box>div {
        padding:0 20px;
        width:50%;
    }
    div.bottom {
        display:flex;
        justify-content: center;
        align-items: center;
        margin:20px;
    }
    .close {
        width:24px;
        height:24px;
        position: absolute;
        top:-12px;
        right:10px;
        background: url("../../assets/img/delete.png") no-repeat center center;
        background-size: cover;
    }
    .btn {
        width:239px;
        height:35px;
        font-size: 15px;
        line-height: 35px;
        color:#fff;
        background-color: #fca030;
        border-radius: 5px;
        text-align: center;
    }
    div.modal {
        position:fixed;
        width:100%;
        height:100%;
        left:0;
        top:0;
        z-index: 100;
        background-color: rgba(0,0,0,.4);
    }
.detail-box {
    position: fixed;
    z-index: 100;
    width:100%;
    left:0;
    bottom:0;
    background-color: #fff;
}
    .top {
        border-bottom: 1px dotted #e8e8e8;
        line-height: 26px;
        display:flex;
        flex-direction: row;
        padding:10px 20px;
    }
    .center {
        line-height: 26px;
        display:flex;
        flex-direction: row;
        padding:10px 20px;
    }
    .pleft {
        flex: 5;
    }
    .pright {
        flex: 1;
        display:flex;
        justify-content: center;
        align-items: center;
    }
    .pright span {
        width:18px;
        height:18px;
        display:flex;
        background: url("../../assets/img/readonly.png") no-repeat center center;
        background-size: cover;
    }
    .pright span.write {
        background: url("../../assets/img/write.png") no-repeat center center;
        background-size: cover;
    }
    h1 {
        font-size: 15px;
        color:#333;
    }
    p {
        font-size: 14px;
        color:#666;
    }
    .red {
        color:#ee4433;
    }
</style>
