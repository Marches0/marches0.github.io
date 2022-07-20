<!-- Modals need to be "above" the thing that triggers them in the DOM. To make this work,
we put them all together here which is registered in the main body of the app. -->

<template>

<UpdateHistoryModal></UpdateHistoryModal>

</template>

<script lang="ts">
import UpdateHistoryModal from "./UpdateHistory/UpdateHistoryModal.vue"
export default {
    components: {UpdateHistoryModal}
}

</script>