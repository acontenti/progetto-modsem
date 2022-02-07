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
            <q-item-label>{{ result.contacted ? "yes" : "no" }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section side>Habitats:</q-item-section>
          <q-item-section>
            <template v-if="result.habitats.length">
              <q-item-label v-for="{iri, label} in result.habitats" :key="iri">
                <router-link :to="{name: 'habitat', params: {id: iri}}">
                  {{ label }}
                </router-link>
              </q-item-label>
            </template>
            <q-item-label v-else>-</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section side>Countries:</q-item-section>
          <q-item-section>
            <template v-if="result.countries.length">
              <q-item-label v-for="{iri, label} in result.countries" :key="iri">
                <router-link :to="{name: 'country', params: {id: iri}}">
                  {{ label }}
                </router-link>
              </q-item-label>
            </template>
            <q-item-label v-else>-</q-item-label>
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
            <template v-if="result.campaigns.length">
              <q-item-label v-for="{iri, label} in result.campaigns" :key="iri">
                <router-link :to="{name: 'campaign', params: {id: iri}}">
                  {{ label }}
                </router-link>
              </q-item-label>
            </template>
            <q-item-label v-else>-</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import {DynQueries} from "src/components/Queries";
import {defineComponent} from "vue";
import {deduplicateBy, IRIandLabel} from "components/Utils";

type TribeDesc = {
  name: string
  contacted: boolean,
  threats: string,
  habitats: IRIandLabel[],
  countries: IRIandLabel[],
  campaigns: IRIandLabel[]
}

export default defineComponent({
  name: "Tribe",
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
        habitats: deduplicateBy(result.filter(it => !!it.habitat).map((it) => ({
          iri: it.habitat.value,
          label: it.habitatLabel.value
        })), "iri"),
        countries: deduplicateBy(result.filter(it => !!it.country).map((it) => ({
          iri: it.country.value,
          label: it.countryLabel.value
        })), "iri"),
        campaigns: deduplicateBy(result.filter(it => !!it.campaign).map((it) => ({
          iri: it.campaign.value,
          label: it.campaignLabel.value
        })), "iri")
      }
    }
  },
  mounted() {
    void this.fetch();
  }
});
</script>
