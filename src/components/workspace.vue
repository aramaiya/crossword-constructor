<template>
  <div class="container">
    <debounced-input :initial-value="!!activeSession? activeSession.name : 'My crossword'" @change="nameChanged"></debounced-input>
    <div>
      <editor :cwd="crossword(activeSession.crosswordId)" v-if="activeSession"></editor>
    </div>
    <snaps-list :snaps="orderedSnaps(sessionId)" @load-snap-click="loadSnap"></snaps-list>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import Editor from "./editor/editor.vue";
import SessionsList from "./sessions-list.vue";
import SnapsList from "./snaps-list.vue";
import DebouncedInput from "./debounced-input.vue";
import bus from "../bus";
import { Crossword } from "../types/common";
export default Vue.extend({
  name: "Builder",
  data() {
    return { sessionId: null };
  },
  mounted() {
    bus.$on("new-puzzle-request", (p: { rows: number; cols: number }) => {
      this.$store.dispatch("createPuzzle", { rows: p.rows, cols: p.cols });
    });
    this.$store.dispatch("loadSavedSession", this.$route.params["session_id"]);
    this.sessionId = this.$route.params["session_id"];
  },
  methods: {
    loadSession(id: string) {
      this.$store.dispatch("loadSavedSession", id);
    },
    loadSnap(id: string) {
      this.$store.dispatch("loadSnap", id);
    },
    nameChanged(newName: string) {
      console.log("name changed", newName);
      this.$store.dispatch("updateName", newName);
    }
  },
  computed: {
    ...mapGetters({
      editor: "editor",
      orderedSessions: "orderedSessions",
      activeSession: "activeSession",
      crossword: "crossword",
      orderedSnaps: "orderedSnaps"
    }),
    initialNameValue() {
      if (!(this as any).activeSessions) return "My crossword..";
      return (this as any).activeSession.name;
    }
  },
  components: {
    Editor,
    SessionsList,
    DebouncedInput,
    SnapsList
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
  width: calc(100% - 600px);
}
</style>
