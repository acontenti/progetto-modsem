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
        <th>Country</th>
        <th>Continent</th>
        <th>Tribes living</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in result" :key="item['country'].value">
        <td>
          <router-link :to="{name: 'country', params: {id: item['country'].value}}">
            {{ item["countryLabel"].value }}
          </router-link>
        </td>
        <td>{{ item["continentLabel"].value }}</td>
        <td>{{ item["count"].value }}</td>
      </tr>
      </tbody>
    </q-markup-table>
  </q-page>
</template>

<script lang="ts">
import Queries from "src/components/Queries";
import {defineComponent} from "vue";

export default defineComponent({
  name: "Countries",
  data() {
    return {
      query: Queries.countries.query,
      title: Queries.countries.title,
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
