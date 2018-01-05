<template>
  <div>
    <input type="text" @keydown="handleInputChange()" v-model="value"></input>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import _ from "lodash";

export default Vue.extend({
  name: "DebouncedInput",
  props: ["initialValue"],
  data() {
    return {
      value: this.initialValue
    };
  },
  methods: {
    handleInputChange: _.debounce(function(this:any) {
        this.$emit("change", this.value)}, 500)
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
