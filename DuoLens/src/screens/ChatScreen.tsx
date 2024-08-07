import {
  AnimatableNumericValue,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { WithLocalSvg } from "react-native-svg/css";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  DuoLensNeutralColors,
  DuoLensPrimaryColors,
} from "../styles/BrandColors";
import { useState } from "react";

export const ChatScreen = ({}) => {
  const navigation = useNavigation();
  const duoOwlAvatar = require("../../assets/duo-owl-waving.svg");
  const [sendPressed, setSendPressed] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          height: 60,
          borderBottomWidth: 0.2,
          borderBottomColor: "#888",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Pressable
          style={{ marginHorizontal: 15 }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={30} color="black" />
        </Pressable>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
          }}
        >
          <WithLocalSvg
            style={{ borderWidth: 0.2, borderRadius: 25, overflow: "hidden" }}
            asset={duoOwlAvatar}
            height={"50"}
            width={"20%"}
          />
          <View
            style={{
              flexDirection: "column",
              marginLeft: 10,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito_600SemiBold",
                fontSize: 20,
              }}
            >
              Duo
            </Text>
            <Text style={{ fontFamily: "Nunito_400Regular", fontSize: 12 }}>
              Language Overlord
            </Text>
          </View>
        </View>
        <Pressable style={{ marginHorizontal: 15 }}>
          <Ionicons name="information-circle-outline" size={30} color="black" />
        </Pressable>
      </View>
      <View
        style={{
          flex: 1,
        }}
      >
        <ScrollView
          contentContainerStyle={{
            flex: 1,
          }}
        >
          <View
            style={{
              backgroundColor: "#ddd",
              maxWidth: "75%",
              borderRadius: "15%" as unknown as AnimatableNumericValue,
              padding: 10,
              marginTop: 10,
              marginLeft: 10,
              justifyContent: "center",
            }}
          >
            <Text>
              Hello, everyone, I am pleased to make your acquaintence for now
              please suck my dilly dilly buck billy.
            </Text>
          </View>
          <View
            style={{
              backgroundColor: DuoLensPrimaryColors.cardinal,
              maxWidth: "75%",
              borderRadius: "15%" as unknown as AnimatableNumericValue,
              padding: 10,
              margin: 10,
              justifyContent: "center",
            }}
          >
            <Text style={{ color: DuoLensNeutralColors.snow }}>
              Hello, everyone, I am pleased to make your acquaintence for now
              please suck my dilly dilly buck billy.
            </Text>
          </View>
        </ScrollView>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          marginTop: 5,
        }}
      >
        <View
          style={{
            height: 35,
            borderColor: "#ccc",
            marginHorizontal: 15,
            borderRadius: 17.5,
            borderWidth: 1,
            paddingHorizontal: 17.5,
            justifyContent: "center",
          }}
        >
          <TextInput
            keyboardType="default"
            placeholder="Write a message"
            style={{ fontSize: 16 }}
          ></TextInput>
          <Pressable
            style={{ position: "absolute", right: 0 }}
            onPressIn={() => {
              setSendPressed(true);
            }}
            onPressOut={() => {
              setSendPressed(false);
            }}
            onPress={() => {}}
          >
            {sendPressed ? (
              <Ionicons
                name="arrow-up-circle-outline"
                size={34}
                color={DuoLensPrimaryColors.cardinal}
                style={{}}
              />
            ) : (
              <Ionicons
                name="arrow-up-circle"
                size={34}
                color={DuoLensPrimaryColors.cardinal}
                style={{}}
              />
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
