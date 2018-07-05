<template>
    <div>
        <div v-if="!noData" class="list">
            <div data-type="0" class="item" v-for="p in pList">
                <div class="updiv" @touchstart.capture="touchStart" @touchend.capture="touchEnd(p,$event)"  @click.self="skip">
                    <div class="top">
                        <div class="flex1" @click="choseP(p)">
                            <div class="check" :class="[p.check?'checked':'']"></div>
                        </div>
                        <div class="flex3">
                            <span class="h1">{{p.name}}</span>
                        </div>
                        <div class="flex2">
                            <span class="h2" v-show="!p.nowState" style="color:red;">商品已下架</span>
                        </div>
                        <div class="flex2" style="text-align: right;">
                            <span class="h2 red text-right">￥{{p.price}}</span>
                        </div>
                        <div class="flex1" @click.stop="showFinish(p,$event)">
                            <div class="write" v-show="!p.slide"></div>
                        </div>
                    </div>
                    <div class="bottom">
                        <div class="flex1">
                            <!--<div class="check"></div>-->
                        </div>
                        <div class="flex3">
                            <span class="h2">{{p.from?p.from:(p.unit?p.unit:p.specification)}}</span>
                        </div>
                        <div class="flex2">
                            <span class="h2">库存：{{p.quantity}}</span>
                        </div>
                        <div class="flex2" style="text-align: right;">
                            <span class="h2 text-right" v-show="!p.slide || showDelete">x {{p.mycount}}</span>
                            <div class="number-box" v-show="p.slide && !showDelete" style="float:right;text-align: center">
                                <span class=" reduce" @click="reduce(p)">－</span><input type="number" @input="changeCount(p)" v-model="itemCount"><span @click="add(p)" class="add">+</span>
                            </div>
                        </div>
                        <div class="flex1">
                            <!--<div class="write"></div>-->
                        </div>
                    </div>
                </div>
                <div class="downdiv delete" v-if="showDelete" @click="deleteP(p)">
                    <span class="text">删 除</span>
                </div>
                <div class="downdiv finish" v-if="!showDelete" @click="changeP(p)">
                    <span class="text">完 成</span>
                </div>
            </div>

        </div>
        <div class="nodata" v-if="noData">
            <div class="cartBlank"></div>
            <p style="text-align: center;margin-bottom:20px;font-size: 14px;">您的购物车为空</p>
            <p style="text-align: center;margin-bottom:20px;font-size: 15px;font-weight: 500;"><router-link to="/staffView/product">去购物</router-link></p>
        </div>
        <div class="cart-foot" v-if="!noData">
            <div class="flex1">
                <div class="check" :class="[checkAll?'checked':'']" @click="choseAll()" v-if="!noData"></div>
            </div>
            <div class="flex3">
                <span v-if="!noData">全选</span>
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
                showDelete:true,
                noData:true,
                pList:[],
                itemCount:0,  //要修改的商品数量
                checkAll:false,
                price:0,   //总价
                quantity:0,    //总数
            }
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
        created () {
            this.getList();
        },
        methods: {
            showFinish (p,e) {
                this.restSlide();
                this.showDelete = false;
                for(let i=0;i<this.pList.length;i++){
                    this.pList[i].slide = false;
                }
                p.slide = true;
                this.itemCount = p.mycount;
                let parentElement = e.currentTarget.parentElement.parentElement.parentElement;
                parentElement.dataset.type == 0 ? parentElement.dataset.type=1 : parentElement.dataset.type=0;
            },
            getList () {
                this.$emit('loadShow',true);
                this.checkAll = false;
                this.$http.get('/storage/'+this.farmId+'/shippingcart/find?token='+this.token).then(msg=>{
                    this.$emit('loadShow',false);
                    this.pList = msg.data.result.shippingcart;
                    console.log(typeof(this.pList));

                    if(this.pList.length == 0){
                        this.noData = true;
                    }else {
                        this.noData = false;
                        for(let i=0;i<this.pList.length;i++){
                            this.$set(this.pList[i],'slide',false);
                            this.$set(this.pList[i],'check',false);
                        }
                    }
                }).catch((err)=>{
                    this.$emit('loadErrShow',true);
                });
            },
            reduce (p) {
                this.itemCount--;
                this.changeCount(p);
            },
            add (p) {
                this.itemCount++;
                this.changeCount(p);
            },
            deleteP (p) {
                this.restSlide();
                this.$emit('loadShow',true);
                this.$http.get('/storage/'+this.farmId+'/shippingcart/del?proId='+p.id+'&token='+this.token).then(msg=>{
                    this.$emit('loadShow',false);
                    this.getList();
                }).catch(err=>{
                    this.$emit('loadErrShow',true);
                })
            },
            changeP (p) {
                this.restSlide();
                // p.slide = false;
                this.itemCount = parseInt(this.itemCount);
                if(this.itemCount>0){
                    this.$emit('loadShow',true);
                    this.$http.get('/storage/'+this.farmId+'/shippingcart/changecount?proId='+p.id+'&procount='+this.itemCount+'&token='+this.token).then(msg=>{
                        this.$emit('loadShow',false);
                        this.getList();
                    }).catch(err=>{
                        this.$emit('loadErrShow',true);
                    })
                }else {
                    alert('产品数量不能小于1');
                    p.slide = false;
                }

            },
            changeCount (p) {
                if(this.itemCount<0){
                    this.itemCount = 0;
                }else if(this.itemCount >= p.quantity){
                    this.itemCount = p.quantity;
                }
            },
            choseP (p) {
                if(p.check){
                    p.check = false;
                    this.checkAll = false;
                }else {
                    p.check = true;
                    let all = true;
                    for(let i=0;i<this.pList.length;i++){
                        if(this.pList[i].check == false){
                            all = false;
                        }
                    }
                    all ? this.checkAll = true : this.checkAll = false;
                }
            },
            choseAll () {
                if(this.checkAll){
                    this.checkAll = false;
                    for(let i=0;i<this.pList.length;i++){
                        this.pList[i].check = false;
                    }
                }else {
                    this.checkAll = true;
                    for(let i=0;i<this.pList.length;i++){
                        this.pList[i].check = true;
                    }
                }
            },
            submit () {
                if(this.quantityAll>0){
                    let stuff = [];
                    for(let i=0;i<this.pList.length;i++){
                        if(this.pList[i].check){
                            if(this.pList[i].nowState){
                                stuff.push(this.pList[i]);
                            }else {
                                alert('您选择的商品包含已下架商品，请重新选择');
                                return;
                            }
                        }
                    }
                    window.localStorage.setItem('pList',JSON.stringify(stuff));
                    this.$router.push({path:'/order',query:{stuff:stuff}});
                }else {
                    alert('请选择要购买的商品');
                }
            },
            //跳转
            skip(){
                if( this.checkSlide() ){
                    this.restSlide();
                }else{
                    // alert('You click the slide!')
                }
            },
            //滑动开始
            touchStart(e){
                // 记录初始位置
                this.startX = e.touches[0].clientX;
            },
            //滑动结束
            touchEnd(p,e){
                // 当前滑动的父级元素
                let parentElement = e.currentTarget.parentElement;
                // 记录结束位置
                this.endX = e.changedTouches[0].clientX;
                // 左滑
                if( parentElement.dataset.type == 0 && this.startX - this.endX > 30 ){
                    this.restSlide();
                    this.showDelete = true;
                    for(let i=0;i<this.pList.length;i++){
                        this.pList[i].slide = false;
                    }
                    p.slide = true;
                    parentElement.dataset.type = 1;
                }
                // 右滑
                if( parentElement.dataset.type == 1 && this.startX - this.endX < -30 ){
                    this.restSlide();
                    p.slide = false;
                    parentElement.dataset.type = 0;
                }
                this.startX = 0;
                this.endX = 0;
            },
            //判断当前是否有滑块处于滑动状态
            checkSlide(){
                let listItems = document.querySelectorAll('.item');
                for( let i = 0 ; i < listItems.length ; i++){
                    if( listItems[i].dataset.type == 1 ) {
                        return true;
                    }
                }
                return false;
            },
            //复位滑动状态
            restSlide(){
                for(let i=0;i<this.pList;i++){
                    this.pList[i].slide = false;
                }
                let listItems = document.querySelectorAll('.item');
                // 复位
                for( let i = 0 ; i < listItems.length ; i++){
                    listItems[i].dataset.type = 0;
                }
            },
        }
    }
</script>

<style scoped>
    .number-box {
        width:80px;
        height:24px;
        line-height: 24px;
        border:1px solid #999;
        display:flex;
    }
    .number-box span {
        flex:2;
    }
    .number-box input {
        flex:3;
        width:100%;
        text-align: center;
        border-right: 1px solid #999;
        border-left: 1px solid #999;
    }
    span.add,span.reduce {
        text-align: center;
        line-height: 24px;
        font-size: 18px;
        color:#999;
    }
/*    span.add {
        background: url("../../assets/img/add.png") no-repeat center center;
    }
    span.reduce {
        background: url("../../assets/img/reduce.png") no-repeat center center;
    }*/
    .item[data-type="0"] .updiv{
        transform: translate3d(0,0,0);
    }
    .item[data-type="1"] .updiv{
        transform: translate3d(-54px,0,0);
    }
    .updiv {
        -webkit-transition:0.3s ease;
        -moz-transition: 0.3s ease;
        -ms-transition: 0.3s ease;
        -o-transition: 0.3s ease;
        transition: 0.3s ease;
        background-color: #fff;
        padding-top: 10px;
        position:relative;
        z-index: 2;
    }
    .downdiv {
        color:#fff;
        position:absolute;
        z-index: 1;
        right:0;
        top:0;
        width:54px;
        height:100%;
        font-size: 13px;
        text-align: center;
        line-height: 70px;
    }
    .delete {
        background-color: #fa1f1f;
    }
    .finish {
        background-color: #fca030;
    }
    .cart-foot {
        position:fixed;
        left:0;
        bottom:50px;
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
    }
    .top,.bottom {
        display:flex;
        height:30px;
        line-height: 30px;
    }
    .flex1 {
        flex:1;
        display:flex;
        justify-content: center;
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
    .flex4 {
        flex:4;
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
    .check {
        width:14px;
        height:14px;
        background-image: url("../../assets/img/check.png");
        background-size: 100%;
    }
    .checked {
        background-image: url("../../assets/img/checked.png");
    }
    .write {
        width:12px;
        height:12px;
        background: url("../../assets/img/write.png");
        background-size: 100%;
    }
    .cartBlank {
        width:100px;
        height:100px;
        margin:100px auto;
        margin-bottom: 20px;
        background: url("../../assets/img/cartBlank.png");
        background-size: 100%;
    }
</style>























