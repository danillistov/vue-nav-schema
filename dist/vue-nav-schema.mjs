import { computed as t } from "vue";
import { useRouter as c, useRoute as a } from "vue-router";
function v(n = {}) {
  const e = {
    ...n
  };
  e.router ?? c(), e.route ?? a();
  const o = t(() => []), u = t(() => []), i = t(() => []), s = t(() => ({}));
  return {
    schema: o,
    flatSchema: u,
    findItem: (r) => {
    },
    findByPath: (r) => {
    },
    isActive: (r) => !1,
    breadcrumbs: i,
    groupedSchema: s
  };
}
export {
  v as useNavigation
};
