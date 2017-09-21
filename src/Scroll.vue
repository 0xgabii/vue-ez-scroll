<template>
  <div 
    class="vScroll"
    :id="scrollId"
    :class="isDragging"
    @wheel="handleScroll">

    <div class="vScroll__content" :style="contentStyle">
      <slot />
    </div>

    <div class="vScroll__rail vScroll__rail--horizontal" @mousedown="jumpScroll('horizontal', $event)">
      <div 
        class="vScroll__bar vScroll__bar--horizontal"
        :style="scrollStyle.horizontal"
        @mousedown="dragStart('horizontal', $event)"
      />
    </div>
   
    <div class="vScroll__rail vScroll__rail--vertical" @mousedown="jumpScroll('vertical', $event)">
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

    drag: {
      vertical: false,
      horizontal: false,
      ing: 0,
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

      // Active only if there is space available for scrolling
      const barDisable = {
        h: maxScrollWidth === 0 ? 'none' : 'auto',
        v: maxScrollHeight === 0 ? 'none' : 'auto',
      };

      return {
        horizontal: {
          width: `${barSize.h}px`,
          left: `${barPosition.h}px`,
          opacity: barDisplay.h,
          pointerEvents: barDisable.h,
        },
        vertical: {
          height: `${barSize.v}px`,
          top: `${barPosition.v}px`,
          opacity: barDisplay.v,
          pointerEvents: barDisable.v,
        },
      };
    },

    isDragging() {
      const { vertical, horizontal } = this.drag;
      return (vertical || horizontal) && 'dragging';
    },
  },
  methods: {
    jumpScroll(direction, e) {
      // active only rail
      if (!e.target.className.includes('rail')) return;

      const { left, top } = e.target.getBoundingClientRect();
      const { clientWidth, clientHeight, scrollWidth, scrollHeight } = this.scrollEnv;

      const jump = {
        vertical: e.clientY - top,
        horizontal: e.clientX - left,
      };

      const move = {
        vertical: (jump.vertical / clientHeight) * scrollHeight,
        horizontal: (jump.horizontal / clientWidth) * scrollWidth,
      };

      this.chanegeScroll(direction, move[direction] - this.scroll[direction]);
    },

    addDragEventListener() {
      document.addEventListener('mouseup', this.dragEnd);
      document.addEventListener('mousemove', this.dragging);
      document.body.style.userSelect = 'none';
    },
    removeDragEventListener() {
      document.removeEventListener('mouseup', this.dragEnd);
      document.removeEventListener('mousemove', this.dragging);
      document.body.style.userSelect = 'auto';
    },

    dragStart(direction, e) {
      this.drag[direction] = true;

      this.drag.ing = direction === 'vertical' ? e.pageY : e.pageX;

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
      const { pageX, pageY } = e;
      const { vertical, horizontal, ing } = this.drag;
      const { clientWidth, clientHeight, scrollWidth, scrollHeight } = this.scrollEnv;

      if (vertical) {
        this.chanegeScroll('vertical', ((pageY - ing) / clientHeight) * scrollHeight);
        this.drag.ing = pageY;
      } else if (horizontal) {
        this.chanegeScroll('horizontal', ((pageX - ing) / clientWidth) * scrollWidth);
        this.drag.ing = pageX;
      }
    },
    chanegeScroll(direction, newScroll) {
      const { maxScrollWidth, maxScrollHeight } = this.scrollEnv;

      const minScroll = 0;
      const maxScroll = direction === 'horizontal' ? maxScrollWidth : maxScrollHeight;

      if (this.scroll[direction] + newScroll <= minScroll) {
        this.scroll[direction] = minScroll;
      } else if (this.scroll[direction] + newScroll >= maxScroll) {
        this.scroll[direction] = maxScroll;
      } else {
        this.scroll[direction] += newScroll;
      }
    },
    handleScroll(e) {
      // prevent browser scrollbar move
      e.preventDefault();

      const { vertical, horizontal, wheelSpeed } = this.scrollOption;
      const delta = -Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))) * wheelSpeed;

      if (vertical && horizontal) {
        this.chanegeScroll('vertical', delta);
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

      window.addEventListener('resize', this.getComponentDOMInfo);
      document.getElementById(this.scrollId).addEventListener('DOMSubtreeModified', this.getComponentDOMInfo);
    });
  },
  destroyed() {
    window.removeEventListener('resize', this.getComponentDOMInfo);
  },
};
</script>
