const Queries = {
  tribes: {
    page: "tribes",
    title: "Tribes",
    query: `
PREFIX survival: <https://acontenti.github.io/progetto-modsem/survival.ttl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX onto: <http://www.ontotext.com/>

SELECT ?tribe ?name ?contacted ?habitat (MAX(?hLabel) as ?habitatLabel)
FROM onto:disable-sameAs
WHERE {
    ?tribe rdf:type survival:Tribe;
           survival:name ?name;
           survival:contacted ?contacted;
           survival:livesIn ?habitat.
    ?habitat rdfs:label ?hLabel.
    FILTER(LANG(?hLabel) = "" || LANGMATCHES(LANG(?hLabel), "en"))
}
GROUP BY ?tribe ?name ?contacted ?habitat
ORDER BY ?name
`
  },
  countries: {
    page: "countries",
    title: "Countries",
    query: `
PREFIX survival: <https://acontenti.github.io/progetto-modsem/survival.ttl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX onto: <http://www.ontotext.com/>

SELECT ?country ?countryLabel ?continent ?continentLabel ?count
FROM onto:disable-sameAs
WHERE {
    ?country rdf:type survival:Country;
             rdfs:label ?countryLabel;
             survival:locatedIn ?continent.
    ?continent rdfs:label ?continentLabel.
    {
        SELECT ?country (COUNT(?tribe) as ?count)
        WHERE {
            ?tribe rdf:type survival:Tribe;
                   survival:livesIn ?habitat.
            ?habitat rdf:type survival:Habitat;
                     survival:locatedIn ?country.
        } GROUP BY ?country
    }
    FILTER(LANG(?countryLabel) = "" || LANGMATCHES(LANG(?countryLabel), "en"))
    FILTER(LANG(?continentLabel) = "" || LANGMATCHES(LANG(?continentLabel), "en"))
}
`
  },
  campaigns: {
    page: "campaigns",
    title: "Campaigns",
    query: `
PREFIX survival: <https://acontenti.github.io/progetto-modsem/survival.ttl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX onto: <http://www.ontotext.com/>

SELECT ?campaign ?campaignName ?url (COUNT(?tribe) AS ?tribesCount)
FROM onto:disable-sameAs
WHERE {
    ?campaign rdf:type survival:Campaign;
              rdfs:label ?campaignName;
              survival:campaignPage ?url;
              survival:helps ?tribe.
    FILTER(LANG(?campaignName) = "" || LANGMATCHES(LANG(?campaignName), "en"))
}
GROUP BY ?campaign ?campaignName ?url
ORDER BY ?campaignName
`
  },
  organizations: {
    page: "organizations",
    title: "Organizations",
    query: `
PREFIX survival: <https://acontenti.github.io/progetto-modsem/survival.ttl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX onto: <http://www.ontotext.com/>

SELECT ?org (MAX(?label) as ?orgLabel) ?head (MAX(?hLabel) as ?headLabel)
FROM onto:disable-sameAs
WHERE {
    ?org rdf:type survival:Organization;
         rdfs:label ?label.
    OPTIONAL {
        ?org survival:branchOf ?head.
        ?head rdfs:label ?hLabel.
        FILTER(LANG(?hLabel) = "" || LANGMATCHES(LANG(?hLabel), "en"))
    }
    FILTER(LANG(?label) = "" || LANGMATCHES(LANG(?label), "en"))
}
GROUP BY ?org ?head
ORDER BY ?orgLabel
`
  },
  threats: {
    page: "threats",
    title: "Tribes threats",
    query: `
PREFIX survival: <https://acontenti.github.io/progetto-modsem/survival.ttl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX onto: <http://www.ontotext.com/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?tribe ?name ?threats (?count/?max AS ?threatScore)
FROM onto:disable-sameAs
WHERE {
    {
        SELECT (MAX(?count) AS ?max)
        WHERE {
            SELECT ?tribe (COUNT(?threat) as ?count)
            WHERE {
                ?tribe survival:threatenedBy ?threat.
            }
            GROUP BY ?tribe
        }
    }
    {
        SELECT ?tribe ?name (COUNT(?threat) as ?count) (GROUP_CONCAT(?threatLabel;separator=', ') AS ?threats)
        WHERE {
            ?tribe rdf:type survival:Tribe;
                   survival:name ?name;
                   survival:threatenedBy ?threat.
            ?threat rdfs:label ?threatLabel.
            FILTER(LANG(?threatLabel) = "" || LANGMATCHES(LANG(?threatLabel), "en"))
        }
        GROUP BY ?tribe ?name
    }
}
`
  }
};

const DynQueries = {
  tribe: (id: string) => `
PREFIX survival: <https://acontenti.github.io/progetto-modsem/survival.ttl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX onto: <http://www.ontotext.com/>

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?name ?contacted ?threats ?habitat ?habitatLabel ?country ?countryLabel ?campaign ?campaignLabel
FROM onto:disable-sameAs
WHERE {
    {
        SELECT ?tribe ?name ?contacted (GROUP_CONCAT(DISTINCT ?threatLabel;separator=', ') AS ?threats) ?habitat (MAX(?hLabel) AS ?habitatLabel) ?country (MAX(?cLabel) AS ?countryLabel) WHERE {
            BIND(<${id}> AS ?tribe)
            ?tribe survival:name ?name;
                   survival:contacted ?contacted;
                   survival:livesIn ?habitat.
            OPTIONAL {
                ?tribe survival:threatenedBy ?threat.
                ?threat rdfs:label ?threatLabel.
                FILTER(LANG(?threatLabel) = "" || LANGMATCHES(LANG(?threatLabel), "en"))
            }
            OPTIONAL {
                ?tribe survival:livesIn ?habitat.
                ?habitat rdfs:label ?hLabel.
                FILTER(LANG(?hLabel) = "" || LANGMATCHES(LANG(?hLabel), "en"))
            }
            OPTIONAL {
                ?habitat survival:locatedIn ?country.
                ?country rdf:type survival:Country;
                         rdfs:label ?cLabel.
                FILTER(LANG(?cLabel) = "" || LANGMATCHES(LANG(?cLabel), "en"))
            }
        } GROUP BY ?tribe ?name ?contacted ?habitat ?country
    }
    OPTIONAL {
        ?tribe survival:helpedBy ?campaign.
        ?campaign rdfs:label ?campaignLabel.
        FILTER(LANG(?campaignLabel) = "" || LANGMATCHES(LANG(?campaignLabel), "en"))
    }
}
`,
  country: (id: string) => `
PREFIX survival: <https://acontenti.github.io/progetto-modsem/survival.ttl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX onto: <http://www.ontotext.com/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT (MAX(?label) AS ?name) (MAX(?cLabel) AS ?continentLabel) ?habitat (MAX(?hLabel) AS ?habitatLabel) ?tribe ?tribeLabel
FROM onto:disable-sameAs
WHERE {
    BIND(<${id}> AS ?country)
    ?country rdfs:label ?label.
    FILTER(LANG(?label) = "" || LANGMATCHES(LANG(?label), "en"))
    ?country survival:locatedIn ?continent.
    ?continent rdfs:label ?cLabel.
    FILTER(LANG(?cLabel) = "" || LANGMATCHES(LANG(?cLabel), "en"))
    OPTIONAL {
        ?habitat rdf:type survival:Habitat;
                 survival:locatedIn ?country;
                 rdfs:label ?hLabel.
        FILTER(LANG(?hLabel) = "" || LANGMATCHES(LANG(?hLabel), "en"))
        OPTIONAL {
            ?tribe rdf:type survival:Tribe;
                   survival:livesIn ?habitat;
                   survival:name ?tribeLabel.
        }
    }
} GROUP BY ?habitat ?tribe ?tribeLabel
`,
  habitat: (id: string) => `
PREFIX survival: <https://acontenti.github.io/progetto-modsem/survival.ttl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX onto: <http://www.ontotext.com/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT (MAX(?label) AS ?name) ?type ?country (MAX(?cLabel) AS ?countryLabel) ?tribe ?tribeLabel
FROM onto:disable-sameAs
WHERE {
    BIND(<${id}> AS ?habitat)
    ?habitat rdfs:label ?label;
             survival:habitatType ?type.
    FILTER(LANG(?label) = "" || LANGMATCHES(LANG(?label), "en"))
    OPTIONAL {
        ?habitat survival:locatedIn ?country.
        ?country rdf:type survival:Country;
                 rdfs:label ?cLabel.
        FILTER(LANG(?cLabel) = "" || LANGMATCHES(LANG(?cLabel), "en"))
    }
    OPTIONAL {
        ?tribe rdf:type survival:Tribe;
               survival:livesIn ?habitat;
               survival:name ?tribeLabel.
    }
} GROUP BY ?type ?country ?tribe ?tribeLabel
`
};

export {Queries, DynQueries};
