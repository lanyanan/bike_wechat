<template>
    <yb-content-main>
        <yb-header slot="header" :left-options="{backText: '', preventGoBack: false}">明细
        </yb-header>
        <div class="pay-log" slot="main">
            <div :style="{display: items === undefined ? 'none' : 'block'}">
                <scroller  lock-x scrollbar-y use-pullup :pullup-config="pullupConfig" height='-40' ref="scroller"  @on-pullup-loading="fetchData">
                    <ul>
                        <li v-for="(item, index) in items" :key="index">
                            <div class="inner-cell">
                                <span class="status">{{statusText[item.status]}}</span>
                                <span class="create-at">{{item.create_at | time-format}}</span>
                            </div>
                            <div class="inner-cell">
                                <span class="amount">{{item.amount | cent-to-yuan}}元</span>
                                <span class="pay-type">{{payTypeText[item.pay_type]}}</span>
                            </div>
                        </li>
                    </ul>
                </scroller>
            </div>
            <div :style="{'text-align':'center', display: items === undefined ? 'block': 'none'}">
                加载中...
            </div>

        </div>
    </yb-content-main>
</template>

<script>
    export default {
        data() {
            return {
                lastDate: parseInt(Date.now()/1000),
                items: undefined,
                statusText: ['', '', '', '付款成功'],
                payTypeText: ['', '微信支付', '支付宝', '余额'],

                pullupConfig: {
                    content: '上拉加载更多',
                    downContent: '松开进行加载',
                    upContent: '上拉加载更多',
                    loadingContent: '加载中...'
                }
            }
        },
        methods: {
            loadMore() {
                this.items = this.items.concat(this.items);

            },
            fetchData() {
                this.$http({
                    url: `${BASE_URL}/lock-account/payment`,
                    params: {
                        last_date: this.lastDate
                    }
                }).then(function(result) {
                    this.$refs.scroller.donePullup();
                    const data = result.data;
                    if (data.status == 0) {
                        const length = data.data.length;
                        if (length < 10) {
                            this.$refs.scroller.disablePullup();
                        } else {
                            this.$refs.scroller.enablePullup();
                        }
                        const lastItem = data.data[length - 1];
                        if (lastItem) {
                            this.lastDate = lastItem.update_at;
                        }
                        if (this.items) {
                            this.items = this.items.concat(data.data.slice(1));
                        } else {
                            this.items = data.data;
                        }
                        this.$nextTick(() => {
                            this.$refs.scroller.reset();
                        });
                    }
                }.bind(this));
            },
        },
        created() {
            this.fetchData();
        }
    }
</script>
<style lang="stylus" scoped>
@import "../assets/funcs.styl";
ul
    padding 0
    margin 0
li 
    height $height(250)
    line-height $height(100)
    border-bottom 1px solid #f0f0f0
    list-style none
    box-sizing border-box
    padding $height(30) $width(100)
    width 100%
    .status 
        font-size $toRem(14)
    .create-at
        font-size $toRem(12)
        color #888
    .amount
        text-align right
        font-size $toRem(14)
        color #000
    .pay-type
        text-align right
        font-size $toRem(12)
        color #888
    .inner-cell
        float left
        display inline-block
        width 50%
        span
            display block
</style>