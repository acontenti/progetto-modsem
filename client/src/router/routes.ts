import {RouteRecordRaw} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {path: "", redirect: {name: "home"}},
      {path: "home", name: "home", component: () => import("pages/Index.vue")},
      {path: "tribes", name: "tribes", component: () => import("pages/Tribes.vue")},
      {path: "countries", name: "countries", component: () => import("pages/Countries.vue")},
      {path: "campaigns", name: "campaigns", component: () => import("pages/Campaigns.vue")},
      {path: "threats", name: "threats", component: () => import("pages/Threats.vue")},
      {path: "organizations", name: "organizations", component: () => import("pages/Organizations.vue")},
      {path: "tribe/:id", name: "tribe", component: () => import("pages/Tribe.vue")},
      {path: "campaign/:id", name: "campaign", component: () => import("pages/Campaign.vue")},
      {path: "country/:id", name: "country", component: () => import("pages/Country.vue")},
      {path: "habitat/:id", name: "habitat", component: () => import("pages/Habitat.vue")},
      {path: "organization/:id", name: "organization", component: () => import("pages/Organization.vue")}
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
