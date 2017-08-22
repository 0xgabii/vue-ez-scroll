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

    scrollEnv: {
      scrollWidth: 0,
      scrollHeight: 0,
      clientWidth: 0,
      clientHeight: 0,
      maxScrollWidth: 0,
      maxScrollHeight: 0,
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
    getComponentDOMInfo() {
      const {
        scrollWidth,
        scrollHeight,
        clientWidth,
        clientHeight,
      } = document.getElementById(this.scrollId);

      this.scroll = {
        vertical: 0,
        horizontal: 0,
      };

      this.scrollEnv = {
        scrollWidth,
        scrollHeight,
        clientWidth,
        clientHeight,
        maxScrollWidth: Math.max(0, scrollWidth - clientWidth),
        maxScrollHeight: Math.max(0, scrollHeight - clientHeight),
      };
    },
  },
  mounted() {
    // eslint-disable-next-line
    this.id = this._uid;

    this.$nextTick(() => {
      const component = document.getElementById(this.scrollId);

      component.addEventListener('mousewheel', this.handleScroll);
      component.addEventListener('DOMMouseScroll', this.handleScroll);

      this.getComponentDOMInfo();
    });
  },
};
</script>
