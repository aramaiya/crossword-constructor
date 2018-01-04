<template>
  <div class="sidebar">
    <div class="row" v-for="s in sessions">
      <button @click="$emit('load-session-click', session(s).id)">{{session(s).name}} - {{crossword(session(s).crosswordId).rows}} x {{crossword(session(s).crosswordId).cols}}</button>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import NewPuzzleDialog from "./new-puzzle-dialog.vue";
import { Crossword } from "../types/common";
import bus from "../bus";
export default Vue.extend({
  name: "SessionsList",
  props: ["sessions"],
  computed: {
    ...mapGetters({
      editor: "editor",
      activeSession: "activeSession",
      crossword: "crossword",
      session: "session"
    })
  }
});
</script>
<style lang="scss" scoped>
.sidebar {
  width: 300px;
  position: absolute;
  left: 0px;
}
.row {
  height: 60px;
}
button {
  width: 100%;
  height: 100%;
}
</style>
