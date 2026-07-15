import React from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  IProduct,
} from "../shared/store/api/productApi";


const ProductScreen = () => {
  const navigation = useNavigation<any>();

  const {
    data: products,
    isLoading,
    isFetching,
    refetch,
  } = useGetProductsQuery();
  


  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = (id: string) => {
    Alert.alert("Delete Product", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteProduct(id);
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: IProduct }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("ProductDetailScreen", { product: item })
      }
    >
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            {/* <Text style={styles.placeholderText}>No Image</Text> */}
            <Image
              style={styles.image}
              source={require("../shared/images/icon.png")}
            />
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{item.product_name}</Text>
        <Text style={styles.brand}>{item.brand}</Text>
        <Text style={styles.price}>MRP: ₹{item.mrp}</Text>
        <Text style={styles.stock}>Stock: {item.quantity}</Text>
      </View>

      {/* <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => handleDelete(item._id)}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity> */}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome6 name="truck-medical" size={24} color="white" />
        <Text style={styles.title}>Products</Text>
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>No Products Found</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddProductScreen")}
      >
        <Text style={styles.addText}>+ Add Product</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    // padding: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    margin:10
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingLeft: 25,
    backgroundColor: "#e91e62",
    paddingVertical: 15,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    marginRight: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  placeholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 10,
    color: "#555",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  brand: {
    fontSize: 13,
    color: "#777",
  },
  price: {
    fontSize: 14,
    marginTop: 4,
  },
  stock: {
    fontSize: 13,
    color: "green",
  },
  deleteBtn: {
    paddingHorizontal: 10,
  },
  deleteText: {
    color: "red",
    fontWeight: "bold",
  },
  addButton: {
    position: "absolute",
    bottom: 50,
    right: 50,
    left: 50,
    backgroundColor: "#2e86de",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 5,
  },
  addText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
 
});