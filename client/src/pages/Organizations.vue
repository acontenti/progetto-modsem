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
        <th>Organization</th>
        <th>Parent organization</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in result" :key="item['org'].value">
        <td>
          <router-link :to="{name: 'organization', params: {id: item['org'].value}}">
            {{ item["orgLabel"].value }}
          </router-link>
        </td>
        <td v-if="!!item['head']">
          <router-link v-if="!!item['head']" :to="{name: 'organization', params: {id: item['head'].value}}">
            {{ item["headLabel"].value }}
          </router-link>
        </td>
        <td v-else>-</td>
      </tr>
      </tbody>
    </q-markup-table>
  </q-page>
</template>

<script lang="ts">
import Queries from "src/components/Queries";
import {defineComponent} from "vue";

export default defineComponent({
  name: "Organizations",
  components: {},

  data() {
    return {
      query: Queries.organizations.query,
      title: Queries.organizations.title,
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
