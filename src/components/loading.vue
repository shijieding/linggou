<template>
    <div class="myloader">
        <div style="background: #fff;height:100%;">
            <img src="../assets/img/loading.gif" alt="">
        </div>
    </div>
</template>

<script>
    export default {
        name: "loading"
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
        margin-top: -20%;
    }
</style>
