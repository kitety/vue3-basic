<template>
  <div>{{ count }}--{{ double }}</div>
  <button @click="increase">增加</button>
  <div>{{ x }}--{{ y }}</div>
  <div v-if="urlData.loading">还在加载中哦</div>
  <div v-else><img :src="urlData.result.message" alt="" /></div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  reactive,
  toRefs,
  onRenderTriggered,
  watch,
} from "vue";
interface DataProps {
  count: number;
  double: number;
  increase: () => void;
}
import useMousePosition from "./hooks/useMousePosition";
import useURLLoaders from "./hooks/useURLLoaders";
export default defineComponent({
  name: "App",
  // 这个函数只会执行一次
  setup() {
    const titleCount = ref(0);
    const { x, y } = useMousePosition();
    onRenderTriggered((e) => {
      console.log("e: ", e);
    });
    // ref 原始类型
    // reactive object
    const data: DataProps = reactive({
      count: 0,
      increase: () => data.count++,
      double: computed((e) => {
        console.log("data.count: ", e, data.count);
        // document.title = "" + data.count;
        titleCount.value = data.count;
        return data.count * 2;
      }),
    });
    watch([() => data.count], () => {
      document.title = "" + data.count;
    });
    const urlData = useURLLoaders<{
      message: string;
      status: string;
    }>("https://dog.ceo/api/breeds/image/random");
    watch([() => urlData.result], () => {
      if (urlData.result) console.log(urlData.result.message);
    });

    // 失去reactive响应式 普通对象--toRefs
    // {count:data.count}
    // { ...toRefs(data) }

    return { ...toRefs(data), x, y, urlData };

    // const count = ref(0);
    // const double = computed(() => {
    //   return count.value * 2;
    // });
    // const increase = () => {
    //   count.value++;
    // };
    // return { count, increase, double };
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
