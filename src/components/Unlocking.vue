<template>
    <div class="unlocking">
        <img class="bike" src="../assets/drawable-xxhdpi/unlock_bike_icon.png" />
        <div class="progress-wrap">
            <div class="progress" :style="{width: progress + '%'}">
                {{ progress }}%
            </div>
            <div class="tips">
                正在开锁中, 请耐心等待
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['time'],
        data() {
            return {
                timeLeft: undefined,
                timeTotal: undefined,
                interval: undefined
            }
        },
        computed: {
            progress() {
                if (this.timeLeft && this.timeTotal) {
                    return parseInt(100 - this.timeLeft/this.timeTotal * 100);
                } else {
                    return 0;
                }
            }
        },
        methods: {
            count() {
                const now = Date.now();
                const left = this.time - now;
                if (left > 0) {
                    this.timeLeft = left;
                    this.$emit('count', this.timeLeft);
                } else {
                    this.end();
                }
            },
            abort() {
                if (this.interval) {
                    this.timeTotal = undefined;
                    this.timeLeft = undefined;
                    window.clearInterval(this.interval);
                }
            },
            start() {
                this.abort();
                if (this.time > 0) {
                    const now = Date.now();
                    this.timeLeft = this.time - now;
                    this.timeTotal = this.timeLeft;
                    this.interval = setInterval(this.count.bind(this), 1000);
                    this.count();
                }
            },
            end() {
                this.abort();
                this.$emit('timesup');
            }
        },
        watch: {
            time: function() {
                this.start();
            }
        }
    }
</script>

<style lang="stylus" scoped>
@import "../assets/funcs.styl"
.unlocking
    position absolute
    width 100%
    height 100%
    z-index 100
    background #fff
.bike 
    position absolute
    height $height(300)
    width $width(493)
    top 50%
    left 50%
    margin-top $height(-200)
    margin-left $width(-246.5)
.progress-wrap
    position absolute
    width $width(490)
    height $height(30)
    top 50%
    left 50%
    margin-top $height(135)
    margin-left $width(-245)
    background #fff
    border 1px solid #18befc
    text-align center
    .tips
        line-height $height(60)
        font-size $toRem(4)
    .progress
        background #18befc
        height 100%
        line-height $height(30)
        font-size $toRem(6)
        color #fff
</style>