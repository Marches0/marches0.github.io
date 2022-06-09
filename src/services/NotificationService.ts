import { DateTime } from "luxon";
import * as CalendarService from "./Calendar/CalendarService"

const StorageKey = "notificationservice-desired"

export const NotficationSettingsModalId = "notification-settings-modal";

export class NotificationService {
    private static pendingNotifications: {[key: string] : number} = {};
    private static notificationOptions: DesiredNotifications;

    start() {        
        NotificationService.notificationOptions = this.loadNotifications();
        NotificationService.notificationOptions.notifications.forEach(notification => {
            this.startNotification(notification);
        });
    }
    
    getRegisteredNotifications() : string[] {
        return NotificationService.notificationOptions.notifications;
    }

    async register(text: string) {
        let permissionResult = await Notification.requestPermission();

        if (permissionResult === "granted") {
            this.saveNotification(text);
            this.startNotification(text);
        }
    }

    unregister(text: string) {
        let existing = NotificationService.pendingNotifications[text];

        if (text !== null && text !== undefined) {
            clearTimeout(existing);
        }

        // Delete from where it's saved
        this.removeNotification(text);
    }

    private startNotification(text: string) {
        if (Notification.permission !== "granted") {
            return;
        }

        let when = CalendarService.GetNextEventOccurence(text);
        if (when === null ){
            return;
        }

        let warningTime = when.minus({minutes: NotificationService.notificationOptions.warningMinutes});
        let now = DateTime.local();
        let notifyIn = warningTime.diff(now, ["milliseconds"]).milliseconds;
        if (notifyIn < 0){
            // Too late. e.g. if opening the page when there is 5 mins left before the event ends. Helps with not
            // runnining infinitely. Could add other checks, but this will do for now.
            return;
        }

        NotificationService.pendingNotifications[text] = setTimeout(() => {
            // Send it
            new Notification("CME Clairvoyant", {
                body: `${text} in ${NotificationService.notificationOptions.warningMinutes} minutes`,
                icon: "/favicon.ico"
            });

            // Good luck leaving this page open long enough
            // to overflow the stack
            this.startNotification(text);
            
        }, notifyIn) as unknown as number; // nodejs invading types
    }

    private loadNotifications() : DesiredNotifications {
        let existingJson = window.localStorage.getItem(StorageKey);

        return existingJson !== null
            ? JSON.parse(existingJson)
            : 
            {
                notifications: [],
                warningMinutes: 30 // default
            };
    }

    private saveNotification(text: string) {
        if (NotificationService.notificationOptions.notifications.indexOf(text) === -1) {
            NotificationService.notificationOptions.notifications.push(text);
            this.updateStoredNotifications();
        }   
    }

    private removeNotification(text: string) {
        NotificationService.notificationOptions.notifications = NotificationService.notificationOptions.notifications.filter(n => n !== text);
        this.updateStoredNotifications();
    }

    private updateStoredNotifications(){
        window.localStorage.setItem(StorageKey, JSON.stringify(NotificationService.notificationOptions));
    }
}

interface DesiredNotifications {
    notifications: string[];
    warningMinutes: number;
}