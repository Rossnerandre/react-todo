import useSWR from "swr";
import api from "../services/api";

export function useFetchSWR<Data = any>(url: string, params?: object) {    

  const { data, error, isLoading, mutate } = useSWR<Data>(url, (url) =>
    api.get(url, {
      params
    })
  );

  return { data, error, isLoading, mutate };
}
