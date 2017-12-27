<template>
    <div>
        <button v-on:click="newPuzzleClicked">New Puzzle</button>
        <button v-on:click="undoClicked">Undo</button>
        <button v-on:click="clearClicked">Clear</button>
        <input type="radio" name="mode" checked>Fill</input>
        <input type="radio" name="mode">Draw</input>
    </div>
</template>
<script lang="ts">
import {$eventService, EventService} from '../infra/event-service';
import Vue from "vue";
export default Vue.extend({
    name: "Toolbar",
    data() {
        return {
            mode: 0
        }
    },
    methods: {
        newPuzzleClicked() {
            $eventService.fire(EventService.Events.NewPuzzleRequest);
        },
        undoClicked() {
            $eventService.fire(EventService.Events.UndoRequest);
        },
        clearClicked() {
            $eventService.fire(EventService.Events.ClearRequest);
        }
    }
});
</script>
<style lang="scss">

</style>
