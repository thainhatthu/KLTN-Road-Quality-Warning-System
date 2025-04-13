import { View, Text, StyleSheet } from 'react-native';

export default function LibraryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>📚 This is the Library screen!</Text>
    </View>
  );
}

export const options = {
  title: 'Library',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
