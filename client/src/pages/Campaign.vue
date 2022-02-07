<template>
  <q-page padding>
    <q-card v-if="result">
      <q-card-section horizontal>
        <q-card-section class="text-h6 text-right text-grey-6 q-my-auto q-pr-none">Organization:</q-card-section>
        <q-card-section>
          <q-card-section horizontal class="text-h6">{{ result.name }}</q-card-section>
          <q-card-section horizontal>{{ $route.params.id }}</q-card-section>
        </q-card-section>
      </q-card-section>
      <q-separator/>
      <q-list>
        <q-item>
          <q-item-section side>Website:</q-item-section>
          <q-item-section>
            <q-item-label>
              <a target="_blank" :href="result.website">{{ result.website }}</a>
            </q-item-label>
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

type CampaignDesc = {
  name: string
  website: string
  tribes: IRIandLabel[]
  organizations: IRIandLabel[]
}

export default defineComponent({
  name: "Campaign",
  components: {},

  data() {
    return {
      query: DynQueries.campaign(this.$route.params.id as string),
      result: null as CampaignDesc | null
    };
  },
  methods: {
    async fetch() {
      const axiosResponse = await this.$api.get("", {params: {query: this.query}});
      const result = axiosResponse.data.results.bindings as Record<string, any>[];
      this.result = {
        name: result[0].name.value,
        website: result[0].website.value,
        tribes: deduplicateBy(result.filter(it => !!it.tribe).map((it) => ({
          iri: it.tribe.value,
          label: it.tribeLabel.value
        })), "iri"),
        organizations: deduplicateBy(result.filter(it => !!it.org).map((it) => ({
          iri: it.org.value,
          label: it.orgLabel.value
        })), "iri")
      }
    }
  },
  mounted() {
    void this.fetch();
  }
});
</script>
