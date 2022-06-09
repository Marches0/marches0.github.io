import { DateTime } from "luxon";

const StorageKey = "notificationservice-desired"

export class NotificationService {
    private static pendingNotifications: {[key: string] : NodeJS.Timeout}; // um
    private static savedNotifications: string[];

    start() {
        NotificationService.savedNotifications = this.loadNotifications().notifications;
        NotificationService.savedNotifications.forEach(notification => {
            this.startNotification(notification);
        });
    }
    
    getRegisteredNotifications() : string[] {
        return NotificationService.savedNotifications;
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

        let when = DateTime.local(); // todo get the actual one

        let notifyIn = DateTime.local().diff(when, ["milliseconds"]).milliseconds;
        console.warn(notifyIn);

        NotificationService.pendingNotifications[text] = setTimeout(() => {
            // Send it
            new Notification("CME Clairvoyant", {
                body: text
            });

            // Good luck leaving this page open long enough
            // to overflow the stack
            // Get next time & reregister
            this.startNotification(text);
            
        }, notifyIn);

        console.warn(NotificationService.pendingNotifications[text]);
    }

    private getNextTime(text: string) {
        // read season calendar and get when it next happens
    }

    private loadNotifications() : DesiredNotifications {
        let existingJson = window.localStorage.getItem(StorageKey);
        return existingJson !== null
            ? JSON.parse(existingJson)
            : { notifications:[] };
    }

    private saveNotification(text: string) {
        NotificationService.savedNotifications.push(text);
        this.updateStoredNotifications();
    }

    private removeNotification(text: string) {
        NotificationService.savedNotifications = NotificationService.savedNotifications.filter(n => n !== text);
       this.updateStoredNotifications();
    }

    private updateStoredNotifications(){
        window.localStorage.setItem(StorageKey, JSON.stringify({
            notifications: NotificationService.savedNotifications
        }));
    }
}

interface DesiredNotifications {
    notifications: string[];
}