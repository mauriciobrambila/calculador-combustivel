import { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function App() {
  const [gasolina, setGasolina] = useState("");
  const [alcool, setAlcool] = useState("");
  const [resposta, setResposta] = useState("");
  const [resultadoStyle, setResultadoStyle] = useState(styles.resultadoNeutro);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const formatarValor = (valor) => {
    const valorLimpo = valor.replace(/\D/g, "");
    if (!valorLimpo) return "";
    const valorNumerico = parseFloat(valorLimpo) / 100;
    return valorNumerico.toFixed(2).replace(".", ",");
  };

  const parseValor = (valor) => {
    const valorLimpo = valor.replace(",", ".");
    return parseFloat(valorLimpo) || 0;
  };

  useEffect(() => {
    if (gasolina && alcool) {
      combustivelViavel();
    } else if (gasolina || alcool) {
      setResposta("Preencha ambos os valores");
      setResultadoStyle(styles.resultadoNeutro);
    } else {
      setResposta("");
    }
  }, [gasolina, alcool]);

  function calculoCombustivel() {
    const gasolinaNum = parseValor(gasolina);
    const alcoolNum = parseValor(alcool);
    if (gasolinaNum === 0) return Infinity;
    return alcoolNum / gasolinaNum;
  }

  function combustivelViavel() {
    const resultado = calculoCombustivel();

    if (isNaN(resultado)) {
      setResposta("Valores inválidos");
      setResultadoStyle(styles.resultadoNeutro);
      return;
    }

    if (resultado <= 0.7) {
      setResposta("💧 Abasteça com Etanol");
      setResultadoStyle(styles.resultadoAlcool);
    } else {
      setResposta("⛽Abasteça com Gasolina");
      setResultadoStyle(styles.resultadoGasolina);
    }

    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={["#1a2a6c", "#b21f1f", "#fdbb2d"]}
        style={styles.container}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={80}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              <ImageBackground
                source={require("./img/posto.jpg")}
                style={styles.image}
                imageStyle={{ opacity: 0.95, borderRadius: 60 }}
              >
                <View style={styles.overlay}>
                  <Text style={styles.titulo}>Calculadora de  Combustível</Text>
                  <Text style={styles.subtitulo}>
                    Compare preços, economize e escolha seu posto.
                  </Text>
                </View>
              </ImageBackground>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>             Gasolina (R$)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="     Digite só números"
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  value={gasolina}
                  onChangeText={(t) => setGasolina(formatarValor(t))}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>               Etanol (R$)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="    Digite só números"
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  value={alcool}
                  onChangeText={(t) => setAlcool(formatarValor(t))}
                />
              </View>

              {resposta ? (
                <Animated.View
                  style={[
                    styles.resultadoContainer,
                    resultadoStyle,
                    { opacity: fadeAnim },
                  ]}
                >
                  <Text style={styles.resultadoTexto}>{resposta}</Text>
                </Animated.View>
              ) : null}
            </View>

            <Text style={styles.creditos}>           🚗 Desenvolvido por mauriciobrambila2015@gmail.com</Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  image: {
    width: "100%",
    height: 160,
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.20)",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 12,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 16,
    color: "#f5f5f5",
    textAlign: "center",
    marginTop: 4,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 17,
    color: "#2c3e50",
    marginBottom: 6,
    fontWeight: "800",
  },
  input: {
    height: 55,
    borderWidth: 2.5,
    borderColor: "blue",
    borderRadius: 16,
    paddingHorizontal: 28,
    fontSize: 18,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  resultadoContainer: {
    marginTop:14,
    borderRadius: 18,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  resultadoTexto: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  resultadoNeutro: {
    backgroundColor: "#7f8c8d",
  },
  resultadoAlcool: {
    backgroundColor: "green",
  },
  resultadoGasolina: {
    backgroundColor: "red",
  },
  creditos: {
    fontSize: 14,
    color: "#fff",
    marginTop: 22,
    opacity: 0.6,
  },
});
