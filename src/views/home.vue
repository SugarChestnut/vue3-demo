<template>
    <!-- <el-link type="primary" @click="go('/chat')">primary</el-link> -->
    <!-- 在不重新加载页面的情况下改变 URL -->
     <div>
        <router-link to="/chat">chat</router-link>
     </div>
    <div>
        <router-link to="/wechat">wechat</router-link>
    </div>
</template>

<script lang="ts" setup></script>

<style lang="sass" scoped></style>
