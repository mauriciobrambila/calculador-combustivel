import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ImageBackground, TouchableWithoutFeedback, 
  Keyboard, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';

export default function App() {
  const [gasolina, setGasolina] = useState('');
  const [alcool, setAlcool] = useState('');
  const [resposta, setResposta] = useState('');
  const [resultadoStyle, setResultadoStyle] = useState(styles.resultadoNeutro);

  // Função para formatar o valor digitado (sem pontos decimais) para o formato monetário
  const formatarValor = (valor) => {
    // Remove tudo que não é dígito
    const valorLimpo = valor.replace(/\D/g, '');
    
    // Se não tiver valor, retorna vazio
    if (!valorLimpo) return '';
    
    // Converte para o formato decimal (os 2 últimos dígitos são os centavos)
    const valorNumerico = parseFloat(valorLimpo) / 100;
    
    // Formata para string com 2 casas decimais e substitui . por ,
    return valorNumerico.toFixed(2).replace('.', ',');
  };

  // Função para converter o valor formatado (com vírgula) para número
  const parseValor = (valor) => {
    const valorLimpo = valor.replace(',', '.');
    return parseFloat(valorLimpo) || 0;
  };

  // Efeito que calcula automaticamente quando os valores mudam
  useEffect(() => {
    if (gasolina && alcool) {
      combustivelViavel();
    } else if (gasolina || alcool) {
      setResposta('Preencha ambos os valores');
      setResultadoStyle(styles.resultadoNeutro);
    } else {
      setResposta('');
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
      setResposta('Valores inválidos');
      setResultadoStyle(styles.resultadoNeutro);
      return;
    }

    if (resultado <= 0.7) {
      setResposta('Abasteça com álcool');
      setResultadoStyle(styles.resultadoAlcool);
    } else {
      setResposta('Abasteça com gasolina');
      setResultadoStyle(styles.resultadoGasolina);
    }
  }

  return (
    <ImageBackground
      source={require('./img/posto.jpg')}
      style={styles.background}
      imageStyle={{ opacity: 0.6 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.inner}>
              <View style={styles.header}>
                <Text style={styles.titulo}>Escolha de Combustível </Text>
                <Text style={styles.subtitulo}>Compare os preços  </Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>             Gasolina (R$):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 579 para 5,79"
                  keyboardType="numeric"
                  value={gasolina}
                  onChangeText={(text) => setGasolina(formatarValor(text))}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>               Etanol (R$):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 399 para 3,99"
                  keyboardType="numeric"
                  value={alcool}
                  onChangeText={(text) => setAlcool(formatarValor(text))}
                />
              </View>

              {resposta ? (
                <View style={[styles.resultadoContainer, resultadoStyle]}>
                  <Text style={styles.resultadoTexto}>{resposta}</Text>
                </View>
              ) : null}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)'
  },
  imageStyle: {
    width: 300,
    height: 300,
    opacity: 0.1,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 25,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 25,
  },
  subtitulo: {
    fontSize: 18,
    color: '#7f8c8d',
  },
  inputContainer: {
    marginBottom: 13,
  },
  label: {
    fontSize: 20,
    color: '#34495e',
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 22,
    paddingHorizontal: 100,
    fontSize: 18,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 22,
    overflow: 'hidden',
  },
  resultadoContainer: {
    padding: 10,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  resultadoTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  resultadoNeutro: {
    backgroundColor: '#95a5a6',
  },
  resultadoAlcool: {
    backgroundColor: '#27ae60',
  },
  resultadoGasolina: {
    backgroundColor: '#c0392b',
  },
});