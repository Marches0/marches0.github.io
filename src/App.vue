<template>
  <body>

    <div class="row row-main">
      <div class="col-md-1">
        <Sidebar></Sidebar>
      </div>
      <div class="col-md-11">
        <div class="container-fluid fill">
            
            <div class="row text-start">
                <div class="col-md-10 offset-md-1">
                    <div class="card shadow mb-4">
                        <div class="card-body">
                            <RouterView />
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  <ModalContainer></ModalContainer>
  </body>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import ModalContainer from "./components/ModalContainer.vue"
import Sidebar from '@/components/Sidebar.vue'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap"
</script>

<style>
body {
  min-height: 100vh;
  min-height: -webkit-fill-available;
}

html {
  height: -webkit-fill-available;
}

main {
  display: flex;
  flex-wrap: nowrap;
  height: 100vh;
  height: -webkit-fill-available;
  max-height: 100vh;
  overflow-x: auto;
  overflow-y: hidden;
}

.bi {
  vertical-align: -.125em;
  pointer-events: none;
  fill: currentColor;
}

.dropdown-toggle { outline: 0; }

.nav-flush .nav-link {
  border-radius: 0;
}

.link-active {
    background-color: #d2f4ea !important;
}

.btn-toggle {
  display: inline-flex;
  align-items: center;
  padding: .25rem .5rem;
  font-weight: 600;
  color: rgba(0, 0, 0, .65);
  background-color: transparent;
  border: 0;
}
.btn-toggle:hover,
.btn-toggle:focus {
  color: rgba(0, 0, 0, .85);
  background-color: #d2f4ea;
}

.btn-toggle::before {
  width: 1.25em;
  line-height: 0;
  content: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='rgba%280,0,0,.5%29' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 14l6-6-6-6'/%3e%3c/svg%3e");
  transition: transform .35s ease;
  transform-origin: .5em 50%;
}

.btn-toggle[aria-expanded="true"] {
  color: rgba(0, 0, 0, .85);
}
.btn-toggle[aria-expanded="true"]::before {
  transform: rotate(90deg);
}

.btn-toggle-nav a {
  display: inline-flex;
  padding: .1875rem .5rem;
  margin-top: .125rem;
  margin-left: 1.25rem;
  text-decoration: none;
}
.btn-toggle-nav a:hover,
.btn-toggle-nav a:focus {
  background-color: #d2f4ea;
}

.scrollarea {
  overflow-y: auto;
}

.fw-semibold { font-weight: 600; }
.lh-tight { line-height: 1.25; }

.bd-placeholder-img {
  font-size: 1.125rem;
  text-anchor: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

@media (min-width: 768px) {
  .bd-placeholder-img-lg {
    font-size: 3.5rem;
  }
}

.fill { 
  min-height: 100%;
  height: 100%;
}
html, body {
  height: 100%;
}

.btn-toggle-notreally {
  margin-left: 1.25rem;
}

.btn-toggle-notreally:before {
   content: none
}

.row-main {
  margin-left: 0px;
  margin-right: 0px;
  margin-top: 2rem;
}

.card-body > img {
  margin-bottom: 1rem;
}

button > i.bi {
  margin-right: 0.25rem;
}

a > i.bi {
  margin-right: 0.25rem;
}

.card-body img {
  max-width: 100%;
}
</style>