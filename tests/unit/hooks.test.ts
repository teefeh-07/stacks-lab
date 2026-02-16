import { renderHook, act } from "@testing-library/react-hooks";
import { useLocalStorage } from "@/hooks/useLocalStorage";

test("returns initial value", () => {
  const { result } = renderHook(() => useLocalStorage("key", "default"));
  expect(result.current[0]).toBe("default");
});

