<template>
  <div class="container">
    <sessions-list :sessions="orderedSessions" @new-session-click="onNewSessionClick" @session-click="onSessionClick"></sessions-list>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import SessionsList from "./sessions-list.vue";
import NewPuzzleDialog from "./new-puzzle-dialog.vue";
import bus from "../bus";
import { Crossword } from "../types/common";
export default Vue.extend({
  name: "Home",
  mounted() {
   // this.$store.dispatch("loadSessions");
  },
  methods: {
    onNewSessionClick(id: string) {
      
    },
    onSessionClick(id: string) {
      this.$router.push('/workspace/'+id);
    }
  },
  computed: {
    ...mapGetters({
      editor: "editor",
      orderedSessions: "orderedSessions",
      activeSession: "activeSession",
      crossword: "crossword",
      snaps: "snaps"
    }),
    initialNameValue() {
      if (!(this as any).activeSessions) return "My crossword..";
      return (this as any).activeSession.name;
    }
  },
  components: {
    SessionsList
  }
});
</script>

<style scoped lang="scss">
.container {
  position: relative;
  //width: 700px;
  margin: 0 auto;
}
</style>
