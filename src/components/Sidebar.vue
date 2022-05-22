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
                        <div class="collapse" id="guides-collapse">
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
                        <div class="collapse" id="tools-collapse">
                            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                <li><router-link to="/tools/mohist-clairvoyant" class="link-dark rounded">Mohist Clairvoyant</router-link></li>
                                <li><router-link to="/tools/season-points-calculator" class="link-dark rounded">Season Points Calculator</router-link></li>
                            </ul>
                        </div>
                    </li>
                </ul>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>