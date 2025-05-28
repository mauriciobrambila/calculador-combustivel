import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';

export default function App() {
  const [gasolina, setGasolina] = useState('');
  const [alcool, setAlcool] = useState('');
  const [resposta, setResposta] = useState('');
  const [resultadoStyle, setResultadoStyle] = useState(styles.resultadoNeutro);

  const formatarNumero = (valor) => {
  const valorLimpo = valor.replace(/[^0-9.,]/g, '');
    return valorLimpo.replace(',', '.');
  };

  function calculoCombustivel() {
    const gasolinaNum = parseFloat(formatarNumero(gasolina)) || 0;
    const alcoolNum = parseFloat(formatarNumero(alcool)) || 0;
   
    if (gasolinaNum === 0) return Infinity;
      return alcoolNum / gasolinaNum;
  }

  function combustivelViavel() {
    if (!gasolina.trim() || !alcool.trim()) {
      setResposta('Preencha ambos os valores');
      setResultadoStyle(styles.resultadoNeutro);
      return;
    }

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Escolha de Combustível</Text>
          <Text style={styles.subtitulo}>Compare os preços </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>           Gasolina (R$):</Text>          
          <TextInput              
            style={styles.input}
            placeholder='Ex: 5.75'
            keyboardType='decimal-pad'
            value={gasolina}
            onChangeText={setGasolina}
            onBlur={() => setGasolina(formatarNumero(gasolina))}
          />            
        </View>   

        <View style={styles.inputContainer}>
          <Text style={styles.label}>             Álcool (R$):</Text>          
          <TextInput              
            style={styles.input}
            placeholder='Ex: 3.99'
            keyboardType='decimal-pad'
            value={alcool}
            onChangeText={setAlcool}
            onBlur={() => setAlcool(formatarNumero(alcool))}
          />            
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            title='Calcular Melhor Opção' 
            onPress={combustivelViavel}
            color="#2c3e50"
            disabled={!gasolina.trim() || !alcool.trim()}
          />
        </View>

        {resposta ? (
          <View style={[styles.resultadoContainer, resultadoStyle]}>
            <Text style={styles.resultadoTexto}>{resposta}</Text>
          </View>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 5,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 1,
  },
  subtitulo: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 23,
    marginBottom: 5,
    color: '#34495e',
    
  },
  input: {
    height: 60,
    borderWidth: 2,
    borderColor: '#bdc3c7',
    borderRadius: 20,
    paddingHorizontal: 35,
    marginHorizontal: 55,
    fontSize: 26,
    top: 3,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 20,
    padding: 1,
    marginBottom: 10,
    borderRadius: 50,
    overflow: 'hidden',
  },
  resultadoContainer: {
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultadoTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  resultadoNeutro: {
    backgroundColor: '#ecf0f1',
  },
  resultadoAlcool: {
    backgroundColor: '#27ae60',
  },
  resultadoGasolina: {
    backgroundColor: '#e74c3c',
  },
});