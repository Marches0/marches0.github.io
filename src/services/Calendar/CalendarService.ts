import calendar from "./eventCalendar.json";
import { DateTime } from "luxon";

const TimeShortFormat = "HH:mm";

// Calendar schedule starts from 4th May 2022, which was when a season
// started, and lasts for one season.
const EventEpoch = DateTime.utc(2022, 5, 4).toUTC(60).minus({hours: 1});           

export function GetServerTime() : DateTime {
    return DateTime.local().toUTC(60); 
}

export function GetDayEvents(eventDay: DateTime) : EventOccurence[] {
    let eventSet = GetDayEventSet(eventDay);
    let dayEventNames = calendar.rotation[eventSet.eventSet].filter(e => e !== null);

    // Map event names to actual events
    let dayEvents = calendar.events.filter(e => dayEventNames.indexOf(e.name) !== -1);

    // Some events only occur on a specific day in the rotation
    // (e.g. a boost event only ends on the last day).

    return dayEvents
        .flatMap(e => GetEventOccurencesOnDay(e, eventDay))
        .concat(GetStaticEvents(eventDay))
        .filter(e => e.day === undefined || e.day === eventSet.dayOfRotation);
}

export function GetSeasonRotation() : EventSet[] {
    let serverTime = GetServerTime();
    let currentEventSet = GetDayEventSet(serverTime);

    return calendar.rotation.map((e, i) => ({
        events: e,
        isActive: i === currentEventSet.eventSet,
        next: serverTime.plus({days: GetForwardSetDifference(currentEventSet, i, calendar.rotation.length) * 3 - 1})
    }));
}

export function GetNextEventOccurence(eventName: string) : DateTime | null {
    // Just iterate over every day until we get it.
    // If we don't get it within 30, give up.
    let now = GetServerTime().set({hour: 0, minute: 0, second: 0, millisecond: 0}); // 0 time components so we can base later dates off of this one without worrying about them
    for (let i = 0; i < 30; i++) {
        let applicableEvents = GetDayEvents(now.plus({days: i}))
            .filter(e => e.time > now) // When checking today, ditch things that have already happened.
            .filter(e => e.description === eventName)
            .sort((a, b) => a.time.toUnixInteger() - b.time.toUnixInteger()); // Some events may occur many times per day - get the soonest

        if (applicableEvents.length) {
            return applicableEvents[0].time;
        }
    }

    return null;
}

function GetDayEventSet(eventDay: DateTime) : ActiveEventSet {
    let daysSinceEpoch = Math.trunc(eventDay.diff(EventEpoch).shiftTo("days").days);

    // Events last for three days, so divide by that to find our # of events since epoch
    let eventsSinceEpoch = Math.trunc(daysSinceEpoch / 3);

    // Find the bin we are in based on the number of events, and how long a rotation is.
    return {
        eventSet: eventsSinceEpoch % calendar.rotation.length,
        dayOfRotation: (daysSinceEpoch % 3) + 1
    }
}

function GetStaticEvents(eventDay: DateTime) {
    let events: EventOccurence[] = [];

    // Add the midnight reset, but consider it "tomorrow".
    events.push({
        time: eventDay.plus({days: 1}).set({hour: 0, minute: 0}),
        description: "Daily reset"
    });

    // Kamaitachi
    events.push({
        time: eventDay.set({hour: 20, minute: 0}),
        description: "Kamaitachi"
    });

    // If we're in the Clash window, add that.
    if (eventDay.day <= 12) {
        let clash = calendar.events.filter(e => e.name == "Sovereign Clash")[0];
        events = events.concat(GetEventOccurencesOnDay(clash, eventDay));
    }

    // Dragon Treasure/Nian Expelling/Tree Prayer etc.
    events.push({
        time: eventDay.set({hour: 22, minute: 0}),
        description: "Treasure Event closes",
        day: 3
    });

    // Hetu Ala: Every three weeks from epoch (25th June)
    const hetuEpoch = DateTime.utc(2022, 6, 25).toUTC(60).minus({hours: 1});
    let daysSinceHetu = eventDay.diff(hetuEpoch, ["days", "minutes"]).days; // By having minutes, it means our days are whole.
    if (daysSinceHetu === 21) {
        events.push({
            time: eventDay.set({hour: 21, minute: 0}),
            description: "Hetu Ala opens"
        });
    }

    return events;
}

function GetEventOccurencesOnDay(event: Event, day: DateTime) : EventOccurence[] {
    return event.schedule.map(s => scheduleToOccurence(s));

    function scheduleToOccurence(schedule: Schedule) : EventOccurence{
        let occurenceTime = DateTime.fromFormat(schedule.time, TimeShortFormat, {zone:"UTC+1"});
        return {
            time: day.set({hour: occurenceTime.hour, minute: occurenceTime.minute}),
            description: `${event.name} ${schedule.description}`,
            day: schedule.day
        }
    }
}

function GetForwardSetDifference(currentEventSet: ActiveEventSet, otherEventSet: number, eventSetSize: number){
    let difference =  otherEventSet - currentEventSet.eventSet;

    // Since we want to know the next one in the future, wrap
    // negatives around
    if (difference <= 0){
        difference += eventSetSize;
    }

    return difference;
}

function IsLastSaturdayOfMonth(date: DateTime) : boolean {
    // Saturday = 6
    let lastDayOfMonth = date.set({day: date.daysInMonth});

    // Subtract - 6 to get the difference to Saturday, but add 7 to account for the fact that we 
    // are going backwards (e.g. Saturday -> Sunday = 1, Sunday -> Saturday = 6).
    let lastSaturdayOfMonth = lastDayOfMonth.minus({days: Math.abs(lastDayOfMonth.weekday - 6 + 7)});

    return date.day === lastSaturdayOfMonth.day;
}

export interface EventOccurence {
    time: DateTime;
    description: string;
    day?: number | undefined;
}

export interface Event {
    name: string;
    schedule: Schedule[];
}

export interface Schedule {
    time: string;
    description: string;
    day?: number | undefined;
}

export interface ActiveEventSet {
    eventSet: number;
    dayOfRotation: number;
}

export interface EventSet {
    events: (string | null)[];
    isActive: boolean;
    next: DateTime
}