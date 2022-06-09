<template>
<a class="link-dark" role="button" data-bs-toggle="modal" :data-bs-target="modalId">
    <i class="bi bi-gear"></i>
</a>
</template>

<script lang="ts">import { NotficationSettingsModalId } from "@/services/NotificationService"


export default {
    data(){
        return {
            modalId: "#" + NotficationSettingsModalId
        }
    }
}

</script>