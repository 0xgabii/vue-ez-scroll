<template>
  <div class="vScroll" :id="scrollId">

  </div>
</template>

<script>
export default {
  name: 'Scroll',
  props: {
    horizontal: {
      type: Boolean,
      default: true,
    },
    vertical: {
      type: Boolean,
      default: true,
    },
    scrollAtOnce: {
      type: Number,
      default: 100,
    },
  },
  data: () => ({
    id: 0,
  }),
  computed: {
    scrollId() {
      return `scroll-${this.id}`;
    },
  },
  mounted() {
    // eslint-disable-next-line
    this.id = this._uid;
  },
};
</script>
