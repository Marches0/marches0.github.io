<template>

<div class="jumbotron text-center">
    <h1 class="display-4 utc-clock">{{serverTimeNow}}</h1>
    <p class="lead">Server Time (UTC + 1)</p>
</div>

<h4>Current Timers</h4>
<table class="table table-striped">
    <thead>
        <tr>
            <th scope="col">Server Time</th>
            <th scope="col">Your Time</th>
            <th scope="col">Event</th>
            <th scope="col">Occurs in...</th>
        </tr>
    </thead>
    <tbody id="table-body">
        <tr v-for="event in upcomingEventsDisplay" :key="event.name" :class="event.description === 'Daily reset' ? 'daily-reset' : ''">
            <td>{{event.serverTime}}</td>
            <td>{{event.localTime}}</td>
            <td>{{event.description}}</td>
            <td>{{event.occursIn}}</td>
        </tr>
    </tbody>
</table>

<h4>Season Rotation</h4>
<table class="table table-striped-double">
    <thead>
        <tr>
            <th scope="col">Boost Event</th>
            <th scope="col">Event</th>
            <th scope="col">Minigame</th>
        </tr>
    </thead>
    <tbody id="table-body">
        <tr v-for="eventSet in eventRotation" :style="{'font-weight': eventSet.isActive ? 'bolder' : 'normal'}"> <!-- Empty string for 'normal' causes an error, but works at runtime -->
            <td v-for="event in eventSet.events">{{event}}</td>
        </tr>
    </tbody>
</table>

</template>

<script lang="ts">
import { Duration, Settings as DateTimeSettings } from "luxon";
import * as CalendarService from "../../services/Calendar/CalendarService"

const TimeDisplayFormat = "HH:mm:ss";
const TimeShortFormat = "HH:mm";

export default {
    data() {
        return {
            serverTimeNow: "",
            upcomingEvents: [],
            eventRotation: []
        };
    },
    computed: {
        upcomingEventsDisplay() {
            var upcoming = (this as any as _this).upcomingEvents;
            return upcoming.map(u => (this as any as _this).toDisplayableEvent(u));
        }
    },
    mounted() {
        (this as any as _this).updateServerTime();
        (this as any as _this).startServerTimeTick();

        (this as any as _this).upcomingEvents = (this as any as _this).getUpcomingTimers();
        (this as any as _this).eventRotation = CalendarService.GetSeasonRotation();
    },
    methods: {
        startServerTimeTick() : void {
            setInterval(() => {
                (this as any as _this).updateServerTime();
            }, 1000);
        },
        updateServerTime() {
            let serverTime = CalendarService.GetServerTime();
            (this as any as _this).serverTimeNow = serverTime.toFormat(TimeDisplayFormat);

            // Have the table update every minute, in sync with the server time (i.e. when it hits 00 seconds).
            // Could do this as a separate interval, but just put it here.
            if (serverTime.second < 1) {
                (this as any as _this).upcomingEvents = (this as any as _this).getUpcomingTimers();
            }
        },
        getUpcomingTimers() : CalendarService.EventOccurence[] {
            let serverTime = CalendarService.GetServerTime();
            // We care about:
            //  - Today's timers that we are yet to reach
            //  - Tomorrow's timers that will not happen today (e.g. do not have tomorrow's close if we are yet to have it today)
            let timers = CalendarService.GetDayEvents(serverTime).concat(CalendarService.GetDayEvents(serverTime.plus({day: 1})));
            let futureTimers = timers
                .filter(t => t.time > serverTime)
                .sort((a, b) => a.time.toUnixInteger() - b.time.toUnixInteger());
            
            // Can't use a set, since we can't specify an equality operator; just
            // yeet it into an array. It's small.
            let timersWeCareAbout: CalendarService.EventOccurence[] = [];
            futureTimers.forEach(eventOccurence => {
                if(timersWeCareAbout.every(t => t.description !== eventOccurence.description)){
                    timersWeCareAbout.push(eventOccurence);
                }
            });
            
            return timersWeCareAbout;
        },
        toDisplayableEvent(event: CalendarService.EventOccurence) {
            return {
                serverTime: event.time.toFormat(TimeShortFormat),
                localTime: event.time.setZone(DateTimeSettings.defaultZone).toFormat(TimeShortFormat),
                description: event.description,
                occursIn: this.toFriendlyDuration(event.time.diff(CalendarService.GetServerTime(), ["hours", "minutes"]))
            }
        },
        toFriendlyDuration(until: Duration){
            let friendlyText = "";

            if (until.hours > 0) {
                if (until.hours === 1) {
                    friendlyText += "1 hour";
                }
                else {
                    friendlyText += until.hours + " hours";
                }
            }

            if (until.minutes > 0) {
                if (friendlyText.length){
                    friendlyText += ", ";
                }

                // When there's only minutes, the time left goes like 1.2 minutes left.
                // To ensure we don't get the wrong numbers, use a range. Could use the rounded
                // number later, but I've written it now and here we are.
                if (until.minutes <= 1.1) {
                    friendlyText += "1 minute";
                }
                else {
                    friendlyText += Math.round(until.minutes) + " minutes";
                }
            }

            return friendlyText;
        }
    }
}

interface _this {
    startServerTimeTick: () => void;
    updateServerTime: () => void;
    getUpcomingTimers: () => CalendarService.EventOccurence[];
    toDisplayableEvent: (event: CalendarService.EventOccurence) => any[];
    serverTimeNow: string;
    upcomingEvents: CalendarService.EventOccurence[];
    eventRotation: CalendarService.EventSet[];
}
</script>

<style scoped>
tr.daily-reset {
    /* Have a border on the day crossover */
    border-top-width: 2px;
    border-top-style: groove;
}

.table-striped-double>tbody>tr:nth-of-type(4n)>* {
    --bs-table-accent-bg: var(--bs-table-striped-bg);
    color: var(--bs-table-striped-color)
}

.table-striped-double>tbody>tr:nth-of-type(4n-1)>* {
    --bs-table-accent-bg: var(--bs-table-striped-bg);
    color: var(--bs-table-striped-color)
}

</style>