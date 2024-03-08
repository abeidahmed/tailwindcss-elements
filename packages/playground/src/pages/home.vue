<script setup lang="ts">
import { PropType, defineComponent } from 'vue';
import { RouteRecordNormalized, useRouter } from 'vue-router';

const Examples = defineComponent({
  props: {
    routes: {
      type: Object as PropType<RouteRecordNormalized[]>,
      required: true,
    },
  },
  setup:
    (props, { slots }) =>
    () =>
      slots.default?.({ normalizedRoutes: props.routes, slots }),
});

const router = useRouter();
const routes = router
  .getRoutes()
  .filter((example) => example.path !== '/')
  .filter((route) => route.meta.isRoot);
</script>

<template>
  <div class="prose">
    <h2>Examples</h2>
    <Examples v-slot="{ normalizedRoutes, slots }" :routes="routes">
      <ul>
        <li v-for="{ children, meta, path } in normalizedRoutes" :key="path">
          <template v-if="children.length > 0">
            <h3 class="text-lg">{{ meta.name }}</h3>
            <component :is="vnode" v-for="vnode in slots.default({ normalizedRoutes: children, slots })" :key="vnode" />
          </template>
          <template v-else>
            <router-link :key="path" :to="path">
              {{ meta.name }}
            </router-link>
          </template>
        </li>
      </ul>
    </Examples>
  </div>
</template>
