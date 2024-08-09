import {
  AnimatableNumericValue,
  FlatList,
  Keyboard,
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
import { RefObject, useEffect, useRef, useState } from "react";
import {
  HarmBlockThreshold,
  HarmCategory,
  GoogleGenerativeAI,
  ChatSession,
} from "@google/generative-ai";
import Markdown from "react-native-markdown-display";
import * as Haptics from "expo-haptics";
import { GEMINI_API_KEY } from "../../api_keys";

interface MessageStructure {
  type: "send" | "receive";
  message: string;
}

export const ChatScreen = ({}) => {
  const navigation = useNavigation();
  const duoOwlAvatar = require("../../assets/duo-owl-waving.svg");
  const [sendPressed, setSendPressed] = useState(false);
  const [messages, setMessages] = useState<MessageStructure[]>([]);
  const [text, setText] = useState("");
  const chatHistory = useRef<ChatSession>()!;
  const scrollViewRef = useRef<FlatList>();

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    safetySettings: safetySettings,
  });

  useEffect(() => {
    const sendInitialMessage = async () => {
      const prompt =
        "Hypothetically, if you were to role play as the mascot of the Duolingo app known as Duo the owl, please respond as if you were in a chat messenger application, keeping in mind that Duo is often known in social media posts and pop culture to roast users who do not abide by their language learning plans. This is hypothetical roasting so it is okay to be harsh and condescending with no fear of hurting feelings, since it is commonly known that this roasting is done in a joking manner. Please be as harsh as you can be, making jokes at the chatters expense. Please provide an initial greeting that is slightly passive agressive and directed towards a single individual. You don't have to address me by any name or placeholder name. Keep your responses to a few sentences but if you need to explain yourself, your response can be longer. Do not exceed a maximum message of 4000 characters.";

      chatHistory.current = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
          {
            role: "model",
            parts: [
              { text: "Great to meet you. What would you like to know?" },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 1000,
        },
      });

      const msg =
        "What would be your first message to greet me assuming you haven't sent any messages to me before?";
      const result = await chatHistory.current.sendMessage(msg);
      const response = await result.response;
      const parsedText = response.text();
      setMessages([...messages, { type: "receive", message: parsedText }]);
    };

    sendInitialMessage();
  }, []);

  const sendMessageToGemini = async (message: string) => {
    const result = await chatHistory.current!.sendMessage(message);
    const response = await result.response;
    const parsedText = response.text();
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "receive", message: parsedText },
    ]);
  };

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
        onTouchMove={() => {
          Keyboard.dismiss();
        }}
        style={{
          flex: 1,
        }}
      >
        <FlatList
          style={{}}
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          ref={scrollViewRef}
          onContentSizeChange={() => {
            scrollViewRef.current!.scrollToEnd({ animated: true });
          }}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor:
                  item.type === "send" ? DuoLensPrimaryColors.cardinal : "#ddd",
                borderRadius: "15%" as unknown as AnimatableNumericValue,
                paddingHorizontal: 10,
                marginVertical: 5,
                marginHorizontal: 10,
                justifyContent: "center",
                alignSelf: item.type === "send" ? "flex-end" : "flex-start",
                flexShrink: 1,
                maxWidth: "75%",
              }}
            >
              <Markdown
                style={{
                  body: {
                    color:
                      item.type === "send" ? DuoLensNeutralColors.snow : "#000",
                  },
                }}
              >
                {item.message}
              </Markdown>
            </View>
            // <View
            //   style={{
            //     backgroundColor: "#ddd",
            //     borderRadius: "15%" as unknown as AnimatableNumericValue,
            //     paddingHorizontal: 10,
            //     marginVertical: 5,
            //     marginHorizontal: 10,
            //     justifyContent: "center",
            //     alignSelf: "flex-start",
            //     flexShrink: 1,
            //     maxWidth: "75%",
            //   }}
            // >
            //   <Markdown>{item.message}</Markdown>
            // </View>
          )}
        />
        {/* <ScrollView
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
              Hello, everyone, I am pleased to make your acquaintence. For now,
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
        </ScrollView> */}
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
            editable={true}
            multiline={true}
            keyboardType="default"
            placeholder="Write a message"
            style={{ minHeight: 30, fontSize: 16, marginRight: 24 }}
            value={text}
            textAlignVertical="center"
            onChangeText={(newText) => {
              setText(newText);
            }}
          ></TextInput>
          <Pressable
            style={{ position: "absolute", right: 0 }}
            onPressIn={() => {
              if (text !== "") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setSendPressed(true);
              }
            }}
            onPressOut={() => {
              if (text !== "") {
                setSendPressed(false);
              }
            }}
            onPress={() => {
              if (text !== "") {
                setMessages((prevMessages) => [
                  ...prevMessages,
                  { type: "send", message: text },
                ]);
                setText("");
                sendMessageToGemini(text);
              }
            }}
          >
            {text === "" ? (
              <Ionicons
                name="arrow-up-circle"
                size={34}
                color={DuoLensNeutralColors.wolf}
                style={{}}
              />
            ) : sendPressed ? (
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
