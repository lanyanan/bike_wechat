<template></template>
<script>
    export default {
        data() {
            return {
                
            }
        },
        created() {
            window.USER = {};
            localStorage.removeItem(USER_CACHE_KEY);
            this.$router.replace({
                path: '/login'
            });
        }
    }
</script>
