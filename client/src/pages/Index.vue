<template>
  <q-page class="row items-center justify-evenly">
    <q-card class="q-pa-lg">
      <q-card-section>
        <div class="text-h5">Welcome to the Survival International Ontology Explorer!</div>
        <div class="text-center text-subtitle2 q-pt-sm">Made by Alessandro Contenti</div>
      </q-card-section>
      <q-card-section class="flex column no-wrap q-py-none">
        <q-btn class="q-my-xs q-mx-auto" color="primary" outline :key="item.page" v-for="item in pages" :to="{name: item.page}">{{ item.desc }}</q-btn>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {Queries} from "components/Queries";

export default defineComponent({
  name: "Index",
  data() {
    return {
      pages: Queries
    };
  }
});
</script>
