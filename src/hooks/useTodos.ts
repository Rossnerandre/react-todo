import useSWR from "swr";
import api from "../services/api";

export function useTodos<Data = any>(key: string, params?: object) {
  const { data, error, isLoading, mutate } = useSWR<Data>(key, () =>
    api.get("todos", {
      params,
    })
  );

  return { data, error, isLoading, mutate };
}
