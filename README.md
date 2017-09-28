# vue-ez-scroll

Customizable scrolling wrapper component for Vue

## Install

```bash
# via npm
npm install vue-ez-scroll --save
# or just take away to your project
https://github.com/gomonk3037/vue-ez-scroll/blob/master/src/Scroll.vue
```

## How To Use
```html
<template>
  <div>

    <scroll class="scrolling" :option="scrollOption">
      <!-- Drop your contents  -->
    </scroll>

  </div>
</template>

<script>
import Scroll from 'vue-ez-scroll';

export default {
  data: () => ({
    scrollOption: {
      wheelSpeed: 100,
    },
  }),
  components: { 
    Scroll,
  },
};
</script>

# import default scrollbar style
<style src="vue-ez-scroll/style.css" />
# for visualize scroll - required
<style>
.scrolling {
  /*
    vertical scroll => need 'max-height'
    horizontal scroll => need 'max-width'
  */
  max-height: 30rem;
}
</style>
```

## Props

### option (Object) 
```javascript
const default = {
  // scroll direction
  horizontal: true,
  vertical: true,
  // higher value => faster scrolling
  wheelSpeed: 150,
  // rail margin
  railMargin: 0,
};
```

## Customize scrollbar appearance!

> Example written in scss <br> if you wanna css - https://github.com/gomonk3037/vue-ez-scroll/tree/master/dist/style.css

### change background-color & border-radius
```scss
.vScroll {

  &__bar {
    background-color: pink;
    border-radius: 0;
  }
}
```

### change content transition
```scss
.vScroll {

  &__content {
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
}
```

## Thank you!
If you have a feature you'd like to add, feel free to leave it in the issue.<br>
I'll give you an answer within three days at the latest.