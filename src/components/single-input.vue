<template>
  <div>
    <input type="text" @keydown="handleInputChange()" v-model="value"></input>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "SingleInput",
  props: ["initialValue"],
  data() {
    return {
      value: this.initialValue
    };
  },
  computed: {
    handleInputChange() {
      let delayId: number;
      return () => {
        if (!!delayId) clearTimeout(delayId);
        console.log(delayId);
        delayId = setTimeout(() => this.$emit("change", this.value), 1000);
      };
    }
  },
  watch: {
    initialValue: function(val){
      this.value = val;
    }
  }
});
</script>
<style lang="scss">

</style>
