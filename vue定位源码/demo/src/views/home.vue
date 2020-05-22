<template>
  <div>
    <list></list>
  </div>
</template>
<script>
import list from "../components/list.vue";
export default {
  components: {
    list
  },
  data() {
    return {};
  },

  async mounted() {
    const res = this.$route;
    console.log(res, "res");

    const filePath = this.$route.matched[0].components.default.__file
    console.log(filePath,'filePath')
  },

  methods: {}
};
</script>

<style scoped>
</style>