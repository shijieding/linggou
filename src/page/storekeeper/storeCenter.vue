<template>
    <div>
        <div class="dsj_header">
            <div class="search-box">
                <input class="input" @click="goSearch" type="text" style="color:#444;" readonly placeholder="请输入商品名称"/>
                <span class="search"><img style="width:17px;height:17px;" src="@/assets/img/newsearch.png" alt=""></span>
            </div>
            <ul>
                <li v-for="b in breeds">
                    <a :class="[b.vid==cur?'cur':'']" @click="toggleTab(b.vid)">
                        {{b.vname}}
                    </a>
                </li>
            </ul>
        </div>
        <div style=" height: 102px;"></div>
        <div class="nodata" v-if="noData">
            <div class="productBlank"></div>
            <p style="text-align: center;margin-bottom:20px;font-size: 14px;">没有找到任何商品</p>
        </div>
        <div class="mescroll" id="mescroll" v-if="!noData">
            <ul class="goods">
                <li class="good" v-for="b in breedList" @click="detail(b)">
                    <div class="content">
                        <p class="name">{{b.name}} <span v-if="b.from || b.unit || b.model">({{b.from?b.from:(b.unit?b.unit:b.model)}})</span></p>
                        <p><span>库存：{{b.quantity}}</span></p>
                        <p><span class="red">￥{{Number(b.price).toFixed(2)}}</span></p>
                    </div>
                    <div class="sold-out">
                        <p v-if="!b.nowState">此商品已下架</p>
                    </div>
                    <div class="img">
                        <img style="width:6px;height:10px;" src="@/assets/img/more.png" alt="">
                    </div>
                </li>
            </ul>
        </div>
        <div style="height:50px;"></div>
        <productDetail v-if="showDetail" @finish="myRefresh" @close="close" :pDetail="pDetail"></productDetail>
    </div>
</template>

<script type="text/javascript">
    import productDetail from '@/page/storekeeper/productDetail'
    import '@/../static/mescroll.min.css'
    import '@/../static/mescroll.m'
    import MeScroll from 'mescroll.js'
    const breeds = [
        {
            vid:1,
            vroute:'sPig',
            vname:'仔 猪'
        },{
            vid:2,
            vroute:'sFodder',
            vname:'饲 料'
        },{
            vid:3,
            vroute:'sVaccine',
            vname:'兽药疫苗'
        },{
            vid:4,
            vroute:'sInstrument',
            vname:'器械设备'
        },{
            vid:5,
            vroute:'sOther',
            vname:'其 他'
        }
    ];
    export default {
        data() {
            return {
                breeds:breeds,
                cur:1,
                mescroll:null,
                index:-10,
                showDetail:false,
                breedList:[],
                pDetail:null,
                noData:false,
            }
        },
        components:{
            productDetail
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
            console.log('pid'+this.pid);
            this.mescroll = new MeScroll("mescroll", {
                up: {
                    htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">加载中..</p>',
                    htmlNodata: '<p class="upwarp-nodata">-- 没有数据啦 --</p>',
                    callback: this.getList
                },
                down:{
                    callback: this.myRefresh,
                    auto:false
                }
            });
        },
        methods:{
            toggleTab (id) {
                this.cur = id;
                this.$emit('loadShow',true);
                this.myRefresh();
            },
            goSearch () {
                this.$router.push({path:'/storeSearch'});
            },
            detail (b) {
                this.showDetail = true;
                this.pDetail = b;
            },
            close () {
                this.showDetail = false;
            },
            myRefresh () {
                let $this = this;
                setTimeout(()=>{
                    this.$http.get('/storage/'+this.farmId+'/variety/'+this.cur+'/0?stuffName=&token='+this.token).then(function(response){
                        if(response.data.code == 200){
                            $this.$emit('loadShow',false);
                            $this.breedList = [];
                            var list = response.data.result;
                            for(var i=0;i<list.length;i++){
                                $this.breedList.push(list[i]);
                            }
                            $this.mescroll.endSuccess(list.length);
                            if(list.length>0){
                                $this.noData = false;
                            }else {
                                $this.noData = true;
                            }
                        }else {
                            alert('未知错误，请重新登陆');
                        }

                    }).catch((err)=>{
                        $this.mescroll.endErr();
                        // $this.$emit('loadErrShow',true);
                    });
                },1000);
                this.index = 0;
            },
            getList () {
                let $this = this;
                this.index+=10;
                // this.$emit('loadShow',true);
                setTimeout(()=>{
                    this.$http.get('/storage/'+this.farmId+'/variety/'+this.cur+'/'+this.index+'?stuffName=&token='+this.token).then(function(response){
                        if(response.data.code == 200){
                            // $this.$emit('loadShow',false);
                            var list = response.data.result;
                            // var has = list.length>0?true:false;
                            for(var i=0;i<list.length;i++){
                                $this.breedList.push(list[i]);
                            }
                            $this.mescroll.endSuccess(list.length);
                            if(list.length>0){
                                $this.noData = false;
                            }else {
                                $this.noData = true;
                            }
                        }else {
                            alert('未知错误，请重新登陆');
                        }

                    }).catch((err)=>{
                        $this.mescroll.endErr();
                        // $this.$emit('loadErrShow',true)
                    });
                },1000);

            }
        }
    }
</script>

<style scoped>
    body,html{margin:0;padding:0;font-size:10px}body{font-family:Helvetica;overflow:scroll;overflow-x:auto}dd,div,dl,dt,h1,h2,h3,h4,h5,h6,img,input,li,ol,p,span,table,ul{margin:0;padding:0;border:0;list-style:none;list-style-type:none}button,input,select{outline:0;border:none}a{text-decoration:none}
    /*顶部列表*/
    .mescroll{
        position: fixed;
        top: 102px;
        bottom: 50px;
        height: auto;/*如设置bottom:51px,则需height:auto才能生效*/
    }
    .goods{
        width: 100%;
    }
    .good{
        margin-bottom: 15px;
        padding:10px;
        background: #f7f7f7;
        display:flex;
        flex-direction: row;
    }
    .content {
        flex:4;
    }
    .sold-out {
        flex:3;
        display:flex;
        justify-content: center;
        align-items: center;
        color:#fca030;
        font-size: 14px;
    }
    .content p {
        font-size: 14px;
        line-height: 24px;
    }
    p span {
        color:#666;
    }
    p.name {
        font-size: 15px;
    }
    .red {
        color:#fa1f1f;
    }
    .img {
        flex:1;
        display:flex;
        justify-content: center;
        align-items: center;
    }
    .search-box {
        border-radius: 5px;
        border:1px solid #bebebe;
        width:75%;
        margin:0 auto;
        background-color: #fff;
        display:flex;
        flex-direction: row;
        align-items: center;
    }
    .search-box input {
        height:30px;
        width:55%;
        border-radius: 5px;
        line-height: 30px;
        font-size: 1.3em;
        padding-left: 0.5em;
        flex: 5;
    }
    .search-box .search {
        flex:1;
        text-align: center;
    }
    .dsj_header {
        background-color: #f3f3f3;
        color: #222;
        padding-top: 10px;
        position: fixed;
        left:0;
        top:0;
        width:100%;
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
        border-bottom: none;
        color:#fca030;
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
        margin: 30px 50px;
    }
    .zwt_select{
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
    }
    .zwt_select>span{
        font-size: 16px;
        color: #0e0d0d;
        line-height: 40px;
    }
    .zwt_select>select{
        border: 1px solid #ccc;
        width: 188px;
        height: 42px;
        appearance:none;
        -moz-appearance:none;
        -webkit-appearance:none;
        background: url("../../assets/img/area_tip03.png") no-repeat scroll right center transparent;
        padding-right: 24px;
    }

    .zwt_select>input{
        border: 1px solid #ccc;
        width: 187px;
        height: 42px;
        text-align: center;
    }

    .zwt_select>select option{
        text-align: center;

    }
    select::-ms-expand { display: none; }

    .putIn_btn{
        display: block;
        background: #50555B;
        font-size: 16px;
        color: #fff;
        width:80px;
        height: 40px;
        margin: 0 auto;
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
    .productBlank {
        width:100px;
        height:100px;
        margin:100px auto;
        margin-bottom: 20px;
        background: url("../../assets/img/productBlank.png");
        background-size: 100%;
    }
</style>
