<template>
    <div class="yb-uploader weui-uploader">
        <div class="weui-uploader__bd">
            <div class="weui-uploader__input-box">
                <input ref="photo" class="weui-uploader__input" type="file" accept="image/*" @change="selectPhoto()"/>
                <img v-if="previewSrc" style="width: 100%" ref="photo-preview" :src="previewSrc" />
            </div>
            <slot name="tips"></slot>
        </div>
    </div>
</template>
<script type="text/javascript">
    export default {
        props: ['value'],
        data() {
            return {
                previewSrc: ''
            }
        },
        methods: {
            selectPhoto() {
                const file = this.$refs.photo.files[0];
                if (file) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        // get loaded data and render thumbnail.
                        this.previewSrc = e.target.result;
                    }.bind(this);
                    
                    // read the image file as a data URL.
                    reader.readAsDataURL(file);
                    this.$emit('input', file);
                }
            }
        }
    }
</script>

<style lang="stylus">
    .yb-uploader
        .weui-uploader__input-box
            margin 0px
        .weui-uploader__input-box
            margin 3px
</style>
<style lang="less">
@import '~vux/src/styles/weui/widget/weui-uploader/index.less';
</style>