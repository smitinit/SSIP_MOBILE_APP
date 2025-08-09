import { Tabs, Redirect } from "expo-router";
import { TabBarIcon } from "@/components/TabBarIcon";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "@clerk/clerk-expo";
import BottomBarClassic from "@/components/BottomBarClassic";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const { isSignedIn } = useAuth();

  // Define colors based on colorScheme
  const tabBarActiveTintColor = colorScheme === "dark" ? "#fff" : "#222";
  const tabBarInactiveTintColor = colorScheme === "dark" ? "#888" : "#aaa";
  const tabBarStyle = {
    backgroundColor: colorScheme === "dark" ? "#18181b" : "#fff",
  };

  // Hide tabs until authenticated
  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs
      tabBar={(props) => <BottomBarClassic {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor,
        tabBarInactiveTintColor,
        tabBarStyle,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="grid" color={color} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Analytics",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "view-dashboard" : "view-dashboard-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "bell" : "bell-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "cog" : "cog-outline"} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
