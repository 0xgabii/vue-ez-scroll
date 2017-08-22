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

    scroll: {
      vertical: 0,
      horizontal: 0,
    },
  }),
  computed: {
    scrollId() {
      return `scroll-${this.id}`;
    },
  },
  methods: {
    moveBar() {

    },
    handleScroll(e) {
      const delta = -Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

      this.moveBar(delta);
    },
  },
  mounted() {
    // eslint-disable-next-line
    this.id = this._uid;

    this.$nextTick(() => {
      const component = document.getElementById(this.scrollId);

      component.addEventListener('mousewheel', this.handleScroll);
      component.addEventListener('DOMMouseScroll', this.handleScroll);
    });
  },
};
</script>
