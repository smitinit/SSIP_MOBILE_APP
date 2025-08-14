import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MotiView, MotiText } from "moti";
import {
  CaltrackProvider,
  useCaltrack,
} from "../../../context/caltrack-context";
import { BACKEND_URL } from "../../../src/chat/config";

interface NutritionResponse {
  calories: number;
  foodName: string;
  healthAssessment: string;
  macronutrients: {
    carbohydrates: number;
    fat: number;
    protein: number;
  };
  micronutrients: {
    fiber: number;
    sodium: number;
    sugar: number;
    vitamins: string[];
  };
  suggestions: string[];
}

function NutritionAnalyzer() {
  const {
    userInput,
    setUserInput,
    photo,
    setPhoto,
    loading,
    setLoading,
    responsePoints,
    setResponsePoints,
  } = useCaltrack();

  const [nutritionData, setNutritionData] =
    React.useState<NutritionResponse | null>(null);
  const [hasUploaded, setHasUploaded] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission denied!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
    });
    if (!result.canceled && result.assets?.length) {
      setPhoto(result.assets[0]);
    }
  };

  const analyzeNutrition = async () => {
    if (!photo) {
      alert("Please select an image first");
      return;
    }

    setLoading(true);
    setResponsePoints([]);
    setNutritionData(null);

    try {
      const formData = new FormData();
      formData.append("image", {
        uri: photo.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      } as any);
      if (userInput && userInput.trim()) {
        formData.append("userInput", userInput);
      }
      setHasUploaded(false);
      const response = await fetch(`${BACKEND_URL}/api/analyze-nutrition`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = await response.json();

      if (response.ok) {
        // console.log("result received", result);

        if (result.points) {
          setResponsePoints(result.points);
        }
        if (!result.calories && !result.foodName) {
          setHasUploaded(true);
        }
        if (result.calories || result.foodName) {
          setNutritionData(result as NutritionResponse);
        }
      } else {
        throw new Error(result.error || "Error analyzing nutrition");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 800 }}
      >
        <Text style={styles.title}>Your Nutrition Analyzer</Text>
      </MotiView>

      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "timing", duration: 600, delay: 200 }}
      >
        <TextInput
          style={styles.input}
          placeholder="Enter additional instructions (optional)"
          value={userInput}
          onChangeText={setUserInput}
        />
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateX: -20 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ type: "timing", duration: 600, delay: 400 }}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={pickImage}
          disabled={loading}
        >
          <Text
            style={[
              styles.buttonText,
              loading && styles.pickImagedisabledButton,
            ]}
          >
            {loading
              ? "Can't pick image for now"
              : photo
              ? "Change Image"
              : "Pick an Image"}
          </Text>
        </TouchableOpacity>
      </MotiView>

      {photo && (
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 150 }}
        >
          <Image source={{ uri: photo.uri }} style={styles.image} />
        </MotiView>
      )}

      <MotiView
        from={{ opacity: 0, translateX: 20 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ type: "timing", duration: 600, delay: 600 }}
      >
        <TouchableOpacity
          style={[
            styles.button,
            styles.analyzeButton,
            loading && styles.disabledButton,
          ]}
          onPress={analyzeNutrition}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Analyzing..." : "Analyze Nutrition"}
          </Text>
        </TouchableOpacity>
      </MotiView>

      {loading && (
        <MotiView
          from={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
        >
          <ActivityIndicator
            size="large"
            color="#007AFF"
            style={{ marginTop: 20 }}
          />
        </MotiView>
      )}

      {hasUploaded && (
        <MotiView
          from={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
        >
          <Text style={styles.noDataText}>
            Please Upload a Proper food Image
          </Text>
        </MotiView>
      )}
      {nutritionData && (
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 800, delay: 300 }}
          style={styles.nutritionCard}
        >
          <MotiText
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 500 }}
            style={styles.foodName}
          >
            <MotiText
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 500 }}
              style={styles.foodName}
            >
              {nutritionData.foodName
                ? nutritionData.foodName
                : nutritionData.healthAssessment}
            </MotiText>
          </MotiText>

          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 600 }}
            style={styles.caloriesContainer}
          >
            <Text style={styles.caloriesText}>
              {nutritionData.calories} calories
            </Text>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 700 }}
            style={styles.macroContainer}
          >
            <Text style={styles.sectionTitle}>Macronutrients</Text>
            <View style={styles.macroRow}>
              <Text style={styles.macroText}>
                Protein: {nutritionData.macronutrients.protein}g
              </Text>
              <Text style={styles.macroText}>
                Carbs: {nutritionData.macronutrients.carbohydrates}g
              </Text>
              <Text style={styles.macroText}>
                Fat: {nutritionData.macronutrients.fat}g
              </Text>
            </View>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateX: 20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 800 }}
            style={styles.microContainer}
          >
            <Text style={styles.sectionTitle}>Micronutrients</Text>
            <Text style={styles.microText}>
              Fiber: {nutritionData.micronutrients.fiber}g
            </Text>
            <Text style={styles.microText}>
              Sodium: {nutritionData.micronutrients.sodium}mg
            </Text>
            <Text style={styles.microText}>
              Sugar: {nutritionData.micronutrients.sugar}g
            </Text>
            <Text style={styles.microText}>
              Vitamins:{" "}
              {nutritionData.micronutrients.vitamins?.length
                ? nutritionData.micronutrients.vitamins.join(", ")
                : "N/A"}
            </Text>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 900 }}
            style={styles.assessmentContainer}
          >
            <Text style={styles.sectionTitle}>Health Assessment</Text>
            <Text style={styles.assessmentText}>
              {nutritionData.healthAssessment}
            </Text>
          </MotiView>

          {nutritionData.suggestions &&
            nutritionData.suggestions.length > 0 && (
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 1000 }}
                style={styles.suggestionsContainer}
              >
                <Text style={styles.sectionTitle}>Suggestions</Text>
                {nutritionData.suggestions.map((suggestion, idx) => (
                  <Text key={idx} style={styles.suggestionText}>
                    • {suggestion}
                  </Text>
                ))}
              </MotiView>
            )}
        </MotiView>
      )}

      {responsePoints && responsePoints.length > 0 && !nutritionData && (
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 800, delay: 300 }}
          style={styles.resultContainer}
        >
          {responsePoints.map((point, idx) => (
            <MotiText
              key={idx}
              from={{ opacity: 0, translateX: -10 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: idx * 100 + 400 }}
              style={styles.resultText}
            >
              {point}
            </MotiText>
          ))}
        </MotiView>
      )}
    </ScrollView>
  );
}

export default function Caltrack() {
  return (
    <CaltrackProvider>
      <NutritionAnalyzer />
    </CaltrackProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#2c3e50",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e1e8ed",
    padding: 15,
    marginVertical: 10,
    borderRadius: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: "center",
  },
  analyzeButton: {
    backgroundColor: "#34c759",
  },
  disabledButton: {
    backgroundColor: "#a0a0a0",
  },
  pickImagedisabledButton: {},
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  noDataText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    marginTop: 20,
  },
  image: {
    width: "100%",
    height: 200,
    marginVertical: 15,
    borderRadius: 12,
  },
  nutritionCard: {
    // backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    marginTop: 20,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    // elevation: 4,
  },
  foodName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 15,
  },
  caloriesContainer: {
    backgroundColor: "#e8f5e8",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  caloriesText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#27ae60",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
  },
  macroContainer: {
    marginBottom: 20,
  },
  macroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
  },
  macroText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#34495e",
  },
  microContainer: {
    marginBottom: 20,
  },
  microText: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  assessmentContainer: {
    backgroundColor: "#fff3cd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  assessmentText: {
    fontSize: 14,
    color: "#856404",
    lineHeight: 20,
  },
  suggestionsContainer: {
    backgroundColor: "#e7f3ff",
    borderRadius: 8,
    padding: 15,
  },
  suggestionText: {
    fontSize: 14,
    color: "#0c5aa6",
    marginBottom: 6,
    lineHeight: 18,
  },
  resultContainer: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#2c3e50",
    lineHeight: 22,
  },
});
