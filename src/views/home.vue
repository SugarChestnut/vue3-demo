<template>
    <!-- <el-link type="primary" @click="go('/chat')">primary</el-link> -->
     <!-- 在不重新加载页面的情况下改变 URL -->
    <router-link to="/chat">chat</router-link>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function go(url) {
    router.push({ path: url });
}
</script>

<style lang="sass" scoped></style>
