<template>
  <div class="container">
    <div class="tile button" @click="onCreateClick">
      <div>
        <span>+</span>
      </div>
    </div>
    <div v-for="s in orderedSessions" :class="cssClass(s)" @click="$emit('session-click', session(s).id)">
      <div>{{session(s).name}} <br/> {{crossword(session(s).crosswordId).rows}} x {{crossword(session(s).crosswordId).cols}}</div>
    </div>
    <new-puzzle-dialog class="floater" v-if="isNewDialogControlVisible" @create="onCreate" @cancel="onCancel"></new-puzzle-dialog>

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
  components: { NewPuzzleDialog },
  methods: {
    onCancel() {
      console.log("cancel click");
      this.isNewDialogControlVisible = false;
    },
    onCreateClick(v: string) {
      console.log("create click", v);
      this.isNewDialogControlVisible = true;
    },
    onCreate(id: string) {
      console.log("create click", id);
      this.isNewDialogControlVisible = false;
      this.$emit("session-click", id);
    }
  },
  data() {
    return {
      isNewDialogControlVisible: false
    };
  },
  computed: {
    ...mapGetters({
      editor: "editor",
      activeSession: "activeSession",
      orderedSessions: "orderedSessions",
      crossword: "crossword",
      session: "session"
    }),
    cssClass: function() {
      return (sessionId: string) => {
        return {
          tile: true,
          button: true,
          active:
            (this as any).activeSession &&
            sessionId === (this as any).activeSession.id
        };
      };
    }
  }
});
</script>
<style lang="scss" scoped>
.floater {
  position: absolute;
}
.container {
  width: 800px;
  display: flex;
  flex-wrap: wrap;
}
.tile {
  width: 250px;
  height: 100px;
  display: flex;
  justify-content: center;
  border: 2px solid silver;
  border-radius: 5px;
}
.button {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.button:hover {
  background: silver;
}
.button.active {
  background: sienna;
  color: white;
}
</style>
