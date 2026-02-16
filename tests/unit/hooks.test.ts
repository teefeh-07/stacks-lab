import { renderHook, act } from "@testing-library/react-hooks";
import { useLocalStorage } from "@/hooks/useLocalStorage";

test("returns initial value", () => {
  const { result } = renderHook(() => useLocalStorage("key", "default"));
  expect(result.current[0]).toBe("default");
});

test("updates value", () => {
  const { result } = renderHook(() => useLocalStorage("key", "default"));
  act(() => result.current[1]("new"));
  expect(result.current[0]).toBe("new");
});

