<template>
  <div class="sidebar left">
    <div class="row" v-for="s in sessions">
      <div  :class="cssClass(s)" @click="$emit('load-session-click', session(s).id)">{{session(s).name}} - {{crossword(session(s).crosswordId).rows}} x {{crossword(session(s).crosswordId).cols}}</div>
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
    }),
    cssClass: function() {
      return (sessionId: string)=> {
        return {
          button: true,
          active: sessionId === (this as any).activeSession.id
        }
      }
    }
  }
});
</script>
<style lang="scss" scoped>
.sidebar {
  width: 300px;
  position: absolute;
}
.sidebar.left {
left: 0px;
}
.row {
  height: 60px;
}
.button {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60px;
  margin: 2px;
  border: 2px solid silver;
}
.button:hover {
  background: silver;
}
.button.active {
  background: sienna;
  color: white;
}
</style>
