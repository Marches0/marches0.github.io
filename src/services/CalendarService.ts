import calendar from "../views/Tools/data/eventCalendar.json"; // todo should move the code from calendar into here?
import { DateTime} from "luxon";

const TimeShortFormat = "HH:mm";

// Calendar schedule starts from 4th May 2022, which was when a season
// started, and lasts for one season.
const EventEpoch = DateTime.utc(2022, 5, 4).toUTC(60);           

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
    let currentEventSet = GetDayEventSet(GetServerTime());
    return calendar.rotation.map((e, i) => ({
        events: e,
        isActive: i === currentEventSet.eventSet
    }));
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

    // Hetu Ala: Every three weeks from the epoc (June 4th)
    const hetuAlaEpoch = DateTime.utc(2022, 6, 4).toUTC(60);
    let diff = eventDay.diff(hetuAlaEpoch, ["weeks", "days"]);
    if (diff.weeks % 3 === 0 && diff.days < 1) {
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
}