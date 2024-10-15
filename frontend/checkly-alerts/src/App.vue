<template>
  <div id="app">
    <ChecklyAlerts />
  </div>
</template>

<script>
import ChecklyAlerts from './components/ChecklyAlerts.vue'

export default {
  name: 'App',
  components: {
    ChecklyAlerts
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
