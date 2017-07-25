<template>
    <yb-content-main>
        <yb-header slot="header" :left-options="{backText: '', preventGoBack: false}">
            红包明细
        </yb-header>
        <div slot="main">
            <div :style="{display: items === undefined ? 'none' : 'block'}">
                <scroller  lock-x scrollbar-y use-pullup :pullup-config="pullupConfig" height='-40' ref="scroller"  @on-pullup-loading="fetchData">
                    <ul>
                        <li v-for="(item, index) in items" :key="index">
                            <div class="inner-cell">
                                <span class="type">编号: {{ item.id }}</span>
                                <span class="create-at">{{ item.create_at | time-format }}</span>
                            </div>
                            <div class="inner-cell">
                                <span class="money">+ {{ item.amount | cent-to-yuan }}</span>
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
                items: undefined,
                page_num:1,
                row_per_page: 10,
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
                    url: `${BASE_URL}/lock-account/lucky_money`,
                    params: {
                        page_num: this.page_num,
                        row_per_page: this.row_per_page
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
                        this.page_num++;

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
    .money
        color #da362f
        text-align right
        font-size $toRem(14)
    .inner-cell
        float left
        display inline-block
        width 50%
        span
            display block
</style>