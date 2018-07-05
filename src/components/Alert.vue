<template>
  <div>
    <div class="mark">
      <div class="alert-content">
        <p>
          <slot name="delete"></slot>
        </p>
        <div class="button-box textcenter">
          <button class="true" @click="myDelete">确定</button>
          <button class="false" @click="closeMySelf">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
  .mark {
    position: fixed;
    z-index: 999;
    left:0;
    bottom:0;
    top:0;
    right: 0;
    width:100%;
    height:100%;
    background-color: rgba(0,0,0,0.2);
  }
  .mark .alert-content {
    width:244px;
    height:123px;
    margin:200px auto;
    background-color: #fff;
    border-radius: 10px;
      position:relative;
  }
  .alert-content>p {
    font-size: 15px;
    line-height: 20px;
      padding:0px 30px;
      padding-top: 20px;
      text-align: center;
  }
  .button-box {
      position:absolute;
      left:0;
      bottom:0;
      width:100%;
      display:flex;
      flex-direction: row;
      height:48px;
      line-height: 48px;
      border-top:1px solid #bdbdbd;
  }
  .button-box button {
      flex:1;
      text-align: center;
      color:#404040;
      background-color: transparent;
      font-size: 15px;
  }
  .button-box button:first-child {
      border-right: 1px solid #bdbdbd;
  }
  .alert-content .button-box button:hover {
    cursor:pointer;
  }
</style>
<script type="es6">
  export default {
    data () {
      return {

      }
    },
    methods:{
      closeMySelf () {
        this.$emit('on-close',false)
      },
      myDelete () {
        this.$emit('on-close',true)
      }
    }
  }

</script>
