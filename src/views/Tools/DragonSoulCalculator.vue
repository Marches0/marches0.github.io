<template>
    <BoxCalculator :boxRewards="boxItems" :boxes="boxes" storageKey="boxcalculator-dragonsouls"></BoxCalculator>
</template>

<script lang="ts">
import BoxCalculator from "../../components/BoxCalculator/BoxCalculator.vue"
import souls from "./data/dragonSouls.json";
export default {
    components: { BoxCalculator },
    data() {
        return {
            boxes: souls.items,
            boxItems: souls.itemNames
        }
    }
}
</script>