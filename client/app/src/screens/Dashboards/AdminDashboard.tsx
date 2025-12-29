import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { JSX, useState } from 'react'
import { Octicons, Feather, EvilIcons, FontAwesome6, AntDesign } from "@expo/vector-icons";
import AddEmployeeModal from "../Modals/AddEmployeeModal";
import { useCreateEmployeeMutation } from "../../shared/store/api/employeeApi";
import { useSelector } from "react-redux";
import MedicineBottleLoader from "../../shared/componets/MedicineBottleLoader";

type Props = {
  title: string;
  numberOfEmployees: number;
  subtitle: string;
  iconFrom: string;
  icon: any;
};

/**
 * A component that displays an employee's information in a card format.
 * @param {Props} emp - an object containing the title, number, subtitle, iconFrom, and icon for the employee.
 * @returns {JSX.Element} - a JSX element representing the employee's information in a card format.
 */
const EmployeeBox = (emp: Props, ): JSX.Element=>{
    const Icon = () => {
        if (emp.iconFrom === "Feather") {
          return <Feather name={emp.icon} size={24} color="black" />;
        } else if (emp.iconFrom === "EvilIcons") {
          return <EvilIcons name={emp.icon} size={24} color="black" />;
        } else if (emp.iconFrom === "FontAwesome6") {
          return <FontAwesome6 name={emp.icon} size={24} color="black" />;
        } else if (emp.iconFrom === "AntDesign") {
          return <AntDesign name={emp.icon} size={24} color="black" />;
        }
    }
    return (
      <View style={styles.statItem}>
        <View style={styles.statIcon}>
          <Text style={styles.statMainText}>{emp.title}</Text>
          <Icon />
        </View>
        <Text style={styles.statNumber}>{emp.numberOfEmployees}</Text>
        <Text style={styles.statSubText}>{emp.subtitle}</Text>
      </View>
    );
}

/**
 * Admin dashboard screen
 * This screen displays statistics about employees, doctors, and system usage, and provides quick actions for administrative tasks.
 * @returns {JSX.Element} - a JSX element representing the admin dashboard screen.
 */
export default function AdminDashboard(): JSX.Element {
  
  
  const [isAddEmployeeModalVisible, setIsAddEmployeeModalVisible] = useState(false);
  const [TotalEmployee, setTotlalEmployee] = useState<number>(6);
  const [TotalDoctors, setTotalDoctors] = useState<number>(4);
  const [TotalChemists, setTotalChemists] = useState<number>(5);
  const [TotalHospitals, setTotalHospitals] = useState<number>(3);
  const [TotalManager, setTotalManager] = useState<number>(5);
  const [TotalHR, setTotalHR] = useState<number>(1);
  const [createEmployee, isLoading] = useCreateEmployeeMutation();

 
    // Redux store
    const admin = useSelector((state: any) => state.admin);
  // console.log(" Admin: from admin dashboard ==> ", admin );

  // Function to open the add employee modal
  
/**
 * Handle the submission of a new employee
 * @param {any} employeeData - Object containing the new employee's information
 * @returns {void}
 */
   const handleAddEmployee = (employeeData: any): void => {
     console.log("New employee:", employeeData);
     // Add n API call to save the employee later when ReduxRTK is implemented
  
     createEmployee({
       name: employeeData.name,
       email: employeeData.email,
       password: employeeData.password,
       role: employeeData.role,
       hq: employeeData.hq,
       manager: admin._id,
       managerModel: "Admin",
     });
     Alert.alert("Success", "Employee added successfully!");
     setIsAddEmployeeModalVisible(false);
   };

    const employee = [
        {title: "Total Employee", number: TotalEmployee, subtitle: "All system users", iconFrom: "Feather", icon: "users"},
        {title: "Managers", number: TotalManager, subtitle: "Management level", iconFrom: "AntDesign", icon: "profile"},
        {title: "HR Staff", number: TotalHR, subtitle: "Human resources", iconFrom: "Feather", icon: "users"},
    ]
  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      
      <AddEmployeeModal
        visible={isAddEmployeeModalVisible}
        onClose={() => setIsAddEmployeeModalVisible(false)}
        onAddEmployee={handleAddEmployee}
      />

      <ScrollView style={styles.container}>
        {/* Header Section - EXACT MATCH */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Admin Panel</Text>
            <View style={styles.adminAccessContainer}>
              <Text style={styles.adminAccessText}>ADMIN ACCESS</Text>
            </View>
          </View>
          <Text style={styles.headerSubtitle}>
            Manage employees, doctors, and system settings
          </Text>
        </View>

        {/* First Row Stats - EXACT MATCH */}
        <View style={styles.statsSection}>
          {employee.map((emp, index) => (
            <EmployeeBox
              key={index}
              title={emp.title}
              numberOfEmployees={emp.number}
              subtitle={emp.subtitle}
              iconFrom={emp.iconFrom}
              icon={emp.icon}
            />
          ))}
        </View>

        {/* Second Row Stats - EXACT MATCH */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Text style={styles.statMainText}>Doctors</Text>
              <Feather name="database" size={24} color="black" />
            </View>
            <Text style={styles.statSubText}>Doctors: {TotalDoctors}</Text>
            <Text style={styles.statSubText}>Chemists: {TotalChemists}</Text>
            {/* Record of which thing */}
            <Text style={styles.statSubText}>Records: 0</Text>
          </View>

          <View style={styles.statDivider} />
        </View>

        {/* HQ Distribution Section - EXACT MATCH */}
        <View style={styles.section}>
          <Text style={styles.sectionMainTitle}>HQ Distribution</Text>
          <Text style={styles.sectionSubTitle}>
            Employee distribution across headquarters
          </Text>

          <View style={styles.distributionContainer}>
            <View style={styles.distributionRow}>
              <Text style={styles.hqName}>North HQ</Text>
              <Text style={styles.hqCount}>4 employees</Text>
              <Text style={styles.hqPercent}>67%</Text>
            </View>
            <View style={styles.distributionRow}>
              <Text style={styles.hqName}>South HQ</Text>
              <Text style={styles.hqCount}>1 employees</Text>
              <Text style={styles.hqPercent}>17%</Text>
            </View>
            <View style={styles.distributionRow}>
              <Text style={styles.hqName}>East HQ</Text>
              <Text style={styles.hqCount}>1 employees</Text>
              <Text style={styles.hqPercent}>17%</Text>
            </View>
            <View style={styles.distributionRow}>
              <Text style={styles.hqName}>West HQ</Text>
              <Text style={styles.hqCount}>0 employees</Text>
              <Text style={styles.hqPercent}>0%</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions Section - EXACT MATCH */}
        <View style={styles.section}>
          <Text style={styles.sectionMainTitle}>Quick Actions</Text>
          <Text style={styles.sectionSubTitle}>Administrative tasks</Text>

          <View style={styles.actionsContainer}>
            <View style={styles.actionRow}>
              <TouchableOpacity
                onPress={() => setIsAddEmployeeModalVisible(true)}
                style={styles.actionButton}
              >
                <Octicons name="person-add" size={24} color="#e91e62" />
                <Text style={styles.actionButtonText}>Add Employee</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="database" size={24} color="#e91e62" />
                <Text style={styles.actionButtonText}>System Reports</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="users" size={24} color="#e91e62" />
                <Text style={styles.actionButtonText}>Manage Doctors</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <AntDesign name="profile" size={24} color="#e91e62" />
                <Text style={styles.actionButtonText}>HQ Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,

    
  },
  headerContent:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  header: {
    paddingTop: 10,
    paddingBottom: 16,
    marginBottom: 16,
  },
  statIcon:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom:30
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666ff',
    marginBottom: 12,
  },
  adminAccessContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#e91e62',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  adminAccessText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    
  },
  statsSection: {
    
    backgroundColor: '#ffffff',
    flexWrap: 'nowrap',
  },
  statItem: {
    flex: 1,
    padding: 16,
    borderWidth:0.5,
    marginVertical: 8,
    borderRadius: 8,

    
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e5e5e5',
  },
  statMainText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  statSubText: {
    fontSize: 12,
    color: '#666666',
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    marginTop: 16,
    borderRadius: 8,
    marginBottom: 40,
  },
  sectionMainTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  sectionSubTitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  distributionContainer: {
    gap: 0,
  },
  distributionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  hqName: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
  },
  hqCount: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  hqPercent: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
    textAlign: 'right',
    fontWeight: '500',
  },
  actionsContainer: {
    gap: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'grey',
  },
  actionButtonText: {
    color: '#000000ff',
    fontSize: 14,
    fontWeight: '600',
  },
})