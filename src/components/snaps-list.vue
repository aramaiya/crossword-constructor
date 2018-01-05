<template>
  <div class="sidebar right">
    <div class="row" v-for="s in snaps">
      <div  :class="cssClass(s)" @click="$emit('load-snap-click', s)">{{s}} - {{crossword(s).rows}} x {{crossword(s).cols}}</div>
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
  name: "SnapsList",
  props: ["sessions"],
  computed: {
    ...mapGetters({
      editor: "editor",
      activeSession: "activeSession",
      crossword: "crossword",
      session: "session",
      snaps: "snaps"
    }),
    cssClass: function() {
      return (sessionId: string)=> {
        return {
          button: true,
         // active: sessionId === (this as any).activeSession.id
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
.sidebar.right {
right: 0px;
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
