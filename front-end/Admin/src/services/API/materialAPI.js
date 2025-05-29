import { update } from "lodash";
import axios from "src/services";

const materialAPI = {
  getMaterials: (params) => {
    const url = "/materials";
    return axios.get(url, { params });
  },
  update: (id, params) => {
    const url = "/materials" + "/" + id;
    return axios.put(url, params);
  },
  delete: (id) => {
    const url = "/materials" + "/" + id;
    return axios.delete(url);
  },
};

export default materialAPI;
