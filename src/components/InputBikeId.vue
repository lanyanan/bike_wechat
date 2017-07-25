<template>
    <yb-content-main >
        <yb-header slot="header" :left-options="{backText: '', preventGoBack: true}" @on-click-back="handleBack()">
            {{ title || '输入编号开锁' }}
        </yb-header>
        <div class="input-bike-id" slot="main">
            <div class="tips-img">
                <img class="bike" src="../assets/drawable-xxhdpi/unlock_bike_icon.png" />
                <img class="shoe" src="../assets/drawable-xxhdpi/unlock_shoe_icon.png" />
            </div>
            <x-input class="input" v-model="bike_id" placeholder="单车编号"></x-input>
            <div class="tips-text">
                请确认您输入了正确自行车编码
            </div>
            <x-button class="btn" type="primary" @click.native="submit()">确定</x-button>
        </div>
    </yb-content-main>
</template>

<script>
export default {
    props: ['title'],
    data() {
        return {
            bike_id: '7550000005',
            disabled: true
        }
    },
    methods: {
        handleBack() {
            this.$emit('back');
        },
        submit() {
            this.$emit('submit', this.bike_id);
            this.bike_id = '';
        }
    }
}
</script>

<style lang="stylus" scoped>
@import "../assets/funcs.styl";
.input-bike-id
    position absolute
    height 100%
    width 100%
    background #222
.tips-img
    margin 0 auto
    padding $height(100) 0
    width $width(1100)
    overflow hidden
    img
        position relative
        padding 0
        margin 0
        display inline-block
        width $width(500)
    .bike 
        top $height(-50)
.tips-text
    text-align center
    font-size $toRem(16)
    color #888
    margin $height(100) 0
.input:before
    display none
.input 
    width $width(1350)
    height $height(150)
    padding $height(20) $width(50)
    line-height $height(150)
    margin $height(50) auto $height(50) auto
    font-size $toRem(16)
    color #fff
    background #504a4a
.btn 
    width $width(1450)
    border-radius 0
</style>