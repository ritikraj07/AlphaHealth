import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { FontAwesome6, Fontisto } from "@expo/vector-icons";

export default function AddDoctorChemistFromExcleModal() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [uploadStatus, setUploadStatus] = useState("idle");

  const openPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ],
        copyToCacheDirectory: true,
      });

      if (result?.type === "cancel") {
        setUploadStatus("idle");
        return;
      }

      setSelectedFile(result);
      setUploadStatus("selected");
    } catch (err) {
      console.log(err);
      setUploadStatus("error");
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    try {
      setUploadStatus("uploading");

      // TODO: Call your RTK mutation here
      // await uploadExcel(selectedFile).unwrap();

      setTimeout(() => {
        setUploadStatus("success");
      }, 2000);
    } catch (error) {
      setUploadStatus("error");
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedFile(null);
    setUploadStatus("idle");
  };

  return (
    <View style={{ marginTop: 0 }}>
      {/* Your Action Button */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => setModalVisible(true)}
      >
        <Fontisto name="doctor" size={24} color="#e3e3e3ff" />
        <Text style={styles.actionLabel}>Add Doctor/Chemist from Excel</Text>
      </TouchableOpacity>

      {/* Modal UI */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.title}>Upload Excel File</Text>

            {/* Status Feedback */}
            {uploadStatus === "idle" && (
              <Text>Select an excel file to continue.</Text>
            )}
            {uploadStatus === "selected" && (
              <Text>Selected: {selectedFile && selectedFile?.assets[0]?.name}</Text>
            )}
            {uploadStatus === "uploading" && <Text>Uploading...</Text>}
            {uploadStatus === "success" && (
              <Text style={{ color: "green" }}>Uploaded successfully!</Text>
            )}
            {uploadStatus === "error" && (
              <Text style={{ color: "red" }}>Something went wrong.</Text>
            )}

            {/* Buttons */}
            {uploadStatus !== "uploading" && uploadStatus !== "success" && (
              <TouchableOpacity style={styles.btnPrimary} onPress={openPicker}>
                <Text style={styles.btnText}>
                  {selectedFile ? "Select Another File" : "Select Excel File"}
                </Text>
              </TouchableOpacity>
            )}

            {/* Upload Button */}
            {selectedFile &&
              uploadStatus !== "uploading" &&
              uploadStatus !== "success" && (
                <TouchableOpacity style={styles.btnUpload} onPress={uploadFile}>
                  <Text style={styles.btnText}>Upload & Process</Text>
                </TouchableOpacity>
              )}

            {/* Loading */}
            {uploadStatus === "uploading" && <ActivityIndicator size="large" />}

            {/* Close Button */}
            <TouchableOpacity style={styles.btnCancel} onPress={closeModal}>
              <Text style={styles.btnCancelText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    backgroundColor: "#e91e62",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actionLabel: { color: "#fff", fontSize: 16 },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    width: "85%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 15 },
  btnPrimary: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  btnUpload: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  btnCancel: { marginTop: 15 },
  btnText: { color: "#fff", fontWeight: "500" },
  btnCancelText: { color: "#333", fontWeight: "500" },
});
