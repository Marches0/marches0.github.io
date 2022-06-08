<template>
    <div class="sticky-top">
        <h5 class="" style="margin-left: 2rem;">Made with 💜 by Marches</h5>
        <div class="row">
            <div class="col-md-11 offset-md-2">
                <ul class="list-unstyled">
                    <li class="mb-1 ">
                        <router-link to="/" class="link-dark rounded btn btn-toggle btn-toggle-notreally link-dark rounded" role="button">
                            <i class="bi bi-house-heart"></i>Home
                        </router-link>
                    </li>
                    <li class="mb-1 ">
                        <router-link to="/tips" class="link-dark rounded btn btn-toggle btn-toggle-notreally link-dark rounded" role="button">
                            <i class="bi bi-patch-question"></i>Tips
                        </router-link>
                    </li>
                    <li class="mb-1">
                        <button id="guides-btn" class="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#guides-collapse">
                            <i class="bi bi-book"></i>Guides
                        </button>
                        <div class="collapse" id="guides-collapse" :class="{show: startedOnGuides}">
                            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                <li><router-link to="/guides/curiosity" class="link-dark rounded">Curiosity</router-link></li>
                                <li><router-link to="/guides/beat-a-player" class="link-dark rounded">Powering to beat another player</router-link></li>
                                <li><router-link to="/guides/red-burr-location" class="link-dark rounded">Where do Red Burrs appear?</router-link></li>
                            </ul>
                        </div>
                    </li>
                    <li class="mb-1">
                        <button id="tools-btn" class="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#tools-collapse">
                            <i class="bi bi-wrench"></i>Tools
                        </button>
                        <div class="collapse" id="tools-collapse" :class="{show: startedOnTools}">
                            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                <li><router-link to="/tools/event-calendar" class="link-dark rounded">Event Calendar</router-link></li>
                                <li><router-link to="/tools/minister-soul-calculator" class="link-dark rounded">Minister Soul Calculator</router-link></li>
                                <li><router-link to="/tools/mohist-clairvoyant" class="link-dark rounded">Mohist Clairvoyant</router-link></li>
                                <li><router-link to="/tools/season-points-calculator" class="link-dark rounded">Season Points Calculator</router-link></li>
                                <li><router-link to="/tools/talent-calculator" class="link-dark rounded">Talent Calculator</router-link></li>
                            </ul>
                        </div>
                    </li>
                    <li class="mb-1">
                        <UpdateHistoryNavItem></UpdateHistoryNavItem>
                    </li>
                </ul>

            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { RouterLink } from 'vue-router'
import UpdateHistoryNavItem from "./UpdateHistory/UpdateHistoryNavItem.vue"

export default {
    components: { RouterLink, UpdateHistoryNavItem },
    data(){
        return {
            startedOnTools: false,
            startedOnGuides: false
        }
    },
    mounted() {
        // ['#', 'tools', 'minister-soul-calculator']
        let pathSegments = window.location.hash.split("/");
        if (pathSegments && pathSegments.length > 2){
            let directory = pathSegments[1];

            if (directory === "tools"){
                (this as any).startedOnTools = true;
            }
            else if (directory === "guides"){
                (this as any).startedOnGuides = true;
            }
        }
    }
}
</script>