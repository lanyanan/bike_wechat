<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  created() {
    const $http = this.$http;
    // Add a request interceptor
    $http.interceptors.request.use(function (config) {
      const token = window.USER.token;
      if (token) {
        config.headers['X-Auth-Token'] = token;
      }
      return config;
    }, function (error) {
        return Promise.reject(error);
    });
    $http.interceptors.response.use((response) => {
      console.log('response', response);
      return response;
    }, (error) => {
      const response = error.response;
      if (response) {
        const httpStatus = response.status;
        const data = response.data || {};
        const status = data.status;
        if (httpStatus == 401 || status == 5) {
          if (window.isWebview) {
            location.href = CONST.unAuthWebview;
          } else {
            this.$router.push('/logout');
          }
        }
        if (httpStatus > 299) {
          this.$vux.toast.show({
              type: 'warn',
              text: CONST.error[status || 'unknown']
          });
        }
      } else {
        this.$vux.toast.show({
          type: 'warn',
          text: CONST.error['network']
        });
      }
      return Promise.reject(error);
    });
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
</style>

<style lang="stylus">
@import "./assets/base.styl";
</style>

<style>
body {
    background: #fafafa
}
.vux-header-title a,
.vux-header-title a:visited {
    color: #fff;
}
.weui-btn_primary:not(.weui-btn_disabled):active,
.weui-btn_primary {
    background-color: #4cc2ff
}
.weui-btn_disabled.weui-btn_primary {
    background-color: #93daff
}
</style>
