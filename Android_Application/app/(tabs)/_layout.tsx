import React, { useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import { Provider as PaperProvider, Portal } from "react-native-paper";
import { ModalContext } from "../../context/modal-provider";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

import BottomBarClassic from "@/components/BottomBarClassic";
import Dialog from "@/components/QuickActionDialog";
import HomeScreen from "@/screens/HomeScreen";
import ChatBotScreen from "@/screens/ChatBotScreen";
import NotificationsScreen from "@/screens/NotificationsScreen";
import SettingsScreen from "@/screens/SettingsScreen";

export default function SwipeableTabsLayout() {
  const { isSignedIn } = useAuth();
  const layout = useWindowDimensions();
  const [isDialogVisible, setDialogVisible] = useState(false);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "home", title: "Home", icon: "grid-outline" },
    { key: "chat", title: "Chat", icon: "chatbubble-outline" },
    {
      key: "notifications",
      title: "Notifications",
      icon: "notifications-outline",
    },
    { key: "settings", title: "Settings", icon: "cog-outline" },
  ]);

  const renderScene = SceneMap({
    home: HomeScreen,
    chat: ChatBotScreen,
    notifications: NotificationsScreen,
    settings: SettingsScreen,
  });

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <PaperProvider>
      <ModalContext.Provider
        value={{
          open: () => setDialogVisible(true),
          close: () => setDialogVisible(false),
        }}
      >
        <View style={{ flex: 1 }}>
          {/* Swipeable content */}
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            swipeEnabled
            renderTabBar={() => null}
          />

          {/* Custom bottom bar */}
          <BottomBarClassic
            state={{ index, routes }}
            navigation={{
              navigate: (tabKey) => {
                const idx = routes.findIndex((r) => r.key === tabKey);
                if (idx !== -1) setIndex(idx);
              },
            }}
          />
        </View>

        {/* Portal for modals */}
        <Portal>
          <Dialog
            visible={isDialogVisible}
            onClose={() => setDialogVisible(false)}
          />
        </Portal>
      </ModalContext.Provider>
    </PaperProvider>
  );
}
