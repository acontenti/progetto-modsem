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
        <th>Campaign</th>
        <th>Campaign page</th>
        <th>Tribes helped</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in result" :key="item['campaign'].value">
        <td>
          <router-link :to="{name: 'campaign', params: {id: item['campaign'].value}}">
            {{ item["campaignName"].value }}
          </router-link>
        </td>
        <td><a target="_blank" :href="item['url'].value">{{ item["url"].value }}</a></td>
        <td>
          {{ item["tribesCount"].value }}
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
  name: "Q3",
  data() {
    return {
      query: Queries.campaigns.query,
      title: Queries.campaigns.title,
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
