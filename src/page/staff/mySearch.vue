<template>
    <div>
        <div>
            <div class="hdg-search">
                <div class="hdg-search-outer">
                    <input class="input" type="search" style="color:#444;" @keyup.enter="addHistory" v-model.trim="pName" placeholder="输入商品名称"/>
                    <!--<span class="close" v-if="!showSearch" @click="clear"><img style="width:17px;height:17px;" src="@/assets/img/delete.png" alt=""></span>-->
                    <span class="search" v-if="showSearch" @click="getSearch()"><img style="width:17px;height:17px;" src="@/assets/img/newsearch.png" alt=""></span>
                </div>
                <span class="hdg-back" @click="cancelSearch">取消</span>
            </div>
            <div style="height: 60px;"></div>
            <div class="searchList" v-if="!showPlist">
                <div style="width:100%;display:flex;">
                    <div style="flex:1;text-align: left;font-size: 12px;color:#666;">
                        <span>搜索历史</span>
                    </div>
                    <div style="flex:1;text-align: right;font-size: 12px;color:#666;">
                        <span style="border:1px solid #666;padding:3px;border-radius: 3px;" @click="()=>{isAlert=true;}">清空搜索历史</span>
                    </div>
                </div>
                <div class="slist">
                    <span v-for="s in searchHistoryList" class="sitem" @click="searchItem(s)">
                        {{s}}
                    </span>
                </div>
            </div>
            <ul class="goods" v-if="showPlist">
                <li v-if="nodata" style="padding-left: 20px;font-size: 12px;">
                    没有找到你要搜索的商品...
                </li>
                <li class="good" v-for="b in breedList" @click="detail(b)" v-if="!nodata">
                    <div class="content">
                        <p class="name">{{b.name}} <span v-if="b.from || b.unit || b.model">({{b.from?b.from:(b.unit?b.unit:b.model)}})</span></p>
                        <p><span>库存：{{b.quantity}}</span></p>
                        <p><span class="red">￥{{b.price.toFixed(2)}}</span></p>
                    </div>
                    <div class="sold-out" v-if="!b.nowState">
                        <p>此商品已下架</p>
                    </div>
                    <div class="img">
                        <img style="width:6px;height:10px;" src="@/assets/img/more.png" alt="">
                    </div>
                </li>
            </ul>
        </div>
        <transition name="fade">
            <div class="alert" v-show="showToast">
                <toast>
                    <p slot="toast">添加成功</p>
                </toast>
            </div>
        </transition>
        <transition name="fade">
            <div class="alert" v-show="isAlert">
                <Alert @on-close="myCloseAlert">
                    <p slot="delete">确定要清空搜索记录吗</p>
                </Alert>
            </div>
        </transition>
        <productDetail v-if="showDetail" @close="close" @addCart="addCart" :pDetail="pDetail"></productDetail>
    </div>
</template>

<script type="text/javascript">
    import '@/assets/css/breeder.css';
    import productDetail from '@/page/staff/productDetail'
    import toast from '@/components/toast'
    import Alert from '@/components/Alert'
    const delay = (function() {
        let timer = 0;
        return function(callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();
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
                pName:'',
                breedList:[],
                showPlist:false,//显示搜索历史列表
                showDetail:false,
                showToast:false,
                isAlert:false,
                searchHistoryList:[],
                nodata:false,
                showSearch:true,  //显示搜索图标
            }
        },
        components:{
            productDetail,toast,Alert
        },
        mounted () {
            this.$nextTick(function () {
                let arr = window.localStorage.getItem('staffSearch');
                if(arr){
                    this.searchHistoryList = JSON.parse(arr);
                    this.searchHistoryList.slice(0,20);
                    this.searchHistoryList = this.arrRemove(this.searchHistoryList);
                }else {
                    this.searchHistoryList = [];
                }

            })

        },
        watch:{
            pName () {
                delay(() => {
                    this.getSearch();
                }, 300);
            },
            searchHistoryList () {
                this.arrRemove(this.searchHistoryList);
            }
        },
        methods:{
            detail (b) {
                this.showDetail = true;
                this.pDetail = b;
                this.searchHistoryList.unshift(b.name);
                let json = JSON.stringify(this.searchHistoryList)
                window.localStorage.setItem('staffSearch',json);
            },
            addHistory () {
                if(this.pName){
                    this.searchHistoryList.unshift(this.pName);
                    console.log(this.searchHistoryList);
                    let json = JSON.stringify(this.searchHistoryList)
                    window.localStorage.setItem('staffSearch',json);
                }
            },
            searchItem (s) {
                this.pName = s;
                this.getSearch();
            },
            myCloseAlert (bool) {
                this.isAlert = false;
                if(bool){
                    this.searchHistoryList = [];
                    window.localStorage.removeItem('staffSearch');
                }
            },
            close () {
                this.showDetail = false;
            },
            addCart () {
                this.showToast = true;
                setTimeout(()=>{
                    this.showToast = false;
                },1000);
            },
            cancelSearch:function(){
                this.$router.go(-1);
            },
            clear () {
                this.showSearch = true;
                this.breedList = [];
            },
            getSearch () {
                if(this.pName){
                    this.showPlist = true;
                    this.$http.get('/storage/'+this.farmId+'/variety/1/0?stuffName='+this.pName+'&token='+this.token).then(msg=>{
                        if(msg.data.code == 200){
                            this.breedList = msg.data.result;
                            this.breedList.length == 0 ? this.nodata = true : this.nodata = false;
                        }else {
                            alert('未知错误，请重新登陆');
                        }
                    }).catch(err=>{
                        this.$emit('loadErrShow',true)
                    })
                }else {
                    this.showPlist = false;
                }
            },
            arrRemove (array) {
                let n = {}, r = [], len = array.length, val, type;
                for (let i = 0; i < array.length; i++) {
                    val = array[i];
                    type = typeof val;
                    if (!n[val]) {
                        n[val] = [type];
                        r.push(val);
                    } else if (n[val].indexOf(type) < 0) {
                        n[val].push(type);
                        r.push(val);
                    }
                }
                return r;
            },
        }
    }
</script>

<style scoped>
    .searchList {
        width:100%;
        padding:10px 20px;
        box-sizing: border-box;
    }
    .slist {
        font-size: 13px;
        line-height: 40px;
        color:#444;
        margin-top: 10px;
    }
    .sitem {
        margin-right: 40px;
    }

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
        padding:10px;
        line-height: 30px;
    }
    .goods{
        width: 100%;
    }
    .good{
        margin-bottom: 12px;
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


</style>
