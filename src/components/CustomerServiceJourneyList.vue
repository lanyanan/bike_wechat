<template>
    <yb-content-main>
        <yb-header slot="header" :left-options="{backText: '', preventGoBack: false}">
            客户服务
        </yb-header>
        <div class="custom-service" slot="main">
            <div class="question-about-journey">
                <h5>您对哪段行程有疑问?</h5>
                <scroller lock-x scrollbar-y use-pullup :pullup-config="pullupConfig" height='-40' ref="scroller"  @on-pullup-loading="fetchHistoryRide">
                    <yb-menu-list>
                            <yb-menu-list-item v-for="(item, index) in journeyList" :link="'/customer_service_for_an_journey?journey_id=' + item.session_id + '&bike_id=' + item.bike_id" :key="index">
                                <div class="journey-item" slot="child">
                                    <div class="inner-cell">{{item.start | time-format}}</div>
                                    <div class="inner-cell"><label>骑行时间:</label> {{item.duration | second-to-minute }}分钟</div>
                                    <div class="inner-cell">{{item.session_id}}</div>
                                    <div class="inner-cell"><label>骑行花费:</label> {{item.cost | cent-to-yuan}}元</div>
                                </div>
                            </yb-menu-list-item>
                    </yb-menu-list>
                </scroller>
            </div>
        </div>
    </yb-content-main>
</template>

<script>
    export default {
        data() {
            return {
                journeyList: [],
                pullupConfig: {
                    content: '上拉加载更多',
                    downContent: '松开进行加载',
                    upContent: '上拉加载更多',
                    loadingContent: '加载中...'
                }
            }
        },
        methods: {
            fetchHistoryRide() {
                this.$http({
                    url: `${BASE_URL}/lock-stat/user_history_ride?start=${this.journeyList.length + 1}&limit=10`
                }).then(function(result) {
                    const data = result.data;
                    if (data.status == 0) {
                        const length = data.history.length;
                        if (length < 10) {
                            this.$refs.scroller.disablePullup();
                        }
                        this.journeyList = this.journeyList.concat(data.history);
                        this.$refs.scroller.donePullup();
                        this.$nextTick(() => {
                            this.$refs.scroller.reset();
                        });
                    }

                }.bind(this));
            }
        },
        created() {
            this.fetchHistoryRide();
        }
    }
</script>


<style lang="stylus" scoped>
@import "../assets/funcs.styl"
h5 
    padding 0
    margin 0
    text-indent $width(30)
    font-size $toRem(12)
    height $height(100)
    line-height $height(100)
// -----------
.journey-item 
    left 0
    top 0
    position absolute
    font-size $toRem(12)
    line-height $height(90)
    width 100%
    padding $height(20) 0 
    margin 0
    overflow hidden
    .inner-cell
        text-indent $width(40)
        display inline-block
        width 40%
        padding 0 
        margin 0
        
        label 
            color #555

</style>