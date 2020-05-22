<template>
  <div>
    <div>1</div>
    <div>1</div>
    <div>1</div>
    <div>1</div>
    <div class="target">2</div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  async mounted() {
    console.log(this,'this')
    const list = this.$options.__file
    console.log(list,'list')


  },

  methods: {}
};
</script>

<style scoped>
.target {
  background: red;
}
</style>