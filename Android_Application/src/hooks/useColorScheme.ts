import { useColorScheme as useNativewindColorScheme } from "nativewind";

export function useColorScheme() {
  const { colorScheme, setColorScheme } = useNativewindColorScheme();

  function toggleColorScheme() {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  }

  return { colorScheme, toggleColorScheme };
}
