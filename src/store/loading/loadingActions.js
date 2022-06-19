export const SET_LOADING = "SET_LOADING";

export const setLoadingSuccess = (isLoading) => ({
  type: SET_LOADING,
  payLoad: { isLoading },
});

export function setLoading(isLoading) {
  return (dispatch) => {
    dispatch(setLoadingSuccess(isLoading));
  };
}
