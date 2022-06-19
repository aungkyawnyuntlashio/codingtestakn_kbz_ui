import { apiList, baseApi } from "../apiHelper";

const getAllEmployeeService = async () => {
  const result = await baseApi.get(`${apiList.employee}`);
  return result.data;
};

const addNewEmployeeService = async (obj) => {
  const result = await baseApi.post(`${apiList.employee}`, obj);
  return result.data;
};

const updateEmployeeService = async (obj) => {
  const result = await baseApi.put(`${apiList.employee}`, obj);
  return result.data;
};

export const employeeService = {
  getAllEmployeeService,
  addNewEmployeeService,
  updateEmployeeService,
};
