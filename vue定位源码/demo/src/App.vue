<template>
  <div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      routes: []
    }
  },

  created() {
    this.routes = this.$router.options.routes
  },

  methods: {

  },
}
</script>

<style scoped>
 
</style>
