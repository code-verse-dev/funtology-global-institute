import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { NONPROFIT_BASE_URL } from "@/constants/api";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: NONPROFIT_BASE_URL,
  credentials: "include",
});

const nonprofitBaseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401 || result?.error?.status === "FETCH_ERROR" || result?.error?.status === 403) {
    localStorage.removeItem("user");
    api.dispatch({ type: "/user/logout" });

    if (window.location.hostname.includes("customdev.solutions")) {
      window.location.href = "/funtology-global-institute/login";
    } else {
      window.location.href = "/login";
    }
  }

  return result;
};

export default nonprofitBaseQueryWithReauth;
