<template>
  <div class="container" v-if="activeSession">
    <div>{{activeSession.name}}</div>
    <div>
      <button v-on:click="onSaveClick" :disabled="!unsaved">Save Puzzle</button>
      <button v-on:click="onSaveSnapClick">Save Snap</button>
    </div>
    <div>
      <editor :cwd="crossword(activeSession.crosswordId)" @crossword-update="onCrosswordUpdate" @crossword-set="onCrosswordSet"></editor>
    </div>
    <snaps-list :snaps="orderedSnaps(sessionId)" @load-snap-click="loadSnap"></snaps-list>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import Editor from "./editor/editor.vue";
import SnapsList from "./snaps-list.vue";
import DebouncedInput from "./debounced-input.vue";
import bus from "../bus";
import { Crossword } from "../types/common";
export default Vue.extend({
  name: "Builder",
  data() {
    return {
      sessionId: null,
      crosswordInEdit: null,
      unsaved: false
    };
  },
  mounted() {
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
    onCrosswordUpdate(cwd: Crossword) {
      console.log("cwd udpated");
      this.crosswordInEdit = cwd;
      this.unsaved = true;
    },
    onCrosswordSet(cwd: Crossword) {
      console.log("cwd set");
      this.crosswordInEdit = cwd;
      this.unsaved = false;
    },
    onSaveClick() {
      if (!this.crosswordInEdit) return;
      this.$store.dispatch("saveSession", this.crosswordInEdit).then(() => {
        this.unsaved = false;
      });
    },
    onSaveSnapClick() {
      if (!this.crosswordInEdit) return;
      this.$store.dispatch("saveSnap", this.crosswordInEdit);
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
  watch: {
    "$route.params.session_id": function(id) {
      console.log("route changed", id);
    }
  },
  components: {
    Editor,
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
