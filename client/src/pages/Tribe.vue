<template>
  <q-page padding>
    <q-card v-if="result">
      <q-card-section horizontal>
        <q-card-section class="text-h6 text-right text-grey-6 q-my-auto q-pr-none">Tribe:</q-card-section>
        <q-card-section>
          <q-card-section horizontal class="text-h6">{{ result.name }}</q-card-section>
          <q-card-section horizontal>{{ $route.params.id }}</q-card-section>
        </q-card-section>
      </q-card-section>
      <q-separator/>
      <q-list>
        <q-item>
          <q-item-section side>Contacted:</q-item-section>
          <q-item-section>
            <q-item-label>{{ result.contacted }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section side>Habitats:</q-item-section>
          <q-item-section>
            <q-item-label v-for="{iri, label} in result.habitat" :key="iri">
              <router-link :to="{name: 'habitat', params: {id: iri}}">
                {{ label }}
              </router-link>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section side>Countries:</q-item-section>
          <q-item-section>
            <q-item-label v-for="{iri, label} in result.country" :key="iri">
              <router-link :to="{name: 'country', params: {id: iri}}">
                {{ label }}
              </router-link>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section side>Threats:</q-item-section>
          <q-item-section>
            <q-item-label>{{ result.threats }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section side>Campaigns:</q-item-section>
          <q-item-section>
            <q-item-label v-for="{iri, label} in result.campaign" :key="iri">
              <router-link :to="{name: 'campaign', params: {id: iri}}">
                {{ label }}
              </router-link>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import {DynQueries} from "src/components/Queries";
import {defineComponent} from "vue";
import {deduplicate, IRIandLabel} from "components/Utils";

type TribeDesc = {
  name: string
  contacted: boolean,
  threats: string,
  habitat: IRIandLabel[],
  country: IRIandLabel[],
  campaign: IRIandLabel[]
}

export default defineComponent({
  name: "Tribes",
  data() {
    return {
      query: DynQueries.tribe(this.$route.params.id as string),
      result: null as TribeDesc | null
    };
  },
  methods: {
    async fetch() {
      const axiosResponse = await this.$api.get("", {params: {query: this.query}});
      const result = axiosResponse.data.results.bindings as Record<string, any>[];
      this.result = {
        name: result[0].name.value,
        contacted: result[0].contacted.value === "true",
        threats: result[0].threats.value,
        habitat: deduplicate(result.map((it) => ({iri: it.habitat.value, label: it.habitatLabel.value})), "iri"),
        country: deduplicate(result.map((it) => ({iri: it.country.value, label: it.countryLabel.value})), "iri"),
        campaign: deduplicate(result.map((it) => ({iri: it.campaign.value, label: it.campaignLabel.value})), "iri")
      }
      console.log(this.result)
    }
  },
  mounted() {
    void this.fetch();
  }
});
</script>
