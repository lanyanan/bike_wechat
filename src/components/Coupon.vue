<template>
    <yb-content-main>
        <yb-header slot="header" :left-options="{backText: '', preventGoBack: false}">
            我的优惠券
        </yb-header>
        <div slot="main">
            <div :style="{display: items === undefined ? 'none' : 'block'}">
                <scroller  lock-x scrollbar-y use-pullup :pullup-config="pullupConfig" height='-40' ref="scroller"  @on-pullup-loading="fetchData">
                    <ul v-if="items && items.length>0">
                        <li v-for="(item, index) in items" :key="index">
                            <div class="inner-cell">
                            </div>
                            <div class="inner-cell">
                            </div>
                        </li>
                    </ul>
                    <p style="text-align: center" v-else>
                        没有数据~
                    </p>
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
                items: undefined,
                lastDate: parseInt(Date.now()/1000),
                limit:0,
                offset: 10,
                pullupConfig: {
                    content: '上拉加载更多',
                    downContent: '松开进行加载',
                    upContent: '上拉加载更多',
                    loadingContent: '加载中...'
                }
            }
        },
        methods: {
            fetchData() {
                this.$http({
                    url: `${BASE_URL}/lock-account/coupon`,
                    params: {
                        limit: this.limit,
                        offset: this.offset
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
                            this.lastDate = lastItem.create_at;
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
    .type 
        font-size $toRem(14)
    .create-at
        font-size $toRem(12)
        color #888
    .credit
        text-align right
        font-size $toRem(14)
        color #000
    .inner-cell
        float left
        display inline-block
        width 50%
        span
            display block
</style>