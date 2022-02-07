<template>
  <q-page padding>
    <q-card v-if="result">
      <q-card-section horizontal>
        <q-card-section class="text-h6 text-right text-grey-6 q-my-auto q-pr-none">Country:</q-card-section>
        <q-card-section>
          <q-card-section horizontal class="text-h6">{{ result.name }}</q-card-section>
          <q-card-section horizontal>{{ $route.params.id }}</q-card-section>
        </q-card-section>
      </q-card-section>
      <q-separator/>
      <q-list>
        <q-item>
          <q-item-section side>Continent:</q-item-section>
          <q-item-section>
            <q-item-label>{{ result.continent }}</q-item-label>
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
          <q-item-section side>Tribes:</q-item-section>
          <q-item-section>
            <template v-if="result.tribes.length">
              <q-item-label v-for="{iri, label} in result.tribes" :key="iri">
                <router-link :to="{name: 'tribe', params: {id: iri}}">
                  {{ label }}
                </router-link>
              </q-item-label>
            </template>
            <q-item-label v-else>-</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section side>Organizations:</q-item-section>
          <q-item-section>
            <template v-if="result.organizations.length">
              <q-item-label v-for="{iri, label} in result.organizations" :key="iri">
                <router-link :to="{name: 'organization', params: {id: iri}}">
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
  continent: boolean,
  habitats: IRIandLabel[]
  tribes: IRIandLabel[]
  organizations: IRIandLabel[]
}

export default defineComponent({
  name: "Country",
  components: {},

  data() {
    return {
      query: DynQueries.country(this.$route.params.id as string),
      result: null as TribeDesc | null
    };
  },
  methods: {
    async fetch() {
      const axiosResponse = await this.$api.get("", {params: {query: this.query}});
      const result = axiosResponse.data.results.bindings as Record<string, any>[];
      this.result = {
        name: result[0].name.value,
        continent: result[0].continentLabel.value,
        habitats: deduplicateBy(result.filter(it => !!it.habitat).map((it) => ({
          iri: it.habitat.value,
          label: it.habitatLabel.value
        })), "iri"),
        tribes: deduplicateBy(result.filter(it => !!it.tribe).map((it) => ({
          iri: it.tribe.value,
          label: it.tribeLabel.value
        })), "iri"),
        organizations: deduplicateBy(result.filter(it => !!it.org).map((it) => ({
          iri: it.org.value,
          label: it.orgLabel.value
        })), "iri")
      }
      console.log(this.result)
    }
  },
  mounted() {
    void this.fetch();
  }
});
</script>
