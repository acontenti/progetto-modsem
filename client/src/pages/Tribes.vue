<template>
  <q-page padding>
    <q-markup-table separator="cell">
      <thead>
      <tr>
        <th colspan="5">
          <div class="text-h6 text-left">{{ title }}</div>
        </th>
      </tr>
      <tr>
        <th>Tribe</th>
        <th>Habitat</th>
        <th>Contacted</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in result" :key="item['tribe'].value">
        <td>
          <router-link :to="{name: 'tribe', params: {id: item['tribe'].value}}">
            {{ item["name"].value }}
          </router-link>
        </td>
        <td>
          <router-link :to="{name: 'habitat', params: {id: item['habitat'].value}}">
            {{ item["habitatLabel"].value }}
          </router-link>
        </td>
        <td v-if="item['contacted'].value === 'true'" class="text-center">
          <q-avatar color="red-10" rounded font-size="15px" text-color="white" size="md">YES</q-avatar>
        </td>
        <td v-else class="text-center">
          <q-avatar color="green-10" rounded font-size="15px" text-color="white" size="md">NO</q-avatar>
        </td>
      </tr>
      </tbody>
    </q-markup-table>
  </q-page>
</template>

<script lang="ts">
import {Queries} from "src/components/Queries";
import {defineComponent} from "vue";

export default defineComponent({
  name: "Tribes",
  data() {
    return {
      query: Queries.tribes.query,
      title: Queries.tribes.title,
      result: {} as unknown
    };
  },
  methods: {
    async fetch() {
      const axiosResponse = await this.$api.get("", {params: {query: this.query}});
      this.result = axiosResponse.data.results.bindings as unknown;
    }
  },
  mounted() {
    void this.fetch();
  }
});
</script>
