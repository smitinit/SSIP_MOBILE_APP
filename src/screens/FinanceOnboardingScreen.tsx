import { useState } from "react";
import { ScrollView, StyleSheet, View, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { NHeader } from "@/ui/header";
import { NInput } from "@/ui/input";
import { NButton } from "@/ui/button";
import { NCard } from "@/ui/card";
import { NCheckbox } from "@/ui/checkbox";
import { palette, spacing } from "@/design/tokens";
import { typography, inputStyles } from "../styles";

export default function FinanceOnboardingScreen() {
  const router = useRouter();
  const [incomeSources, setIncomeSources] = useState({
    "Fixed Salary": false,
    "Freelance Income": false,
    "Passive Income (rent, dividends)": false,
    Other: false,
  });
  const [otherIncome, setOtherIncome] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [expenses, setExpenses] = useState({
    "EMIs / Loans": false,
    Rent: false,
    "Utility Bills": false,
    Subscriptions: false,
    Insurance: false,
    Others: false,
  });
  const [otherExpenses, setOtherExpenses] = useState("");
  const [financialGoals, setFinancialGoals] = useState({
    "Build an Emergency Fund": false,
    "Save for a Big Purchase": false,
    "Start Investing": false,
    "Pay Off Debts": false,
    "Plan for Retirement": false,
    Other: false,
  });
  const [otherGoals, setOtherGoals] = useState("");
  const [budgets, setBudgets] = useState({
    food: "",
    travel: "",
    shopping: "",
    entertainment: "",
    misc: "",
  });
  const [paymentModes, setPaymentModes] = useState({
    UPI: false,
    "Debit/Credit Card": false,
    Cash: false,
    "Mobile Wallets": false,
    Other: false,
  });

  const toggleIncomeSource = (key: keyof typeof incomeSources) =>
    setIncomeSources((s) => ({ ...s, [key]: !s[key] }));
  const toggleExpense = (key: keyof typeof expenses) =>
    setExpenses((s) => ({ ...s, [key]: !s[key] }));
  const toggleGoal = (key: keyof typeof financialGoals) =>
    setFinancialGoals((s) => ({ ...s, [key]: !s[key] }));
  const togglePaymentMode = (key: keyof typeof paymentModes) =>
    setPaymentModes((s) => ({ ...s, [key]: !s[key] }));

  const onFinish = () => router.replace("/");

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <NHeader
        title="Finance setup"
        subtitle="Budgets and payment preferences"
      />
      <NCard style={{ gap: spacing.md }}>
        <TextInput
          style={styles.sectionTitle}
          value="Income Structure"
          editable={false}
        />
        <View style={styles.section}>
          {Object.keys(incomeSources).map((key) => (
            <NCheckbox
              key={key}
              label={key}
              value={incomeSources[key as keyof typeof incomeSources]}
              onChange={() =>
                toggleIncomeSource(key as keyof typeof incomeSources)
              }
            />
          ))}
          <TextInput
            value={otherIncome}
            placeholder="Other Income Source"
            style={styles.input}
            onChangeText={setOtherIncome}
          />
          <NInput
            label="Average Total Monthly Income"
            keyboardType="numeric"
            value={monthlyIncome}
            onChangeText={setMonthlyIncome}
          />
        </View>

        <TextInput
          style={styles.sectionTitle}
          value="Fixed Expenses"
          editable={false}
        />
        <View style={styles.section}>
          {Object.keys(expenses).map((key) => (
            <NCheckbox
              key={key}
              label={key}
              value={expenses[key as keyof typeof expenses]}
              onChange={() => toggleExpense(key as keyof typeof expenses)}
            />
          ))}
          <TextInput
            value={otherExpenses}
            placeholder="Other Expenses"
            style={styles.input}
            onChangeText={setOtherExpenses}
          />
        </View>

        <TextInput
          style={styles.sectionTitle}
          value="Financial Goals"
          editable={false}
        />
        <View style={styles.section}>
          {Object.keys(financialGoals).map((key) => (
            <NCheckbox
              key={key}
              label={key}
              value={financialGoals[key as keyof typeof financialGoals]}
              onChange={() => toggleGoal(key as keyof typeof financialGoals)}
            />
          ))}
          <TextInput
            value={otherGoals}
            placeholder="Other Financial Goal"
            style={styles.input}
            onChangeText={setOtherGoals}
          />
        </View>

        <TextInput
          style={styles.sectionTitle}
          value="Budgeting"
          editable={false}
        />
        <View style={styles.section}>
          <NInput
            label="Food & Groceries Budget"
            keyboardType="numeric"
            value={budgets.food}
            onChangeText={(v) => setBudgets((s) => ({ ...s, food: v }))}
          />
          <NInput
            label="Travel Budget"
            keyboardType="numeric"
            value={budgets.travel}
            onChangeText={(v) => setBudgets((s) => ({ ...s, travel: v }))}
          />
          <NInput
            label="Shopping Budget"
            keyboardType="numeric"
            value={budgets.shopping}
            onChangeText={(v) => setBudgets((s) => ({ ...s, shopping: v }))}
          />
          <NInput
            label="Entertainment Budget"
            keyboardType="numeric"
            value={budgets.entertainment}
            onChangeText={(v) =>
              setBudgets((s) => ({ ...s, entertainment: v }))
            }
          />
          <NInput
            label="Miscellaneous Budget"
            keyboardType="numeric"
            value={budgets.misc}
            onChangeText={(v) => setBudgets((s) => ({ ...s, misc: v }))}
          />
        </View>

        <TextInput
          style={styles.sectionTitle}
          value="Payment Preferences"
          editable={false}
        />
        <View style={{ gap: spacing.sm }}>
          {Object.keys(paymentModes).map((key) => (
            <NCheckbox
              key={key}
              label={key}
              value={paymentModes[key as keyof typeof paymentModes]}
              onChange={() =>
                togglePaymentMode(key as keyof typeof paymentModes)
              }
            />
          ))}
        </View>

        <NButton title="Finish" fullWidth onPress={onFinish} />
      </NCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { padding: spacing.xl, backgroundColor: palette.bg },
  section: { gap: spacing.md },
  sectionTitle: {
    ...typography.titleLarge,
    marginTop: 16,
    marginBottom: 8,
    padding: 8,
    backgroundColor: "#f0f0f0",
  },
  input: { ...inputStyles.input, width: "100%", marginBottom: 16 },
});
