<template>
  <div class="body">
    <slot name="body"></slot>
  </div>
</template>

<script>
export default {
  data: function() {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
.body {
  width: 100%;
  height: 10%;
  top: 10%;
  left: 0%;
  background: rgb(105, 109, 170);
  position: absolute; /* 位置指定の基準点にする */
  z-index: 4;
}
</style>
