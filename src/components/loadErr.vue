<template>
    <div class="myloader">
        <div style="text-align: center;height:100%;background: #fff;">
            <img @click="loaderr" src="../assets/img/err.png" style="margin-top: 70%;width:30%;" alt="">
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {

            }
        },
        methods: {
            loaderr () {
                console.log('dianji');
                this.$emit('loadErrShow',false)
            }
        }
    }
</script>

<style scoped>
    .myloader {
        width:100%;
        height:100%;
        position: fixed;
        left:0;
        top:0;
        z-index: 999;
    }
    img {
        width:100%;
    }
</style>
