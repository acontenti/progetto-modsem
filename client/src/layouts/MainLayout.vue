<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer"/>
        <q-btn flat stretch no-caps to="/">
          <q-toolbar-title>
            Survival International Ontology Explorer
          </q-toolbar-title>
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-list separator padding>
        <q-item clickable v-for="query in menuItems" :to="{name: query.page}" :key="query.page">
          <q-item-section>
            <q-item-label>{{ query.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view/>
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import Queries from "components/Queries";

export default defineComponent({
  name: "MainLayout",
  data() {
    return {
      leftDrawerOpen: false,
      menuItems: [
        {
          page: "home",
          title: "Home"
        },
        ...Object.values(Queries).filter(it => !!it.page)
      ]
    }
  },
  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen
    }
  }
})
</script>
