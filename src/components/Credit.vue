<template>
    <yb-content-main>
        <yb-header slot="header" :left-options="{backText: '', preventGoBack: false}">
            我的信用
        </yb-header>
        <div class="credit-info" slot="main">
            <div class="dashboard">
                <img src="../assets/drawable-xxhdpi/credit_turntable.png" />
                <span class="val">{{ credit }}</span>
                <div class="rank">
                    很遗憾, 上月您的信用增长没有进入排行榜
                </div>
            </div>
            <div class="stat">
                <div class="cell icon">
                    <img src="../assets/drawable-xxhdpi/credit-up.png" />
                </div>

                <div class="cell desc">
                    <p>上月信用分变化</p>
                    <p class="time">评估时间: {{ beginAt | time-format('yyyy-mm')}}</p>
                </div>

                <div class="cell increment">
                    信用分 {{ incAmount >= 0 ? '+' : '-' }}{{ Math.abs(incAmount) }}
                </div>
            </div>

            <div class="action">
                <router-link class="view-credit-record" to="/credit_list">
                    查看信用历史
                </router-link>
                <div class="cell">
                    <router-link to="/credit_rules">
                        <img src="../assets/drawable-xxhdpi/credit_rule.png" />
                        规则解读
                    </router-link>
                </div>
                <div class="cell">
                    <router-link to="/credit_list?bad_credit_only=true">
                        <img src="../assets/drawable-xxhdpi/credit_record.png" />
                        负面记录
                    </router-link>
                </div>
            </div>
        </div>
    </yb-content-main>
</template>

<script type="text/javascript">
    export default {
        data() {
            return {
                credit: '--',
                incAmount: '--',
                rank: '--',
                beginAt: undefined
            }
        },
        mounted() {
            this.$http({
                    url: `${BASE_URL}/lock-account/monthly_credit_log`,
            }).then((result) => {
                const {status, data, credit } = result.data;
                const record = data[0];
                if (status == 0) {
                    this.credit = credit;
                    this.rank = record.rank;
                    this.incAmount = record.inc_amount;
                    this.beginAt = record.begin_at;
                }
            });
        }
    }
</script>

<style lang="stylus" scoped>
@import "../assets/funcs.styl";
.credit-info
    position relative

.dashboard 
    position absolute
    width 100%
    background #262930
    height $height(1000)
    top -1px
    img 
        display block
        width $width(800)
        position absolute
        top $height(150)
        left 50%
        margin-left $width(-400)
    .val 
        font-size $toRem(40)
        color #75bde0
        display block
        width 100%
        text-align center
        position absolute
        top $height(400)
    .rank
        position absolute
        width 80%
        left 50%
        margin-left -40%
        font-size $toRem(14)
        color #ccc
        text-align center
        top $height(750)

.stat
    font-size $toRem(16)
    position absolute
    padding $height(50) 0
    height $height(200)
    width 100%
    line-height $height(200)
    top $height(1000)
    border-bottom 1px solid #f0f0f0
    .cell 
        vertical-align middle
        display inline-block
    .icon
        width $width(200)
        img
            display block
            width $width(120)
            margin 0 auto
    .desc
        line-height $height(100)
        width $width(670)
        .time
            color #666
    .increment
        float right
        padding-right $width(50)
        text-align right
        width $width(400)
        color #75bde0

.action
    font-size $toRem(16)
    text-align center
    position absolute
    height $height(500)
    width 100%
    top $height(1400)
    
    a 
        display block
        color #000
    .view-credit-record
        color #75bde0
    img 
        display block
        margin $height(100) auto
        height $height(200)
    .cell 
        display inline-block
        width 50%
        float left
    
</style>