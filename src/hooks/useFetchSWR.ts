import useSWR from "swr";
import api from "../services/api";

export function useFetchSWR<Data = any>(url: string) {  
  const { data, error, isLoading, mutate } = useSWR<Data>(url, (url) =>
    api.get(url)
  );

  return { data, error, isLoading, mutate };
}
