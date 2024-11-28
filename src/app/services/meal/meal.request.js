import SysFetch from "../../fetch";
import qs from "qs";

const MealRequest = {
  getScriptGroupCodeList: (partnerCode) => {
    return SysFetch.get(
      `meal-groups/scriptGroupCode?partnerCode=${partnerCode}`
    );
  },
  deleteMealGroup: (id) => {
    return SysFetch.delete(`meal-groups/${id}`);
  },
  createMealTag: (name) => {
    return SysFetch.post("meal-tags", {
      name,
    });
  },
  createMealGroup: (name) => {
    return SysFetch.post("meal-groups", {
      name,
    });
  },
  getMealTags: () => {
    return SysFetch.get("meal-tags");
  },
  getMealGroup: () => {
    return SysFetch.get("meal-groups");
  },
  delete: (id) => {
    return SysFetch.delete(`meals/${id}`);
  },
  edit: (id, body) => {
    return SysFetch.put(`meal-packages/${id}`, body);
  },
  create: (body) => {
    return SysFetch.post(`meal-packages`, body);
  },
  restore: (id) => {
    return SysFetch.post(`meal-packages/${id}/restore`);
  },
  block: (id, body) => {
    return SysFetch.post(`meal-packages/${id}/block`, body);
  },
  getMeals: (body) => {
    return SysFetch.get(
      `meals?${qs.stringify(body, { encode: false })}`
    );
  },
  upload: (file) => {
    return SysFetch.post("meal-packages/upload",file);
  },

  getMealById: (id) => SysFetch.get(`meal-packages/${id}`),
  getPaymentActivities: (id, body) =>
    SysFetch.get(
      `payment-activity/${id}?${qs.stringify(body, {
        encode: false,
      })}`
    ),
};

export default MealRequest;
