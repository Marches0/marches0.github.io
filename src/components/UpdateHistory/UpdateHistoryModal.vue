<template>

    <div class="modal fade" :id="updateHistoryModalId" tabindex="-1" aria-hidden="true" show="">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Update History</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="card card-stacked" v-for="update in updates">
                        <div class="card-body">
                            <h5 class="card-title">{{formatDate(update.date)}}</h5>
                            <ul>
                                <li v-for="updateText in update.updates">{{updateText}}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

</template>

<script lang="ts">

import * as UpdateHistory from "./UpdateHistory"
import updates from "./updateHistory.json"

export default {
    data() {
        return {
            updateHistoryModalId: UpdateHistory.UpdateHistoryModalId,
            updates: updates.updates
        };
    },
    methods: {
        formatDate(dateTime: string){
            return UpdateHistory.FriendlyDateTime(dateTime);
        }
    }
}

</script>

<style scoped>
.card-stacked:not(:first-of-type) {
    margin-top: 16px;
}

.card-body {
    padding-bottom: 0px;
}
</style>