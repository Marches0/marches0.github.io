<template>
    <BoxCalculator :boxRewards="boxItems" :boxes="boxes" storage-key="boxcalculator-ministersouls"></BoxCalculator>
</template>

<script lang="ts">
import BoxCalculator from "../../components/BoxCalculator/BoxCalculator.vue"
import souls from "./data/ministerSouls.json";
export default {
    components: { BoxCalculator },
    mounted(){
        // old key. remove this later.
        window.localStorage.removeItem("ministersoulcalculator-state");
    },
    data() {
        return {
            boxes: souls.items,
            boxItems: souls.itemNames
        }
    }
}
</script>