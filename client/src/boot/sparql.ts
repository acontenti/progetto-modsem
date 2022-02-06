import {boot} from "quasar/wrappers"
import SparqlClient from "sparql-http-client"

const endpointUrl = "http://localhost:7200/repositories/survival";
const sparqlClient = new SparqlClient({endpointUrl});

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $sparql: typeof sparqlClient.query;
  }
}
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({app}) => {
  app.config.globalProperties.$sparql = sparqlClient.query;
})

export {sparqlClient}
