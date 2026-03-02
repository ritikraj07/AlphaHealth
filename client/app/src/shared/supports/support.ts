import { Linking, Alert } from "react-native";
import { SUPPORT_EMAIL } from "./mails";

const serverSupport = async () => {
  const email =  SUPPORT_EMAIL;

  const subject = encodeURIComponent("Server is not connecting");
  const body = encodeURIComponent(
    `Hi Team,
    The Pharma Prime app is not connecting to the server.

    Time: ${new Date().toLocaleString()}
    Please check the server.

    Thanks`,
  );

  const url = `mailto:${email}?subject=${subject}&body=${body}`;

  const supported = await Linking.canOpenURL(url);

  if (supported) {
    await Linking.openURL(url);
  } else {
    Alert.alert("No Email App Found");
  }
};

export { serverSupport };