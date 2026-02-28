import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { IProduct } from "../shared/store/api/productApi";

const ProductDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const product: IProduct = route.params.product;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* IMAGE SECTION */}
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={{ color: "#777" }}>No Image</Text>
          </View>
        )}

        {/* BASIC INFO */}
        <View style={styles.section}>
          <Text style={styles.name}>{product.product_name}</Text>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.category}>{product.category}</Text>
        </View>

        {/* STOCK BADGE */}
        <View style={styles.stockContainer}>
          <Text
            style={[
              styles.stockBadge,
              {
                backgroundColor:
                  product.quantity > 20
                    ? "#2ecc71"
                    : product.quantity > 0
                      ? "#f39c12"
                      : "#e74c3c",
              },
            ]}
          >
            Stock: {product.quantity}
          </Text>
        </View>

        {/* PRICING SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing</Text>

          <View style={styles.row}>
            <Text>MRP</Text>
            <Text>₹ {product.mrp}</Text>
          </View>

          <View style={styles.row}>
            <Text>PTR</Text>
            <Text>₹ {product.ptr}</Text>
          </View>

          <View style={styles.row}>
            <Text>PTS</Text>
            <Text>₹ {product.pts}</Text>
          </View>

          <View style={styles.row}>
            <Text>Retailer Margin</Text>
            <Text>₹ {product.retailerMargin ?? 0}</Text>
          </View>

          <View style={styles.row}>
            <Text>Stockist Margin</Text>
            <Text>₹ {product.stockistMargin ?? 0}</Text>
          </View>
        </View>

        {/* PACK & COMPOSITION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Info</Text>

          <View style={styles.row}>
            <Text>Pack Size</Text>
            <Text>{product.packSize}</Text>
          </View>

          <View style={styles.row}>
            <Text>Composition</Text>
            <Text>{product.composition}</Text>
          </View>
        </View>

        {/* DESCRIPTION */}
        {product.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
        ) : null}
      </ScrollView>

      {/* EDIT BUTTON */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("EditProductScreen", { product })}
      >
        <Text style={styles.editText}>✏️ Edit Product</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
  image: {
    width: "100%",
    height: 220,
  },
  imagePlaceholder: {
    width: "100%",
    height: 220,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 12,
    padding: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  brand: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  category: {
    fontSize: 13,
    color: "#999",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  stockContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  stockBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    color: "#fff",
    fontWeight: "600",
  },
  description: {
    color: "#555",
    lineHeight: 20,
  },
  editButton: {
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
  editText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign:"center"
  },
});