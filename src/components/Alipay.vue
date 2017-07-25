<template>
    <div>
        <div v-if="$route.query.url">
            请点击右上角 -> 用浏览器打开
        </div>
    </div>
</template>

<script>
export default {
    created() {
        if (!/micromessenger/.test(navigator.userAgent.toLowerCase())) {
            const form = document.createElement('form');
            form.method = 'post';
            form.action = this.$route.query.url;
            form.submit();
        }
    }
}
</script>
