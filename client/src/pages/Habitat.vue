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
          <q-item-section side>Type:</q-item-section>
          <q-item-section>
            <q-item-label>{{ result.types.join(", ") }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section side>Countries:</q-item-section>
          <q-item-section>
            <q-item-label v-for="{iri, label} in result.countries" :key="iri">
              <router-link :to="{name: 'country', params: {id: iri}}">
                {{ label }}
              </router-link>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section side>Tribes:</q-item-section>
          <q-item-section>
            <q-item-label v-for="{iri, label} in result.tribes" :key="iri">
              <router-link :to="{name: 'tribe', params: {id: iri}}">
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
import {deduplicate, deduplicateBy, IRIandLabel} from "components/Utils";
import {format} from "quasar";
import capitalize = format.capitalize;

type HabitatDesc = {
  name: string
  types: string[],
  countries: IRIandLabel[],
  tribes: IRIandLabel[]
}

export default defineComponent({
  name: "Habitat",
  components: {},

  data() {
    return {
      query: DynQueries.habitat(this.$route.params.id as string),
      result: null as HabitatDesc | null
    };
  },
  methods: {
    async fetch() {
      const axiosResponse = await this.$api.get("", {params: {query: this.query}});
      const result = axiosResponse.data.results.bindings as Record<string, any>[];
      this.result = {
        name: result[0].name.value,
        types: deduplicate(result.map((it) => capitalize(it.type.value as string))),
        countries: deduplicateBy(result.map((it) => ({iri: it.country.value, label: it.countryLabel.value})), "iri"),
        tribes: deduplicateBy(result.map((it) => ({iri: it.tribe.value, label: it.tribeLabel.value})), "iri")
      }
      console.log(this.result)
    }
  },
  mounted() {
    void this.fetch();
  }
});
</script>
