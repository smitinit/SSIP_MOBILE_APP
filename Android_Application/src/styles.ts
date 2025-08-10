import { StyleSheet } from "react-native";

export const colors = {
  primary: "#2196F3", // Blue
  accent: "#0D47A1", // Dark Blue
  text: "#333333",
  background: "#F5F5F5",
  card: "#FFFFFF",
  orange: "#FF9800",
  yellow: "#FFC107",
  grey: "#E0E0E0",
};

export const typography = StyleSheet.create({
  headlineSmall: {
    color: colors.text,
    fontWeight: "bold",
    fontSize: 24,
  },
  titleLarge: {
    color: colors.text,
    fontWeight: "bold",
    fontSize: 20,
  },
  bodyMedium: {
    color: colors.text,
    fontSize: 16,
  },
});

export const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export const buttonStyles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export const inputStyles = StyleSheet.create({
  input: {
    backgroundColor: colors.grey,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 0,
  },
});
