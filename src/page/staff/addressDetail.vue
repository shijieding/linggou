<template>
    <div>
        <ul>
            <li class="item">
                <span class="key">收货人：</span>
                <input type="text" class="val" v-model="name">
            </li>
            <li class="item">
                <span class="key">联系电话：</span>
                <input type="number" class="val" v-model="phone">
            </li>
            <li class="item">
                <span class="key">所在地区：</span>
                <input type="text" id="city-picker"  @click="mouse()" class="val" v-model="picker" readonly placeholder="请选择所在区域"/>
                <span class="more"></span>
            </li>
            <li class="item">
                <span class="key">详细地址：</span>
                <input type="text" class="val" v-model="addrdesc">
            </li>
        </ul>
        <div class="btn-box">
            <div class="btn" @click="submit" v-if="!isAmend">
                保 存
            </div>
            <div class="btn" @click="amend" v-if="isAmend">
                保 存
            </div>
        </div>
    </div>
</template>

<script type="es6">

    import $ from 'jquery'
    import '@/../static/jquery-weui.min'
    import '@/../static/city-picker.min'
    import '@/../static/jquery-weui.min.css'
    //返回页面时隐藏地址选择框
    window.addEventListener("popstate", function(e) {
        let el = document.getElementsByClassName("weui-picker-container");
        if(el[0]){
            el[0].style.display = 'none';
        }
    }, false);
    export default {
        data() {
            return {
                picker:[],
                name:'',
                phone:'',
                addrdesc:'',
                addrId:'',
                isAmend:false
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
        },
        mounted () {
            let _this = this;
            $("#city-picker").cityPicker({
                title: "选择省市区/县",
                onChange: function (picker, values, displayValues) {
                    _this.picker = displayValues;
                    console.log(_this.picker);
                }
            });
            if(this.$route.query.addrDetail){
                this.isAmend = true;
                this.addrId = this.$route.query.addrDetail.id;
                this.name = this.$route.query.addrDetail.name;
                this.phone = this.$route.query.addrDetail.phoneNum;
                this.picker.push(this.$route.query.addrDetail.area);
                this.addrdesc = this.$route.query.addrDetail.specificAddress
                ;
            }
        },
        methods: {
            submit () {
                if(this.name && this.phone && this.picker && this.addrdesc){
                    if(this.testPhone(this.phone)){
                        let j = {
                            name:this.name,
                            phoneNum:this.phone,
                            area:this.picker.join(''),
                            specificAddress:this.addrdesc
                        }
                        let json = JSON.stringify(j)
                        this.$emit('loadShow',true);
                        this.$http.post('/storage/farm/shippingcart/addaddress?token='+this.token,json).then(msg=>{
                            this.$emit('loadShow',false);
                            this.$router.push('/addressList')
                        }).catch(err=>{
                            this.$emit('loadErrShow',true)
                        })
                    }else {
                        alert('请输入正确的联系方式');
                    }
                }else {
                    alert('请填写完整的信息');
                }
            },
            amend () {
                if(this.name && this.phone && this.picker && this.addrdesc){
                    if(this.testPhone(this.phone)){
                        let j = {
                            id:this.addrId,
                            name:this.name,
                            phoneNum:this.phone,
                            area:this.picker.join(''),
                            specificAddress:this.addrdesc
                        }
                        console.log(j);
                        let json = JSON.stringify(j)
                        this.$emit('loadShow',true);
                        this.$http.post('/storage/farm/shippingcart/changeaddress?token='+this.token,json).then(msg=>{
                            this.$emit('loadShow',false);
                            this.$router.push('/addressList')
                        }).catch(err=>{
                            this.$emit('loadErrShow',true)
                        })
                    }else {
                        alert('请输入正确的联系方式');
                    }
                }else {
                    alert('请填写完整的信息');
                }
            },
            mouse () {
                let input = document.getElementsByTagName('INPUT');
                console.log(input);
                for(let i=0;i<input.length;i++){
                    input[i].blur();
                }
            },
            testPhone (str) {
                let phone = /^1[3,5,8]\d{9}$/;
                let tel = /^0(([1,2]\d)|([3-9]\d{2}))\d{7,8}$/;
                if(phone.test(str) || tel.test(str)){
                    return true;
                }else {
                    return false;
                }
            },
        }
    }
</script>

<style scoped>
.item {
    padding:8px 15px;
    border-bottom: 1px solid #cacaca;
    font-size: 14px;
    color:#333;
    position:relative;
}
    .key {
        width:70px;
    }
    .val {
        width:70%;
    }
    .more {
        width:7px;
        height:12px;
        position:absolute;
        right:30px;
        top:12px;
        background: url("../../assets/img/more.png");
        background-size: 100%;
    }
.btn-box {
    position:fixed;
    left:0;
    bottom:0;
    width:100%;
    padding:30px 0;
    background-color: #fff;
    z-index: 1;
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