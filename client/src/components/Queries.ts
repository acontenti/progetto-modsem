const Queries = {
  tribes: {
    page: "tribes",
    title: "Tribes",
    desc: "View tribes and their habitat",
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
    desc: "View countries and their tribes",
    query: `
PREFIX survival: <https://acontenti.github.io/progetto-modsem/survival.ttl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX onto: <http://www.ontotext.com/>

SELECT ?country ?countryLabel ?continentLabel ?tribesCount
FROM onto:disable-sameAs
WHERE {
    ?country rdf:type survival:Country;
             rdfs:label ?countryLabel;
             survival:locatedIn ?continent.
    ?continent rdfs:label ?continentLabel.
    OPTIONAL {
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
    BIND(COALESCE(?count, 0) AS ?tribesCount)
}
`
  },
  campaigns: {
    page: "campaigns",
    title: "Campaigns",
    desc: "View campaigns and their tribes",
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
    desc: "View organizations",
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
    desc: "View tribes and their threats",
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
SELECT ?name ?comment ?contacted ?threats ?habitat ?habitatLabel ?country ?countryLabel ?campaign ?campaignLabel
FROM onto:disable-sameAs
WHERE {
    {
        SELECT ?tribe ?name ?comment ?contacted (GROUP_CONCAT(DISTINCT ?threatLabel;separator=', ') AS ?threats) ?habitat (MAX(?hLabel) AS ?habitatLabel) ?country (MAX(?cLabel) AS ?countryLabel) WHERE {
            BIND(<${id}> AS ?tribe)
            ?tribe survival:name ?name;
                   rdfs:comment ?comment;
                   survival:contacted ?contacted;
                   survival:livesIn ?habitat.
            FILTER(LANG(?comment) = "" || LANGMATCHES(LANG(?comment), "en"))
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
        } GROUP BY ?tribe ?name ?comment ?contacted ?habitat ?country
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

SELECT (MAX(?label) AS ?name) (MAX(?cLabel) AS ?continentLabel) ?habitat (MAX(?hLabel) AS ?habitatLabel) ?tribe ?tribeLabel ?org (MAX(?oLabel) AS ?orgLabel)
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
    OPTIONAL {
        ?org rdf:type survival:Organization;
                 survival:locatedIn ?country;
                 rdfs:label ?oLabel.
        FILTER(LANG(?oLabel) = "" || LANGMATCHES(LANG(?oLabel), "en"))
    }
} GROUP BY ?habitat ?tribe ?tribeLabel ?org
`,
  habitat: (id: string) => `
PREFIX survival: <https://acontenti.github.io/progetto-modsem/survival.ttl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX onto: <http://www.ontotext.com/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT (MAX(?label) AS ?name) ?comment ?type ?country (MAX(?cLabel) AS ?countryLabel) ?tribe ?tribeLabel
FROM onto:disable-sameAs
WHERE {
    BIND(<${id}> AS ?habitat)
    ?habitat rdfs:label ?label;
             rdfs:comment ?comment;
             survival:habitatType ?type.
    FILTER(LANG(?label) = "" || LANGMATCHES(LANG(?label), "en"))
    FILTER(LANG(?comment) = "" || LANGMATCHES(LANG(?comment), "en"))
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
} GROUP BY ?comment ?type ?country ?tribe ?tribeLabel
`,
  organization: (id: string) => `
PREFIX survival: <https://acontenti.github.io/progetto-modsem/survival.ttl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX onto: <http://www.ontotext.com/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT (MAX(?label) AS ?name) ?comment ?website ?email ?country (MAX(?cLabel) AS ?countryLabel) ?campaign ?campaignLabel ?branch (MAX(?bLabel) AS ?branchLabel) ?head (MAX(?hLabel) AS ?headLabel)
FROM onto:disable-sameAs
WHERE {
    BIND(<${id}> AS ?org)
    ?org rdfs:label ?label;
         rdfs:comment ?comment;
         survival:website ?website;
         survival:email ?email.
    FILTER(LANG(?label) = "" || LANGMATCHES(LANG(?label), "en"))
    FILTER(LANG(?comment) = "" || LANGMATCHES(LANG(?comment), "en"))
    OPTIONAL {
        ?org survival:locatedIn ?country.
        ?country rdf:type survival:Country;
                 rdfs:label ?cLabel.
        FILTER(LANG(?cLabel) = "" || LANGMATCHES(LANG(?cLabel), "en"))
    }
    OPTIONAL {
        ?campaign rdf:type survival:Campaign;
                  survival:ledBy ?org;
                  rdfs:label ?campaignLabel.
        FILTER(LANG(?campaignLabel) = "" || LANGMATCHES(LANG(?campaignLabel), "en"))
    }
    OPTIONAL {
        ?branch survival:branchOf ?org;
                rdfs:label ?bLabel.
        FILTER(LANG(?bLabel) = "" || LANGMATCHES(LANG(?bLabel), "en"))
    }
    OPTIONAL {
        ?head survival:hasBranch ?org;
              rdfs:label ?hLabel.
        FILTER(LANG(?hLabel) = "" || LANGMATCHES(LANG(?hLabel), "en"))
    }
} GROUP BY ?comment ?website ?email ?country ?campaign ?campaignLabel ?branch ?head
`,
  campaign: (id: string) => `
PREFIX survival: <https://acontenti.github.io/progetto-modsem/survival.ttl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX onto: <http://www.ontotext.com/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT (MAX(?label) AS ?name) ?comment ?website ?tribe (MAX(?tLabel) AS ?tribeLabel) ?org (MAX(?oLabel) AS ?orgLabel)
FROM onto:disable-sameAs
WHERE {
    BIND(<${id}> AS ?campaign)
    ?campaign rdfs:label ?label;
              rdfs:comment ?comment;
              survival:campaignPage ?website.
    FILTER(LANG(?label) = "" || LANGMATCHES(LANG(?label), "en"))
    FILTER(LANG(?comment) = "" || LANGMATCHES(LANG(?comment), "en"))
    OPTIONAL {
        ?tribe rdf:type survival:Tribe;
               survival:helpedBy ?campaign;
               rdfs:label ?tLabel.
        FILTER(LANG(?tLabel) = "" || LANGMATCHES(LANG(?tLabel), "en"))
    }
    OPTIONAL {
        ?org rdf:type survival:Organization;
             survival:leads ?campaign;
             rdfs:label ?oLabel.
        FILTER(LANG(?oLabel) = "" || LANGMATCHES(LANG(?oLabel), "en"))
    }
} GROUP BY ?website ?comment ?tribe ?org
`
};

export {Queries, DynQueries};
