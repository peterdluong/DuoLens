import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  AnimatableNumericValue,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WithLocalSvg } from "react-native-svg/css";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import Markdown from "react-native-markdown-display";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  HarmBlockThreshold,
  HarmCategory,
  GoogleGenerativeAI,
  ChatSession,
  Content,
  GenerationConfig,
} from "@google/generative-ai";
import {
  DuoLensNeutralColors,
  DuoLensPrimaryColors,
} from "../styles/BrandColors";
import { GEMINI_API_KEY } from "../../api_keys";
import { BottomButton } from "../components/BottomButton";

interface MessageStructure {
  type: "send" | "receive";
  message: string;
}

type TtsModeType = "disabled" | "manual" | "auto";

export const ChatScreen = ({}) => {
  const navigation = useNavigation();
  const duoOwlAvatar = require("../../assets/duo-owl-waving.svg");
  const [sendPressed, setSendPressed] = useState(false);
  const [messages, setMessages] = useState<MessageStructure[]>([]);
  const [typedText, setTypedText] = useState("");
  const [voiceOption, setVoiceOption] = useState<Speech.Voice>();
  const [ttsMode, setTtsMode] = useState<TtsModeType>("disabled");
  const chatHistory = useRef<ChatSession>()!;
  const scrollViewRef = useRef<FlatList>();
  const actionSheetRef = useRef<ActionSheetRef>(null);

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
          parts: [{ text: "Great to meet you. What would you like to know?" }],
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
    setMessages([{ type: "receive", message: parsedText }]);
  };

  const resetChatMessages = async () => {
    await AsyncStorage.multiRemove([
      "chat-history",
      "chat-context-generation-config",
      "chat-context-history",
    ]);
    setMessages([]);
  };

  const sendMessageToGemini = async (message: string) => {
    const result = await chatHistory.current!.sendMessage(message);
    const response = await result.response;
    const parsedText = response.text();
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "receive", message: parsedText },
    ]);
  };

  const saveMessagesToStorage = async (latestMessages: MessageStructure[]) => {
    await AsyncStorage.setItem("chat-history", JSON.stringify(latestMessages));
  };

  const saveChatContextToStorage = async (latestChatHistory: ChatSession) => {
    // console.log(`chat-context: ${JSON.stringify(latestChatHistory)}`);
    await AsyncStorage.setItem(
      "chat-context-generation-config",
      JSON.stringify(latestChatHistory.params?.generationConfig)
    );
    await AsyncStorage.setItem(
      "chat-context-history",
      JSON.stringify(latestChatHistory.params?.history)
    );
  };

  const loadMessages = async () => {
    const storedMessages = await AsyncStorage.getItem("chat-history");
    return storedMessages;
  };

  const loadChatContext = async () => {
    const storedChatContextGenConfig = await AsyncStorage.getItem(
      "chat-context-generation-config"
    );
    const storedChatContextHistory = await AsyncStorage.getItem(
      "chat-context-history"
    );
    return {
      genConfig: storedChatContextGenConfig,
      chatHist: storedChatContextHistory,
    };
  };

  const initChatHistory = (
    initGenConfig: GenerationConfig,
    initChatHistory: Content[]
  ) => {
    chatHistory.current = model.startChat({
      history: initChatHistory,
      generationConfig: initGenConfig,
    });
  };

  const fetchVoices = async () => {
    const availableVoices = await Speech.getAvailableVoicesAsync();
    console.log(
      availableVoices.filter(
        (item) =>
          item.language === "en-US" &&
          item.quality === Speech.VoiceQuality.Enhanced
      )
    ); // Check the console for available voices
    const filteredVoices = availableVoices.filter(
      (item) => item.name.includes("Alex") || item.name.includes("Samantha")
    );
    if (filteredVoices.filter((item) => item.name.includes("Alex"))) {
      setVoiceOption(
        filteredVoices.filter((item) => item.name.includes("Alex"))[0]
      );
    } else {
      setVoiceOption(filteredVoices[0]);
    }
  };

  useEffect(() => {
    fetchVoices();
    loadMessages().then((item) => {
      if (item == null) {
        // console.log("sending initial message");
        sendInitialMessage();
      } else {
        // console.log(item);
        setMessages(JSON.parse(item));
        loadChatContext().then((item) => {
          // console.log(item);
          if (item.chatHist != null && item.genConfig != null) {
            initChatHistory(
              JSON.parse(item.genConfig),
              JSON.parse(item.chatHist)
            )!;
            // console.log("LOADED CHAT CONTEXT!");
          }
        });
      }
    });
    // fetchVoices();
  }, []);

  useEffect(() => {
    saveMessagesToStorage(messages);
    if (chatHistory.current != null) {
      saveChatContextToStorage(chatHistory.current);
    }
  }, [messages]);

  useEffect(() => {
    if (chatHistory.current != null) {
      saveChatContextToStorage(chatHistory.current);
    }
  }, [chatHistory.current]);

  const handleResetButton = async () => {
    await resetChatMessages();
    await sendInitialMessage();
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
        <Pressable
          style={{ marginHorizontal: 15 }}
          onPress={() => {
            // handleResetButton();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            actionSheetRef.current?.show();
          }}
        >
          <Ionicons name="information-circle-outline" size={30} color="black" />
        </Pressable>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        onTouchMove={() => {
          Keyboard.dismiss();
        }}
      >
        <FlatList
          style={{ flexDirection: "column", flex: 1, width: "100%" }}
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          ref={scrollViewRef}
          onContentSizeChange={() => {
            scrollViewRef.current!.scrollToEnd({ animated: true });
          }}
          onLayout={() => {
            scrollViewRef.current!.scrollToEnd({ animated: true });
          }}
          renderItem={({ item }) => (
            <MessageBubble
              type={item.type}
              message={item.message}
              voice={voiceOption!}
            />
          )}
        />
      </KeyboardAvoidingView>
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
            value={typedText}
            textAlignVertical="center"
            onChangeText={(newText) => {
              setTypedText(newText);
            }}
          ></TextInput>
          <Pressable
            style={{ position: "absolute", right: 0 }}
            onPressIn={() => {
              if (typedText !== "") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setSendPressed(true);
              }
            }}
            onPressOut={() => {
              if (typedText !== "") {
                setSendPressed(false);
              }
            }}
            onPress={() => {
              if (typedText !== "") {
                setMessages((prevMessages) => [
                  ...prevMessages,
                  { type: "send", message: typedText },
                ]);
                setTypedText("");
                sendMessageToGemini(typedText);
              }
            }}
          >
            {typedText === "" ? (
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
      <ActionSheet
        ref={actionSheetRef}
        containerStyle={{ paddingHorizontal: "5%", backgroundColor: "#f2f2f2" }}
      >
        <View style={{ marginTop: "5%" }}>
          <Text style={{ color: "#777" }}>TEXT-TO-SPEECH ACCESSIBILITY</Text>
        </View>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: "15%" as unknown as AnimatableNumericValue,
            borderColor: "#ddd",
            borderWidth: 1,
            marginTop: "2.5%",
          }}
        >
          <Pressable
            style={{
              flexDirection: "row",
              height: 50,
              alignItems: "center",
              borderBottomColor: "#ddd",
              borderBottomWidth: 1,
              marginHorizontal: "3%",
            }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setTtsMode("disabled");
            }}
          >
            <View style={{ width: "15%", alignItems: "center" }}>
              {ttsMode == "disabled" && (
                <Ionicons
                  name={"checkmark"}
                  size={24}
                  color={DuoLensPrimaryColors.macaw}
                ></Ionicons>
              )}
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
              }}
            >
              <Text>Disabled</Text>
            </View>
          </Pressable>
          <Pressable
            style={{
              flexDirection: "row",
              height: 50,
              alignItems: "center",
              borderBottomColor: "#ddd",
              borderBottomWidth: 1,
              marginHorizontal: "3%",
            }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setTtsMode("manual");
            }}
          >
            <View style={{ width: "15%", alignItems: "center" }}>
              {ttsMode == "manual" && (
                <Ionicons
                  name={"checkmark"}
                  size={24}
                  color={DuoLensPrimaryColors.macaw}
                ></Ionicons>
              )}
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
              }}
            >
              <Text>Manual Dictation</Text>
            </View>
          </Pressable>
          <Pressable
            style={{
              flexDirection: "row",
              height: 50,
              alignItems: "center",
              marginHorizontal: "3%",
            }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setTtsMode("auto");
            }}
          >
            <View style={{ width: "15%", alignItems: "center" }}>
              {ttsMode == "auto" && (
                <Ionicons
                  name={"checkmark"}
                  size={24}
                  color={DuoLensPrimaryColors.macaw}
                ></Ionicons>
              )}
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
              }}
            >
              <Text>Auto Dictation</Text>
            </View>
          </Pressable>
        </View>
        <View style={{ marginBottom: "10%", marginTop: "5%" }}>
          <BottomButton
            enabled={true}
            text="Nuke Chat 🚀"
            type="red"
            onPressAction={() => {
              handleResetButton();
              actionSheetRef.current?.hide();
            }}
          />
        </View>
      </ActionSheet>
    </SafeAreaView>
  );
};

const MessageBubble = React.memo(
  ({
    type,
    message,
    voice,
  }: {
    type: "send" | "receive";
    message: string;
    voice: Speech.Voice;
  }) => {
    const textInputRef = useRef<TextInput>();
    const [isPlaying, setPlaying] = useState(false);

    const rules = {
      textgroup: (
        node: any,
        children: any,
        parent: any,
        myStyles: any,
        inheritedStyles = {}
      ) => {
        return (
          <TextInput
            scrollEnabled={false}
            editable={false}
            readOnly
            multiline
            ref={textInputRef}
            key={node.key}
            style={[inheritedStyles, { userSelect: "text", padding: 0 }]}
            selectionColor={DuoLensPrimaryColors.feathergreen}
            onBlur={() => {
              textInputRef.current?.blur();
            }}
          >
            {children}
          </TextInput>
        );
      },
    };

    const removeMarkdown = (mdText: string) => {
      return (
        mdText
          // Remove headers
          .replace(/^#+\s+/gm, "")
          // Remove bold and italic (retain text inside)
          .replace(/(\*\*|__)(.*?)\1/g, "$2")
          .replace(/(\*|_)(.*?)\1/g, "$2")
          // Remove strikethrough (retain text inside)
          .replace(/~~(.*?)~~/g, "$1")
          // Remove code (inline and block, retain text inside)
          .replace(/`{1,3}(.*?)`{1,3}/g, "$1")
          // Remove links (retain link text)
          .replace(/\[([^\]]+?)\]\(.*?\)/g, "$1")
          // Remove images (retain alt text)
          .replace(/!\[([^\]]+?)\]\(.*?\)/g, "$1")
          // Remove lists (retain text in list items)
          .replace(/^\s*[\*\-\+\d\.\s]+/gm, "")
          // Remove blockquotes (retain text)
          .replace(/^>\s+/gm, "")
          // Remove horizontal rules (retain surrounding text)
          .replace(/^\s*[-*]{3,}\s*$/gm, "")
      );
    };

    const onPressHandler = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (isPlaying) {
        setPlaying(false);
        Speech.stop();
      } else {
        Speech.stop();
        setPlaying(true);
        Speech.speak(removeMarkdown(message), {
          onDone: () => {
            setPlaying(false);
          },
          voice: voice != null ? voice.identifier : "",
          rate: 1.1,
        });
      }
    };

    const SpeechButton = () => {
      return (
        <Pressable
          style={{
            flexShrink: 1,
            borderRadius: "15%" as unknown as AnimatableNumericValue,
            width: 30,
            // height: 30,
            alignSelf: "center",
          }}
          onPress={onPressHandler}
        >
          <Ionicons
            name={isPlaying ? "pause-circle-outline" : "play-circle-outline"}
            size={30}
            color={DuoLensPrimaryColors.cardinal}
          />
        </Pressable>
      );
    };

    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: type === "send" ? "flex-end" : "flex-start",
        }}
      >
        {type === "send" && <SpeechButton />}
        <View
          style={{
            backgroundColor:
              type === "send" ? DuoLensPrimaryColors.cardinal : "#ddd",
            borderRadius: "15%" as unknown as AnimatableNumericValue,
            paddingHorizontal: 10,
            marginVertical: 5,
            marginHorizontal: 10,
            justifyContent: "center",
            alignSelf: type === "send" ? "flex-end" : "flex-start",
            flexShrink: 1,
            maxWidth: "75%",
          }}
        >
          <Markdown
            rules={rules}
            style={{
              body: {
                color: type === "send" ? DuoLensNeutralColors.snow : "#000",
              },
            }}
          >
            {message.replace(/ {2}/g, " ")}
          </Markdown>
        </View>
        {type === "receive" && <SpeechButton />}
      </View>
    );
  }
);
