<template>
    <div>
        <div class="crumb" @click="onHomeClick">Home</div><div>{{$route.path}}</div>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
methods:{
    onHomeClick(){
        this.$router.push('/');
    }
}
});
</script>
<style lang="scss" scoped>
.crumb {
  display: inline-flex;
  align-items: center;
  height: 30px;
  background: silver;
  padding: 5px;
  cursor: pointer;
}
</style>
