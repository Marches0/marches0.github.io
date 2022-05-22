<template>
<h2>Season Points Calculator</h2>
<div class="mb-3">
    <div class="form-group">
        <label for="season-event">Event</label>
        <select class="form-control" id="season-event" @input="onEventSelected" v-model="selected">
            <option selected disabled>Event</option>
            <option v-for="event in seasonEvents" :key="event.name">{{event.name}}</option>
        </select>
    </div>
</div>
<div id="event-parameters" v-if="showEventDetails">
    <div class="form-group">
        <label for="currency-used" id="season-currency-label">{{selectedEvent.seasonCurrency}}</label>
        <input type="number" class="form-control" id="currency-used" min="0" v-model="currencyUsed">
    </div>
    <div class="form-group mt-3">
        <div class="row">

            <div class="col-md-4">
                <div class="card card-points" :style="{'border-color': cardBorderColour}">
                    <div class="card-body">
                    <h5>Last tier</h5>
                    <p id="last-tier-currency">{{lastTierCurrency}}</p>
                    <p id="last-tier-points" style="margin: 0px;">{{lastTierSeasonPoints}}</p>
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <div class="card card-points shadow" :style="{'border-color': cardBorderColour}">
                    <div class="card-body">
                    <h5>Your points</h5>
                    <p id="your-points-currency">{{totalCurrencyUsed}}</p>
                    <p id="your-points-points" style="margin: 0px;">{{totalSeasonPoints}}</p>
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <div class="card card-points" :style="{'border-color': cardBorderColour}">
                    <div class="card-body">
                    <h5>Next tier</h5>
                    <p id="next-tier-currency">{{nextTierCurrency}}</p>
                    <p id="next-tier-points" style="margin: 0px;">{{nextTierSeasonPoints}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<SeasonPointsChart :currency-used="currencyUsed" :season-event="selectedEvent" :last-tier-index="lastTierIndex"></SeasonPointsChart>

</template>

<script lang="ts">
import { hexToRGB } from "@/helpers/ColourHelper";
import { SeasonPointIndex, type SeasonEvent } from "@/types/SeasonEvent";
import seasonPoints from "./data/seasonPoints.json";
import SeasonPointsChart from "./SeasonPointsChart.vue";

export default {
    // Reactive data we display
    components: { SeasonPointsChart },
    data() {
        return {
            seasonEvents: seasonPoints.events,
            selected: null,
            currencyUsed: 0
        };
    },
    // Methods that mutate data
    methods: {
        eventCurrencyString(currencyAmount: number): string {
            return `${(this as any as _this).selectedEvent.seasonCurrency}: ${currencyAmount.toLocaleString()}`;
        },
        onEventSelected() {
            (this as any as _this).currencyUsed = null;
        }
    },
    // depends on other stuff
    computed: {
        // Whether or not to show event-specific details.
        cardBorderColour(){
            let event = (this as any as _this).selectedEvent;
            return hexToRGB(event.colour, 0.75);
        },
        showEventDetails(): boolean {
            return (this as any as _this).selected !== null;
        },
        // The user-selected event.
        selectedEvent() {
            return seasonPoints.events.filter(e => e.name == (this as any as _this).selected)[0];
        },
        // The earnt season points.
        totalSeasonPoints(): string {
            if (!this.selectedEvent || !(this as any as _this).currencyUsed) {
                return "";
            }
            let tiers = (this as any as _this).reachedTiers;
            let points = tiers.reduce((total, tier) => total + tier[SeasonPointIndex.SeasonPoints], 0);
            return `Total Season Points: ${points.toLocaleString()}`;
        },
        // The currency used.
        totalCurrencyUsed(): string {
            if (!this.selectedEvent || !(this as any as _this).currencyUsed) {
                return "";
            }
            let currencyUsed = (this as any as _this).currencyUsed;
            return (this as any as _this).eventCurrencyString(currencyUsed as number);
        },
        lastTierSeasonPoints(): string {
            if (!this.lastTier) {
                return "";
            }
            let last = (this as any as _this).lastTier;
            if (last.length) {
                return `Season Points: ${last[SeasonPointIndex.SeasonPoints].toLocaleString()}`;
            }
            return "";
        },
        lastTierCurrency(): string {
            if (!this.lastTier) {
                return "";
            }
            let last = (this as any as _this).lastTier;
            if (last.length) {
                return (this as any as _this).eventCurrencyString(last[SeasonPointIndex.Currency]);
            }
            return "";
        },
        nextTierSeasonPoints(): string {
            if (!this.nextTier) {
                return "Unknown";
            }
            let next = (this as any as _this).nextTier;
            if (next === null) {
                return "Unknown";
            }
            if (next.length) {
                return `Season Points: ${next[SeasonPointIndex.SeasonPoints].toLocaleString()}`;
            }
            return "";
        },
        nextTierCurrency(): string {
            if (!this.nextTier) {
                return "Unknown";
            }
            let next = (this as any as _this).nextTier;
            if (next === null) {
                return "Unknown";
            }
            if (next.length) {
                return (this as any as _this).eventCurrencyString(next[SeasonPointIndex.Currency]);
            }
            return "";
        },
        // The tiers the user reached.
        reachedTiers(): number[][] {
            if (!this.selectedEvent || !(this as any as _this).currencyUsed) {
                return [];
            }
            let selectedEvent = (this as any as _this).selectedEvent;
            let currencyUsed = (this as any as _this).currencyUsed;
            return selectedEvent.seasonPoints.filter(p => p[SeasonPointIndex.Currency] <= (currencyUsed as number));
        },
        // The last tier the user reached.
        lastTier(): number[] {
            let tiers = (this as any as _this).reachedTiers
                .sort(function (a, b) { return b[SeasonPointIndex.Currency] - a[SeasonPointIndex.Currency]; });
            if (tiers.length) {
                return tiers[0];
            }
            return [];
        },
        lastTierIndex() : number{
            let nextTier = (this as any as _this).nextTier;
            if (!nextTier?.length) {
                return this.reachedTiers.length - 1;
            }

            // Try to figure out how far through the tier we are
            let lastTier = (this as any as _this).reachedTiers[0];

            // How far is the last tier from the next tier?
            let tierDifference = nextTier[SeasonPointIndex.Currency] - lastTier[SeasonPointIndex.Currency];

            // How far is the user from the next tier?
            let userDifference = nextTier[SeasonPointIndex.Currency] - (this as any as _this).currencyUsed!;

            // How much progression has the user made to the next tier?
            let userProgression = tierDifference - userDifference;

            var percentDone = userProgression / tierDifference;

            return this.reachedTiers.length + percentDone - 1;
        },
        // The lowest tier the user did not reach.
        nextTier(): number[] | null {
            if (!this.selectedEvent || !(this as any as _this).currencyUsed) {
                return [];
            }
            let selectedEvent = (this as any as _this).selectedEvent;
            let currencyUsed = (this as any as _this).currencyUsed;
            let missedTiers = selectedEvent.seasonPoints.filter(p => p[SeasonPointIndex.Currency] > (currencyUsed as number));
            if (!missedTiers.length) {
                return null;
            }
            // sorted the other way
            return missedTiers
                .sort(function (a, b) { return a[SeasonPointIndex.Currency] - b[SeasonPointIndex.Currency]; })[0];
        }
    }    
}

interface _this {
    selected: string;
    cardBorderColour: string;
    currencyUsed: number | null;
    selectedEvent: SeasonEvent;
    reachedTiers: number[][];
    lastTier: number[];
    nextTier: number[] | null;
    eventCurrencyString: (currencyAmount: number) => string;
}

</script>