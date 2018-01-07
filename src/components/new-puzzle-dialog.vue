<template>
  <div>
    <div class="new-puzzle">
      <div class="name">
        <input v-model="name"></input>
      </div>
      <div class="dim-label">
        <label for="rowsSelect">Rows</label>
        <select id="rowsSelect" v-model="rows">
          <option v-for="(i,ix) in 47">{{i +3}}</option>
        </select>
      </div>
      <div class="dim-label">
        <label for="colsSelect">Columns</label>
        <select id="colsSelect" v-model="cols">
          <option v-for="(i,ix) in 47">{{i +3}}</option>
        </select>
      </div>
      <div>
        <button @click="createClicked">Create</button>
        <button @click="cancelClicked">Cancel</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import bus from "../bus";
export default Vue.extend({
  name: "new-puzzle-dialog",
  data() {
    return {
      name: "Untitled",
      rows: 15,
      cols: 15
    };
  },
  methods: {
    cancelClicked() {
      this.$emit("cancel");
    },
    createClicked() {
      this.$store
        .dispatch("createSession", { name: this.name, rows: this.rows, cols: this.cols })
        .then(v => {
          console.log("promise resolved with", v);
          this.$emit("create", v);
        });
    }
  }
});
</script>
<style lang="scss" scoped>
.new-puzzle {
  border: 2px solid silver;
  width: 200px;
  height: 200px;
  background: white;
}
.dim-label {
  display: inline-block;
  width: 100px;
  text-align: center;
  label {
    display: block;
  }
  input {
    text-align: center;
  }
}
</style>
