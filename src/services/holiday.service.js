import { apiList, baseApi } from "../apiHelper";

const getAllHolidayService = async () => {
    const result = await baseApi.get(`${apiList.holiday}`);
    return result.data;
  };

  const addNewHolidayService = async (obj) => {
    const result = await baseApi.post(`${apiList.holiday}`, obj);
    return result.data;
  };
  
  const updateHolidayService = async (obj) => {
    const result = await baseApi.put(`${apiList.holiday}`, obj);
    return result.data;
  };

  const deleteHolidayService=async(id)=>{
    const result =await baseApi.delete(`${apiList.holiday}/${id}`);
    return result.data;
  }

  const findHolidayByDateService=async(obj)=>{
    const result=await baseApi.post(`${apiList.findHolidayByDate}`,obj)
    return result.data;
  }
  
  export const holidayService = {
    getAllHolidayService,
    addNewHolidayService,
    updateHolidayService,
    deleteHolidayService,
    findHolidayByDateService
  };