<template>
    <div @click="colseType">
        <div class="putInPig">
            <div class="zwt_select">
                <b class="red" style="color:red">*</b>
                <div class="key">
                    <span>名&ensp;&ensp;&ensp;&ensp;称：</span>
                </div>
                <div class="val">
                    <input type="text" value="" v-model="name">
                </div>
            </div>
            <div class="zwt_select">
                <b class="red" style="color:red">*</b>
                <div class="key">
                    <span>类&ensp;&ensp;&ensp;&ensp;型：</span>
                </div>
                <div class="val">
                    <input type="text" @click.stop="showType" v-model="type" value="" readonly>
                </div>
            </div>
            <div class="zwt_select">
                <div class="key">
                    <span>来&ensp;&ensp;&ensp;&ensp;源：</span>
                </div>
                <div class="val">
                    <input type="text" value="" v-model="from">
                </div>
            </div>
            <div class="zwt_select">
                <div class="key">
                    <span>型&ensp;&ensp;&ensp;&ensp;号：</span>
                </div>
                <div class="val">
                    <input type="text" value="" v-model="model">
                </div>
            </div>
            <div class="zwt_select">
                <b class="red" style="color:red">*</b>
                <div class="key">
                    <span>单&ensp;&ensp;&ensp;&ensp;价：</span>
                </div>
                <div class="val">
                    <input type="number" value="" v-model="price">
                </div>
            </div>
            <div class="zwt_select" style="margin-bottom: 0;">
                <div class="key">
                    <span>规&ensp;&ensp;&ensp;&ensp;格：</span>
                </div>
                <div class="val" style="display: flex;flex-direction: row;">
                    <input type="text" style="flex:1;" value="" v-model="specification">
                    <div class="zwt_select" style="flex:2;">
                        <div class="key" style="flex:1;text-align: right">
                            <span>单位：</span>
                        </div>
                        <div class="val" style="flex:1;">
                            <input type="text" value="" v-model="unit">
                        </div>
                    </div>
                </div>
            </div>
            <div class="zwt_select">
                <b class="red" style="color:red">*</b>
                <div class="key">
                    <span>数&ensp;&ensp;&ensp;&ensp;量：</span>
                </div>
                <div class="val">
                    <input type="number" value="" placeholder="请输入数量" v-model="quantity">
                </div>
            </div>
            <p style="color:red;font-size: 10px">小提示：* 号位必填项</p>
            <button class="putIn_btn" @click.prevent="submit()">入库</button>
        </div>
        <transition name="slide">
            <div v-show="sType" class="type-box" style="position:fixed;z-index:99;bottom:0;left:0;height:220px;width:100%;">
                <ul style="background-color:#fff;width:100%;height:220px;overflow-y:scroll;padding:20px 30px;box-sizing: border-box;">
                    <li @click="choseType(b)" v-for="b in breed" style="display:flex;flex-direction: row;justify-content: space-between;align-items: center;
                    width:100%;height:25px;margin-bottom: 15px;padding-bottom:5px;font-size:16px;border-bottom:1px solid #c2c2c2;">
                        <span style="color:#333;">{{b.name}}</span>
                        <span style="width:15px;height:15px;border-radius: 50%;border:1px solid #afafaf;" :class="[b.isChose?'cur':'']"></span>
                    </li>
                </ul>
                <div @click="colseType" class="type-footer" style="position: absolute;font-size:15px;line-height:33px;background-color: #fca030;width:100%;height:33px;left:0;bottom:0;text-align: center;color:#fff;">
                    关闭
                </div>
            </div>
        </transition>
        <div class="overflowHiden"></div>
        <transition name="fade">
            <div class="alert" v-show="showToast">
                <toast>
                    <p slot="toast">入库成功</p>
                </toast>
            </div>
        </transition>
        <transition name="fade">
            <div class="alert" v-show="isAlert">
                <Alert @on-close="myCloseAlert">
                    <p slot="delete">* 号位必填项且价格和数量必须大于0</p>
                </Alert>
            </div>
        </transition>
    </div>
</template>

<script type="text/javascript">
    import toast from '@/components/toast'
    import Alert from '@/components/Alert'
    const breed = [
        {name:'仔猪',id:1,isChose:false},
        {name:'饲料',id:2,isChose:false},
        {name:'疫苗',id:3,isChose:false},
        {name:'器械设备',id:4,isChose:false},
        {name:'其他',id:5,isChose:false}
    ];
    export default {
        data(){
            return {
                breed:breed,
                name:'',
                type:'',
                isAlert:false,
                varietyId:'',//1代表仔猪
                from:'',      //来源
                price:'',     //价格
                specification:'',    //规格
                model:'',       //型号
                unit:'',   //单位
                quantity:'',       //数量
                showToast:false,
                sType:false,
            }
        },
        components:{
            toast,Alert
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
        methods: {
            showType () {
                this.sType = true;
            },
            colseType () {
                this.sType = false;
            },
            choseType (b) {
                for(let i=0;i<this.breed.length;i++){
                    if(this.breed[i].isChose){
                        this.breed[i].isChose = false;
                    }
                }
                this.varietyId = b.id;
                b.isChose = true;
                this.type = b.name;
                this.sType = false;
            },
            myCloseAlert () {
                this.isAlert = false;
            },
            submit () {
                if(this.name && this.price>0 && this.quantity>0 && this.varietyId){
                    let json = {
                        name:this.name,
                        varietyId:this.varietyId,
                        from:this.from,
                        price:this.price,
                        specification:this.specification,
                        model:this.model,
                        unit:this.unit,
                        quantity:parseInt(this.quantity)
                    };
                    console.log(json);
                    this.$emit('loadShow',true);
                    this.$http.post('/storage/'+this.farmId+'/stuff/add?token='+this.token,json).then((msg)=>{
                        this.$emit('loadShow',false);
                        if(msg.data.code == 200){
                            this.showToast = true;
                            setTimeout(()=>{
                                this.showToast = false;
                            },1000);
                            this.name = '';
                            // this.varietyId = '';
                            this.from = '';
                            this.price = '';
                            this.model = '';
                            this.unit = '';
                            this.quantity = '';
                            this.specification = '';
                        }
                    }).catch((err)=>{
                        this.$emit('loadErrShow',true);
                    })
                }else {
                   this.isAlert = true;
                }
            }

        }
    }
</script>

<style scoped>
    body,html{margin:0;padding:0;font-size:10px}body{font-family:Helvetica;overflow:scroll;overflow-x:auto}dd,div,dl,dt,h1,h2,h3,h4,h5,h6,img,input,li,ol,p,span,table,ul{margin:0;padding:0;border:0;list-style:none;list-style-type:none}button,input,select{outline:0;border:none}a{text-decoration:none}
    /*顶部列表*/
    .dsj_header {
        background-color: #f3f3f3;
        color: #222;
    }
    .slide-enter-active {
        transition: all 0.3s;
        z-index: 100;
    }
    .slide-leave-active {
        transition: all 0.3s;
        z-index: 100;
    }
    .slide-enter, .slide-leave-to {
        transform: translateY(220px);
        position:relative;
        z-index: 100;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
        opacity: 0
    }
    span.cur {
        background-color: #ef8201;
    }
    b.red {
        position:absolute;
        left:-10px;
        top:10px;
        z-index: 5;
        width:5px;
        height:5px;
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
        padding: 0 .5em;
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
        margin: 30px;
    }
    .zwt_select{
        margin-bottom: 20px;
        position:relative;
        display: flex;
        justify-content: space-between;
    }
    .key {
        flex:2;
    }
    .val {
        flex:5;
    }
    .key>span{
        font-size: 16px;
        color: #0e0d0d;
        line-height: 32px;
    }
    .val>input{
        border: 1px solid #ccc;
        border-radius: 5px;
        height: 32px;
        text-align: center;
        width:100%;
    }

    .zwt_select>select option{
        text-align: center;

    }
    select::-ms-expand { display: none; }

    .putIn_btn{
        display: block;
        background: #fca030;
        font-size: 16px;
        color: #fff;
        width:147px;
        height: 33px;
        margin: 0 auto;
        margin-top: 20px;
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
</style>
