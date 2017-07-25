<template>
    <yb-content-main>
        <yb-header slot="header" :left-options="{backText: '', preventGoBack: false}">
            裁剪头像
            <a slot="right" @click.prevent="uploadAvatar">
                确定
            </a>
        </yb-header>
        <div slot="main">
            <crop-photo ref="cropPhoto" slot :url="url"></crop-photo>
            <div>
              <loading v-model="loading" text="上传中..."></loading>
            </div>
        </div>
    </yb-content-main>
</template>

<script>
import CropPhoto from './CropPhoto';
export default {
    components: {
        'crop-photo': CropPhoto
    },

    data() {
        return {
            loading: false,
            url: this.$route.query.url,
        }
    },

    methods: {
        uploadAvatar() {
            this.$refs.cropPhoto.crop((canvas) => {
                // this.$refs.croped.src = canvas.toDataURL("image/png");
                this.loading = true;
                canvas.toBlob((blobData) => {
                    const formData = new FormData();
                    formData.append('file', blobData);
                    this.$http.post(`${UPLOAD_URL}`, formData).then((result) => {
                        const avatar = `${UPLOAD_BASE_URL}/${result.data.path}`;
                        this.$http({
                            method: 'post',
                            url: `${BASE_URL}/lock-account/extra_account_info`,
                            data: {
                                icon: avatar
                            }
                        }).then(() => {
                            this.loading = false;
                            this.$router.back();
                        }).catch((e) => {
                            alert(JSON.stringify(e));
                            this.loading = false;
                        });
                    });
                });
            });

        }
    }

}
</script>

<style>

</style>

