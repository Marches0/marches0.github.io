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
        <tr v-for="event in upcomingEventsDisplay" :key="event.name">
            <td>{{event.serverTime}}</td>
            <td>{{event.localTime}}</td>
            <td>{{event.description}}</td>
            <td>{{event.occursIn}}</td>
        </tr>
    </tbody>
</table>

<hr>
<h4>Season Rotation</h4>
<table class="table table-striped">
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
import { DateTime, Duration, Settings as DateTimeSettings } from "luxon";
import calendar from "./data/eventCalendar.json";

const TimeDisplayFormat = "HH:mm:ss";
const TimeShortFormat = "HH:mm";
const TimeJsonFormat = "HH:mmZ";

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
        (this as any as _this).eventRotation = (this as any as _this).getSeasonRotation();
    },
    methods: {
        startServerTimeTick() : void {
            setInterval(() => {
                (this as any as _this).updateServerTime();
            }, 1000);
        },
        updateServerTime() {
            let serverTime = DateTime.local().toUTC(60);
            (this as any as _this).serverTimeNow = serverTime.toFormat(TimeDisplayFormat);
        },
        getSeasonRotation() : eventSet[] {
            let currentEventSet = this.getActiveEventSet(DateTime.local().toUTC(60));
            return calendar.rotation.map((e, i) => ({
                events: e,
                isActive: i === currentEventSet.eventSet
            }));
        },
        getActiveEventSet(eventDay: DateTime) : activeEventSet {
            // Calendar schedule starts from 4th May 2022, which was when a season
            // started, and lasts for one season.
            // Figure out our offset from that to determine the events.
            const eventEpoch = DateTime.utc(2022, 5, 4).toUTC(60);

            let daysSinceEpoch = Math.trunc(eventDay.diff(eventEpoch).shiftTo("days").days);

            // Events last for three days, so divide by that to find our # of events since epoch
            let eventsSinceEpoch = Math.trunc(daysSinceEpoch / 3);

            // Find the bin we are in based on the number of events, and how long a rotation is.
            return {
                eventSet: eventsSinceEpoch % calendar.rotation.length,
                dayOfRotation: (daysSinceEpoch % 3) + 1
            }
        },
        getUpcomingTimers() : eventOccurence[] {
            let serverTime = DateTime.local().toUTC(60);
            // We care about:
            //  - Today's timers that we are yet to reach
            //  - Tomorrow's timers that will not happen today (e.g. do not have tomorrow's close if we are yet to have it today)
            let timers = this.getOneDayTimers(0).concat(this.getOneDayTimers(1));
            let futureTimers = timers
                .filter(t => t.time > serverTime)
                .sort((a, b) => a.time.toUnixInteger() - b.time.toUnixInteger());
            
            // Can't use a set, since we can't specify an equality operator; just
            // yeet it into an array. It's small.
            let timersWeCareAbout: eventOccurence[] = [];
            futureTimers.forEach(eventOccurence => {
                if(timersWeCareAbout.every(t => t.description !== eventOccurence.description)){
                    timersWeCareAbout.push(eventOccurence);
                }
            });
            
            return timersWeCareAbout;
        },
        getOneDayTimers(daysFromToday: number) : eventOccurence[] {
            // Calendar schedule starts from 4th May 2022, which was when a season
            // started, and lasts for one season.
            // Figure out our offset from that to determine the events.
            const eventEpoch = DateTime.utc(2022, 5, 4).toUTC(60);
            let eventDay = DateTime.local().toUTC(60).plus({days: daysFromToday});

            let eventSet =this.getActiveEventSet(eventDay);
            let dayEventNames = calendar.rotation[eventSet.eventSet].filter(e => e !== null);

            // Map event names to actual events
            let dayEvents = calendar.events.filter(e => dayEventNames.indexOf(e.name) !== -1);

            // Some events only occur on a specific day in the rotation
            // (e.g. a boost event only ends on the last day).

            return dayEvents
                .flatMap(e => this.getTimersOffset(e, daysFromToday))
                .concat(this.getStaticEvents(eventDay))
                .filter(e => e.day === undefined || e.day === eventSet.dayOfRotation);
        },
        // Events that occur outside of the season rotation.
        getStaticEvents(date: DateTime) : eventOccurence[] {
            let events: eventOccurence[] = [];

            // Add the midnight reset, but consider it "tomorrow".
            events.push({
                time: date.plus({days: 1}).set({hour: 0, minute: 0}),
                description: "Daily reset"
            });

            // Kamaitachi
            events.push({
                time: date.set({hour: 20, minute: 0}),
                description: "Kamaitachi"
            });

            // If we're in the Clash window, add that.
            if (date.day <= 12) {
                let clash = calendar.events.filter(e => e.name == "Sovereign Clash")[0];
                events = events.concat(this.getTimersDate(clash, date));
            }

            // Dragon Treasure/Nian Expelling/Tree Prayer etc.
            events.push({
                time: date.set({hour: 22, minute: 0}),
                description: "Treasure Event closes",
                day: 3
            });

            return events;
        },
        getTimersOffset(event: event, dayOffset: number) : eventOccurence[] {
            return event.schedule.map(s => 
            ({
                // Add the +1 on manually so the offset is parsed.
                time: DateTime.fromFormat(s.time, TimeShortFormat, {zone:"UTC+1"}).plus({days: dayOffset}),
                description: `${event.name} ${s.description}`,
                day: s.day
            }));
        },
        getTimersDate(event: event, date: DateTime)  : eventOccurence[] {
            return event.schedule.map(s => 
            ({
                // Add the +1 on manually so the offset is parsed.
                time: DateTime.fromFormat(s.time + "+1", TimeJsonFormat).set({year: date.year, month: date.month, day: date.day}),
                description: `${event.name} ${s.description}`,
                day: s.day
            }));
        },
        toDisplayableEvent(event: eventOccurence) {
            return {
                serverTime: event.time.toFormat(TimeShortFormat),
                localTime: event.time.setZone(DateTimeSettings.defaultZone).toFormat(TimeShortFormat),
                description: event.description,
                occursIn: this.toFriendlyDuration(event.time.diff(DateTime.local().toUTC(60), ["hours", "minutes"]))
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

                if (until.minutes === 1) {
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
    getSeasonRotation: () => eventSet[];
    getUpcomingTimers: () => eventOccurence[];
    getOneDayTimers: (daysFromToday: number) => eventOccurence[];
    getTimers: (event: event) => eventOccurence[];
    toDisplayableEvent: (event: eventOccurence) => any[];
    serverTimeNow: string;
    upcomingEvents: eventOccurence[];
    eventRotation: eventSet[];
}

interface eventOccurence {
    time: DateTime;
    description: string;
    day?: number | undefined;
}

interface event {
    name: string;
    schedule: {
        time: string;
        description: string;
        day?: number | undefined;
    }[];
}

interface activeEventSet {
    eventSet: number;
    dayOfRotation: number;
}

interface eventSet {
    events: (string | null)[];
    isActive: boolean;
}
</script>