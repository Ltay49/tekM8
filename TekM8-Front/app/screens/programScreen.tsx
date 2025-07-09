import { FlatList, View, Text, StyleSheet } from "react-native";
import UploadPrograme from "../components/UploadPrograme";

export default function (){


return (
    <FlatList
      data={[]}
      renderItem={() => null}
      ListHeaderComponent={
        <>
          {/* <View style={styles.card}>
            <Text style={styles.title}>Steps</Text>
            <HowToUpload />
          </View> */}

          <View style={styles.card}>
            <Text style={styles.title}>Upload a Document</Text>
            <UploadPrograme />
          </View>
        </>
      }

      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 70,
    backgroundColor: '#0B1A2F', // Dark background
  },
  card: {
    backgroundColor: '#D84343',
    borderRadius:6,
    paddingTop: 10,
    borderWidth: 1,
    // borderColor: '#ffffff33',
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
    marginBottom:40
  },
  title: {
    padding: 10,
    fontSize: 20,
    fontWeight: '700',
    color: 'black',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
});