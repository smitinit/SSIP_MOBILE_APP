import { PropsWithChildren, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { Ionicons } from '@expo/vector-icons';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ThemedView>
      <TouchableOpacity style={styles.heading} onPress={() => setIsOpen((value) => !value)} activeOpacity={0.8}>
        <Ionicons
          name={isOpen ? 'chevron-down' : 'chevron-forward-outline'}
          size={18}
          color="gray"
        />
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && <View style={styles.content}>{children}</View>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
