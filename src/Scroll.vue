<template>
  <div class="vScroll" :id="scrollId">

    <div class="vScroll__content" :style="contentStyle">
      <slot />
    </div>

    <div class="vScroll__rail vScroll__rail--horizontal">
      <div 
        class="vScroll__bar vScroll__bar--horizontal"
        :style="scrollStyle.horizontal"
      />
    </div>
  
    <div class="vScroll__rail vScroll__rail--vertical">
      <div 
        class="vScroll__bar vScroll__bar--vertical"
        :style="scrollStyle.vertical"
      />
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

    scrollPercent() {
      const { horizontal, vertical } = this.scroll;
      const { maxScrollWidth, maxScrollHeight } = this.scrollEnv;

      return {
        horizontal: (horizontal / maxScrollWidth) * 100,
        vertical: (vertical / maxScrollHeight) * 100,
      };
    },

    contentStyle() {
      const { horizontal, vertical } = this.scroll;

      return {
        transform: `translate(${-horizontal}px, ${-vertical}px)`,
      };
    },
    scrollStyle() {
      const {
        horizontal: hScrollPercent,
        vertical: vScrollPercent,
      } = this.scrollPercent;
      const {
        clientWidth,
        clientHeight,
        scrollWidth,
        scrollHeight,
        maxScrollWidth,
        maxScrollHeight,
      } = this.scrollEnv;
      /*
        Exact size of the scrollbar
        visible part * (visible part / scroll part)
      */
      const barSize = {
        h: clientWidth * (clientWidth / scrollWidth),
        v: clientHeight * (clientHeight / scrollHeight),
      };
      /*
        Exact position of the scrollbar
        (visible part - scrollbar size) * (scrolling percentage / 100)
      */
      const barPosition = {
        h: (clientWidth - barSize.h) * (hScrollPercent / 100),
        v: (clientHeight - barSize.v) * (vScrollPercent / 100),
      };

      // Shows only if there is space available for scrolling
      const barDisplay = {
        h: maxScrollWidth === 0 ? 0 : 1,
        v: maxScrollHeight === 0 ? 0 : 1,
      };

      return {
        horizontal: {
          width: `${barSize.h}px`,
          left: `${barPosition.h}px`,
          opacity: barDisplay.h,
        },
        vertical: {
          height: `${barSize.v}px`,
          top: `${barPosition.v}px`,
          opacity: barDisplay.v,
        },
      };
    },
  },
  methods: {
    chanegeScroll(direction, newScroll) {
      const { maxScrollWidth, maxScrollHeight } = this.scrollEnv;

      const minScroll = 0;
      const maxScroll = direction === 'horizontal' ? maxScrollWidth : maxScrollHeight;

      const currentScroll = this.scroll[direction];

      if (currentScroll + newScroll <= minScroll) {
        this.scroll[direction] = minScroll;
      } else if (currentScroll + newScroll >= maxScroll) {
        this.scroll[direction] = maxScroll;
      } else {
        this.scroll[direction] += newScroll;
      }
    },
    handleScroll(e) {
      const delta = -Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

      this.chanegeScroll('horizontal', delta);
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
