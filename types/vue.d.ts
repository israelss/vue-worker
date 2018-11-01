import WWorker from "./index"
declare module "vue/types/vue" {
    interface Vue {
      $worker: WWorker;
    }
  }

