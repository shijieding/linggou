<template>
    <div>
        <div class="modal">
            <div class="input-box" v-if="showPrice">
                <span class="close" @click="closeInputBox"></span>
                <div>
                    <div><input type="number" @blur="closeInputBox" v-model="num" v-focus style="font-size: 18px;" placeholder="输入您要领取的数量"></div>
                    <div style="font-size: 17px; line-height: 40px;">当前库存：{{pDetail.quantity}}</div>
                </div>
                <div style="position:relative;">
                    <div @click="finish" class="btn" style="position:absolute;right:20px;top:8px;width:75px;height:30px;line-height: 30px;color:#fff;background-color: #fca030">完成</div>
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
                    <div class="pright">
                        <div class="number-box">
                            <span class=" reduce" @click="reduce"></span><input type="number" @click="write" v-model="getNum"><span @click="add" class="add"></span>
                        </div>
                    </div>
                </div>
                <div class="center">
                    <div class="pleft red">
                        <p style="color:#e4393c;">售价：￥{{pDetail.price}}</p>
                    </div>
                </div>
                <div class="bottom">
                    <div class="btn" :class="[nowState?'':'false']" @click="addCart">加入购物车</div>
                </div>
                <div class="close" @click="closeD">

                </div>
            </div>
        </div>
    </div>
</template>

<script type="es6">
    export default {
        data() {
            return {
                showQuantity:false,
                showPrice:false,
                getNum:0,   //要提交的数量
                num:'',       //准备领取的数量
                allQuantity:0,
                nowState:1,  //是否为下架商品
            }
        },
        props:[
            'pDetail'
        ],
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
        watch:{
            getNum (newgetNum,oldgetNum) {
                if(newgetNum > this.allQuantity){
                    this.getNum = this.allQuantity;
                }
                if(newgetNum < 0){
                    this.getNum = 0;
                }
            }
        },
        created () {
            console.log(this.pDetail);
            this.nowState = this.pDetail.nowState;
            if(this.pDetail.quantity < 1){
                this.nowState = 0;
            }
            this.allQuantity = this.pDetail.quantity;
        },
        methods: {
            add () {
                if(this.getNum >= this.allQuantity){
                    this.getNum = this.allQuantity;
                }else {
                    this.getNum++;
                }
            },
            reduce () {
                if(this.getNum <= 0){
                    this.getNum = 0;
                }else {
                    this.getNum--;
                }
            },
            closeD () {
                this.$emit('close');
            },
            closeInputBox () {
                this.showPrice = false;
            },
            write () {
                this.showPrice = true;
                this.num = '';
            },
            finish () {
                this.showPrice = false;
                this.getNum = parseInt(this.num);
            },
            addCart () {
                if(this.nowState){
                    this.$emit('loadShow',true);
                    let me = this;
                    if(me.getNum > 0 ){
                        let ob = {
                            proId:me.pDetail.id,
                            price:me.pDetail.price,
                            procount:me.getNum
                        };
                        let json = JSON.stringify(ob);
                        this.$http.post('/storage/'+this.farmId+'/shippingcart/add?token='+this.token,json).then(msg=>{
                            if(msg.data.code == 200){
                                this.$emit('loadShow',false);
                                this.$emit('close');
                                this.$emit('addCart');
                            }
                        }).catch(err=>{
                            this.$emit('loadErrShow',true)
                        });
                    }else {
                        alert('请选择商品数量')
                    }

                }
            }
        }
    }
</script>

<style scoped>
    .number-box {
        width:84px;
        height:25px;
        line-height: 25px;
        border:1px solid #fca030;
        display:flex;
    }
    .number-box span {
        flex:2;
    }
    .number-box input {
        flex:3;
        width:100%;
        text-align: center;
        border-right: 1px solid #fca030;
        border-left: 1px solid #fca030;
    }
    span.add {
        background: url("../../assets/img/add.png") no-repeat center center;
    }
    span.reduce {
        background: url("../../assets/img/reduce.png") no-repeat center center;
    }
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
    .false {
        background-color: #cacaca;
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
        flex: 2;
    }
    .pright {
        flex: 1;
        display:flex;
        /*justify-content: flex-end;*/
        align-items: flex-end;
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