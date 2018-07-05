<template>
    <div>
        <div class="bbox">
            <div class="modal">
                <img style="width:24px;height:20px;" src="@/assets/img/true.png" alt="">
                <p style="color:#fff;font-size: 15px;margin-top: 10px;">
                    <slot name="toast"></slot>
                </p>
            </div>
        </div>
    </div>
</template>

<script type="es6">
    export default {
        data() {
            return {}
        },
        components: {},
        methods: {}
    }
</script>

<style scoped>
.bbox {
    position:fixed;
    left:0;
    top:0;
    right: 0;
    bottom:0;
    width:100%;
    height:100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
    div.modal {
        width:140px;
        height:95px;
        box-sizing: border-box;
        padding:20px;
        background-color: rgba(26,26,26,0.8);
        text-align: center;
        border-radius: 5px;
    }
</style>