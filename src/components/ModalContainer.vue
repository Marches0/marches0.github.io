<!-- Modals need to be "above" the thing that triggers them in the DOM. To make this work,
we put them all together here which is registered in the main body of the app. -->

<template>

<UpdateHistoryModal></UpdateHistoryModal>
<NotificationSettings></NotificationSettings>

</template>

<script lang="ts">
import UpdateHistoryModal from "./UpdateHistory/UpdateHistoryModal.vue"
import NotificationSettings from "./Notifications/NotificationSettingsModal.vue"
export default {
    components: {UpdateHistoryModal, NotificationSettings}
}

</script>