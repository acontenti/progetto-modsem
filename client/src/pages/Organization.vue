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
          <q-item-section side>E-mail:</q-item-section>
          <q-item-section>
            <q-item-label>
              <a target="_blank" :href="'mailto:' + result.email">{{ result.email }}</a>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section side>Parent organization:</q-item-section>
          <q-item-section>
            <q-item-label v-if="result.head">
              <router-link :to="{name: 'organization', params: {id: result.head.iri}}">
                {{ result.head.label }}
              </router-link>
            </q-item-label>
            <q-item-label v-else>-</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section side>Branches:</q-item-section>
          <q-item-section>
            <template v-if="result.branches.length">
              <q-item-label v-for="{iri, label} in result.branches" :key="iri">
                <router-link :to="{name: 'organization', params: {id: iri}}">
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

type OrganizationDesc = {
  name: string
  website: string
  email: string
  head: IRIandLabel | null
  branches: IRIandLabel[]
  countries: IRIandLabel[]
  campaigns: IRIandLabel[]
}

export default defineComponent({
  name: "Organization",
  components: {},

  data() {
    return {
      query: DynQueries.organization(this.$route.params.id as string),
      result: null as OrganizationDesc | null
    };
  },
  methods: {
    async fetch() {
      const axiosResponse = await this.$api.get("", {params: {query: this.query}});
      const result = axiosResponse.data.results.bindings as Record<string, any>[];
      this.result = {
        name: result[0].name.value,
        website: result[0].website.value,
        email: result[0].email.value,
        head: result[0].head ? {iri: result[0].head.value, label: result[0].headLabel.value} : null,
        branches: deduplicateBy(result.filter(it => !!it.branch).map((it) => ({
          iri: it.branch.value,
          label: it.branchLabel.value
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
