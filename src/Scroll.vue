<template>
  <div 
    class="vScroll" 
    :id="scrollId"
    @wheel="handleScroll">

    {{d}} X {{dd}} X {{scrollEnv.clientHeight}}

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
        @mousedown="dragStart('vertical', $event)"
      />
    </div>

  </div>
</template>

<script>
const defaultOption = {
  // scroll direction
  horizontal: true,
  vertical: true,
  // size of the scrollbar = undefined ? variable : fixed
  barSize: undefined,
  // higher value => faster scrolling
  wheelSpeed: 150,
};

export default {
  name: 'Scroll',
  props: {
    option: {
      type: Object,
      default: () => defaultOption,
    },
  },
  data: () => ({
    id: 0,

    scroll: {
      vertical: 0,
      horizontal: 0,
    },

    d: 0,
    dd: 0,

    drag: {
      vertical: false,
      horizontal: false,
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
    scrollOption() {
      return {
        ...this.option,
        ...defaultOption,
      };
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
        default barsize undefined => visible part * (visible part / scroll part)
      */
      const barSize = {
        h: this.scrollOption.barSize || clientWidth * (clientWidth / scrollWidth),
        v: this.scrollOption.barSize || clientHeight * (clientHeight / scrollHeight),
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
    addDragEventListener() {
      document.addEventListener('mouseup', this.dragEnd);
      document.addEventListener('mousemove', this.dragging);
    },
    removeDragEventListener() {
      document.removeEventListener('mouseup', this.dragEnd);
      document.removeEventListener('mousemove', this.dragging);
    },

    dragStart(direction, e) {
      this.drag[direction] = true;

      this.d = e.pageY;

      this.addDragEventListener();
    },
    dragEnd() {
      const { vertical, horizontal } = this.drag;

      if (vertical) {
        this.drag.vertical = false;
      } else if (horizontal) {
        this.drag.horizontal = false;
      }

      this.removeDragEventListener();
    },
    dragging(e) {
      /* eslint-disable */
      const { vertical, horizontal } = this.drag;

      this.dd = (e.pageY - this.d);

      if (vertical) {
        this.chanegeScroll('vertical', this.dd);
      } else if (horizontal) {
        this.chanegeScroll('horizontal', e.pageX);
      }
    },
    chanegeScroll(direction, newScroll) {
      const { maxScrollWidth, maxScrollHeight } = this.scrollEnv;

      const minScroll = 0;
      const maxScroll = direction === 'horizontal' ? maxScrollWidth : maxScrollHeight;

      if (newScroll <= minScroll) {
        this.scroll[direction] = minScroll;
      } else if (newScroll >= maxScroll) {
        this.scroll[direction] = maxScroll;
      } else {
        this.scroll[direction] = newScroll;
      }
    },
    handleScroll(e) {
      // prevent browser scrollbar move
      e.preventDefault();

      console.log(e);

      const { vertical, horizontal, wheelSpeed } = this.scrollOption;
      const delta = -Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))) * wheelSpeed;

      if (vertical && horizontal) {
        this.chanegeScroll('vertical', delta + this.scroll.vertical);
      } else if (vertical && !horizontal) {
        this.chanegeScroll('vertical', delta);
      } else {
        this.chanegeScroll('horizontal', delta);
      }
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
      this.getComponentDOMInfo();
    });
  },
};
</script>
