<template>

    <div class="modal fade" :id="modalId" tabindex="-1" aria-hidden="true" @show.bs.modal="getTimers" v-on:show.bs.modal="getTimers()">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Notification Settings</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Timer warning:
                    <div class="input-group mb-3">
                        <input type="number" class="form-control" v-model="notificationWarningMinutes" min="0">
                        <span class="input-group-text">minutes</span>
                    </div>
                    
                    Subscribed timers:
                    <ul>
                        <li v-for="timer in subscribedTimers.sort()" :key="updateKey">
                            {{timer}}
                            <a role="button" @click="removeTimer(timer)">
                                <i class="bi bi-x-lg text-danger"></i>
                            </a>
                        </li>
                    </ul>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

</template>

<script lang="ts">
import { NotficationSettingsModalId, NotificationService } from "@/services/NotificationService"

const notificationService = new NotificationService();

export default {
    data() {
        return {
            modalId: NotficationSettingsModalId,
            notificationWarningMinutes: notificationService.getNotificationWarningTime(),
            subscribedTimers: notificationService.getRegisteredNotifications(),
            updateKey: 0
        }
    },
    mounted(){
        // lol
        document.getElementById(NotficationSettingsModalId)?.addEventListener("show.bs.modal", () => {
            (this as any).subscribedTimers = notificationService.getRegisteredNotifications();
            (this as any).updateKey++;
        });
    },
    methods: {
        removeTimer(name: string) {
            notificationService.unregister(name);
            (this as any).subscribedTimers = notificationService.getRegisteredNotifications();
        },
        getTimers() {
            return notificationService.getRegisteredNotifications();
        }
    },
    watch: {
        notificationWarningMinutes: {
            handler(newValue: number, oldValue: number) {
                if(!Number.isInteger(newValue) || newValue < 0) {
                    return;
                }
                notificationService.setNotificationWarningTime(newValue);
            },
        }
    }
}

</script>