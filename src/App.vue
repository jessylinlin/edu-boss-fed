<template>
  <div id="app">
    <!--根路由出口-->
    <router-view />
    <!-- <p class="text">text</p> -->
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import request from '@/utils/request'

request({
  method: 'GET',
  url: '/boss/v2/api-docs?group=edu-boss-boot'
}).then(res => {
  console.log(res)
})

export default Vue.extend({
  name: 'App'
})
</script>

<style lang="scss" scoped>
//vue config中全局注入
// @import '~@/styles/variables.scss';

.text {
  color: $success-color;
}

</style>
