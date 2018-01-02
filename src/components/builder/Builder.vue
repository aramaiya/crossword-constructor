<template>
  <div class="container">
    <grid :cwd="editor.crossword" v-if="!!editor.crossword"></grid>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import Grid from "../grid/grid.vue";
import bus from "../../bus";
import { Crossword } from "../../types/common";
export default Vue.extend({
  name: "Builder",
  mounted() {
    bus.$on("new-puzzle-request", (p: { rows: number; cols: number }) => {
      this.$store.dispatch("createPuzzle", { rows: p.rows, cols: p.cols });
    });
    this.$store.dispatch("createPuzzle", { rows: 15, cols: 15 });
    console.log("state", this.$store.state.editor);
  },
  methods: {},
  computed: {
    ...mapGetters({
      editor: "editor"
    })
  },
  components: {
    Grid,
  }
});
</script>

<style scoped lang="scss">
.container {
  position: relative;
  width: 700px;
  margin: 0 auto;
}
</style>
