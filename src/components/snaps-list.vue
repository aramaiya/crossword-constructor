<template>
  <div class="sidebar right">
    <div class="row" v-for="s in snaps">
      <div class="snap-preview" v-show="s===previewingId"><grid :cells="crossword(s.crosswordId).cells"></grid></div>
      <div :class="cssClass(s)" @click="$emit('load-snap-click', s.crosswordId)" @mouseover="mouseEntered(s)" @mouseleave="mouseLeft(s)">{{s.createdDate}}</div>
      <div style="position: absolute; left: 275px; top: 25px; cursor: pointer" @click="onClick(s.id)">X</div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import NewPuzzleDialog from "./new-puzzle-dialog.vue";
import { Crossword } from "../types/common";
import Grid from "./grid/grid.vue"
import bus from "../bus";
export default Vue.extend({
  name: "SnapsList",
  props: ["snaps"],
  components: {Grid},
  data() {
    return {
      previewingId: null
    }
  },
  methods: {
    mouseEntered(id: string) {
      console.log('mouse enter')
      this.previewingId = id;
    },
    mouseLeft() {
      console.log('mouse leave')
      this.previewingId = null;
    },
    onClick(id: number) {
      console.log(id);
      this.$store.dispatch("deleteSnap", id);
    }
  },
  computed: {
    ...mapGetters({
      editor: "editor",
      activeSession: "activeSession",
      crossword: "crossword",
      session: "session",
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
.snap-preview {
  position: absolute;
  top: 0;
  right: 300px;
  transform-origin: top right;
  transform: scale(.5);
}
.sidebar {
  width: 300px;
  position: absolute;
}
.sidebar.right {
right: 0px;
}
.row {
  position: relative;
  height: 60px;
}
.button {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(100% - 50px);
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
