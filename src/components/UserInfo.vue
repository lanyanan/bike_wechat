<template>
    <div>
        <yb-content-main>
            <yb-header slot="header" :left-options="{backText: '', preventGoBack: false}">
                个人信息
            </yb-header>
            <div class="setting" slot="main">
                <label for="avatar" class="avatar-label">
                    <input id="avatar" class="avatar-input" type="file" accept="image/*" @change="handleSelectAvatarFile"  ref="avatarFile" />
                </label>
                <yb-menu-list>
                    <yb-menu-list-item class="avatar"  title="头像" :value="avatar">
                          <img v-if="avatar !== undefined" :src="avatar ? avatar : defaultAvatar">
                    </yb-menu-list-item>
                    <yb-menu-list-item  title="昵称" :value="nickname ? nickname: phone" is-link link="/nickname"></yb-menu-list-item>
                    <yb-menu-list-item  title="姓名" :value="name" >
                        
                    </yb-menu-list-item>
                    <yb-menu-list-item  title="实名认证" :value="name ? '已认证': '未认证'" ></yb-menu-list-item>
                    <yb-menu-list-item  title="手机号" :value="phone" is-link></yb-menu-list-item>
                </yb-menu-list>
<!--                 <yb-menu-list class="student-verify">
                    <yb-menu-list-item  title="校园认证" :value="isStudentVerify ? '已认证': '未认证'" is-link></yb-menu-list-item>
                </yb-menu-list> -->
            </div>
        </yb-content-main>
    </div>
</template>

<script type="text/javascript">


    export default {

        data() {
            return {
                viewType: '',
                avatar: undefined,
                nickname: '',
                name: '',
                phone: USER.phone,
                isStudentVerify: false,
                defaultAvatar: require('../assets/drawable-xxhdpi/avatar_default_login.png')
            }
        },
        methods: {
            handleSelectAvatarFile() {
                const file = this.$refs.avatarFile.files[0];
                const url = window.URL.createObjectURL(file);
                this.$router.push({
                    path: '/set-avatar',
                    query: {
                        url: url
                    }
                });
            }
        },
        computed: {
        },
        created() {
            if (USER.token) {
                this.$http({
                    url: `${BASE_URL}/lock-account/extra_account_info`,
                }).then((result) => {
                    const data = result.data;
                    if (data.status == 0) {
                        const { name, nickname, icon:avatar } = data;
                        this.avatar = avatar || '';
                        this.name = name;
                        this.nickname = nickname;
                    }
                });
            }
        }
    }
</script>

<style lang="stylus" scoped>
@import "../assets/funcs.styl";
.avatar-label 
    z-index 10
    position absolute
    left 0
    height $height(250);
    width 100%
.avatar-input
    position absolute
    left -200%
    
.avatar 
    height $height(180)
    img
        margin-top $height(40)
        height $height(180)
.student-verify
    margin-top $height(100)
</style>