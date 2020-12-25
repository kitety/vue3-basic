<template>
  <div>
    <Suspense>
      <!-- Promise all  可以放多个组件 -->
      <template #default><async-show /></template>
      <template #fallback><h1>loading111</h1></template>
    </Suspense>
    <div>{{ count }}--{{ double }}</div>
    <button @click="increase">增加</button>
    <div>{{ x }}--{{ y }}</div>
    <div v-if="urlData.loading">还在加载中哦</div>
    <div v-if="urlData.loaded"><img :src="urlData.result[0].url" alt="" /></div>
    <hello-world msg="12"></hello-world>
  </div>
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
  onErrorCaptured,
} from "vue";
interface DataProps {
  count: number;
  double: number;
  increase: () => void;
}
interface DogApi {
  message: string;
  status: string;
}
interface CatApi {
  breeds: [];
  id: string;
  url: string;
  width: number;
  height: number;
}
import useMousePosition from "./hooks/useMousePosition";
import useURLLoaders from "./hooks/useURLLoaders";
import HelloWorld from "./components/HelloWorld.vue";
import AsyncShow from "./components/AsyncShow.vue";
export default defineComponent({
  name: "App",
  components: { HelloWorld, AsyncShow },
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
    const urlData = useURLLoaders<CatApi[]>(
      "https://api.thecatapi.com/v1/images/search"
    );
    // const urlData = useURLLoaders<DogApi>(
    //   "https://dog.ceo/api/breeds/image/random"
    // );
    onErrorCaptured((e) => {
      console.log("e: ", e);
    });
    watch([() => urlData.result], () => {
      console.log(urlData.result?.[0].url);
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
