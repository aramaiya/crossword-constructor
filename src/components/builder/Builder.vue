<template>
  <div class="container">
    <sessions-list :sessions="orderedSessions" @load-session-click="loadSession"></sessions-list>
        <div>
      <toolbar :initial-mode="mode" :initial-symmetry="symmetry" @clear-all-click="clearClick" @clear-values-click="clearValuesClick" @save-click="savePuzzleClick" @undo-click="undoClick" @redo-click="redoClick"></toolbar>
    </div>
    <debounced-input :initial-value="!!activeSession? activeSession.name : 'My crossword'" @change="nameChanged"></debounced-input>
    <grid ref="_grid" class="editor" :cwd="crossword(activeSession.crosswordId)" v-if="activeSession"></grid>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import Grid from "../grid/grid.vue";
import SessionsList from "../sessions-list.vue";
import DebouncedInput from "../debounced-input.vue";
import bus from "../../bus";
import { Crossword } from "../../types/common";
import Toolbar from "../toolbar.vue";
export default Vue.extend({
  name: "Builder",
  mounted() {
    bus.$on("new-puzzle-request", (p: { rows: number; cols: number }) => {
      this.$store.dispatch("createPuzzle", { rows: p.rows, cols: p.cols });
    });
    this.$store.dispatch("loadSessions");
    this.$store.dispatch("loadPuzzle");
    console.log("state", this.$store.getters.session());
  },
  methods: {
    loadSession(id: string) {
      this.$store.dispatch("loadSavedSession", id);
    },
    nameChanged(newName: string) {
      console.log("name changed", newName);
      this.$store.dispatch("updateName", newName);
    },
    clearClick() {
      (this.$refs._grid as any).clearAll();
    },
    undoClick() {
      //this.$refs._grid.undo();

    },
    redoClick() {
      //this.$refs._grid.redo();
    },
    clearValuesClick() {
      //this.$refs._grid.clearValues();
    },
    savePuzzleClick() {
      this.$store.dispatch("saveSession", this.$refs.crossword);
    },
  },
  computed: {
    ...mapGetters({
      editor: "editor",
      orderedSessions: "orderedSessions",
      activeSession: "activeSession",
      crossword: "crossword"
    }),
    initialNameValue() {
      if (!(this as any).activeSessions) return "My crossword..";
      return (this as any).activeSession.name;
    }
  },
  components: {
    Grid, SessionsList, DebouncedInput, Toolbar
  }
});
</script>

<style scoped lang="scss">
.container {
  position: relative;
  //width: 700px;
  margin: 0 auto;
}
.editor {
  position: absolute;
  left: 300px;
  width: calc(100% - 300px);
}
</style>
