import { apiList, baseApi } from "../apiHelper";

const getAllLeaveService = async () => {
    const result = await baseApi.get(`${apiList.leave}`);
    return result.data;
  };

  const addNewLeaveService = async (obj) => {
    const result = await baseApi.post(`${apiList.leave}`, obj);
    return result.data;
  };
  
  const updateLeaveService = async (obj) => {
    const result = await baseApi.put(`${apiList.leave}`, obj);
    return result.data;
  };
  
  export const leaveService = {
    getAllLeaveService,
    addNewLeaveService,
    updateLeaveService,
  };