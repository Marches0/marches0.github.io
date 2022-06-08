<template>

    <a href="#" class="link-dark rounded btn btn-toggle btn-toggle-notreally link-dark rounded position-relative" role="button"
        data-bs-toggle="modal" :data-bs-target="updateHistoryModalId" @click="onModalOpen">

        <i class="bi bi-activity"></i>Update History
        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" v-show="hasUnreadVersions">
            New
        </span>

    </a>

</template>

<script lang="ts">

import * as UpdateHistory from "./UpdateHistory"

export default {
    data() {
        return {
            updateHistoryModalId: "#" + UpdateHistory.UpdateHistoryModalId,
            hasUnreadVersions: UpdateHistory.HasUnreadVersions()
        };
    },
    methods: {
        // Ideally this would actually link to the modal opening rather than clicking the button,
        // but there's a built-in event handler for click, unlike the modal bits, so this will do for now.
        onModalOpen() {
            UpdateHistory.UpdateLastSeen();
            (this as any).hasUnreadVersions = false;
        }
    }
}
</script>