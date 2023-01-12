export default function useLocalStorage() {
  const setItems = (items: { key: string; value: string }[]) => {
    items.map((item) => {
      localStorage.setItem(item.key, item.value);
    });
    return;
  };

  const getItems = (items: string[]) => {
    const gitems = items.map((item) => {
      return localStorage.getItem(item);
    });
    return gitems;
  };

  return { getItems, setItems };
}
