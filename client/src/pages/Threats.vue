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
        <th>Threats</th>
        <th>Threat score</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in result" :key="item['tribe'].value">
        <td>
          <router-link :to="{name: 'tribe', params: {id: item['tribe'].value}}">
            {{ item["name"].value }}
          </router-link>
        </td>
        <td>{{ item["threats"].value }}</td>
        <td class="text-center">
          <q-avatar
            :color="item['threatScore'].value > 0.66 ? 'red-10' : item['threatScore'].value > 0.33 ? 'orange-10' : 'yellow-10'"
            font-size="15px" text-color="white" size="md">
            {{ (+item['threatScore'].value).toFixed(1) }}
          </q-avatar>
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
  name: "Threats",
  data() {
    return {
      query: Queries.threats.query,
      title: Queries.threats.title,
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
