<template>
  <div class="vScroll" :id="scrollId">

    <div class="vScroll__content">
      <slot />
    </div>

    <div class="vScroll__rail vScroll__rail--horizontal">
      <div class="vScroll__bar vScroll__bar--horizontal" />
    </div>
  
    <div class="vScroll__rail vScroll__rail--vertical">
      <div class="vScroll__bar vScroll__bar--vertical" />
    </div>

  </div>
</template>

<script>
export default {
  name: 'Scroll',
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
