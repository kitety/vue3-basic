import axios from "axios";
import { reactive } from "vue";

interface Data<T> {
  result: T | null;
  loading: boolean;
  loaded: boolean;
  error: null;
}
function useURLLoaders<T>(url: string) {
  const resData = reactive<Data<T>>({
    result: null,
    loading: false,
    loaded: false,
    error: null,
  })
  axios.get(url).then(res => {
    resData.result = res.data
  }).catch(e => {
    resData.error = e
  }).finally(() => {
    resData.loading = false
    resData.loaded = true
  })
  return resData
}
export default useURLLoaders;
