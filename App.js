import { initializeApp } from "firebase/app";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, FlatList, ScrollView } from "react-native";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const firebaseConfig = {
  apiKey: "AIzaSyDc4fnVJ-BJwZC9OLafrO1e-C3DQ0WIT2M",
  authDomain: "atvd06-32d9b.firebaseapp.com",
  projectId: "atvd06-32d9b",
  storageBucket: "atvd06-32d9b.firebasestorage.app",
  messagingSenderId: "362431759464",
  appId: "1:362431759464:web:af629d59ab19371346e7dd",
  measurementId: "G-C4G0PFM800"
};

const app = initializeApp(firebaseConfig);

const Stack = createNativeStackNavigator();

//cadastro
function CadastroScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCadastro = () => {
    const auth = getAuth();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("Usuário criado!");
        navigation.navigate("Login");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Senha"
        placeholderTextColor="#999"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

//login
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigation.navigate("Home");
      })
      .catch((error) => {
        alert("Erro ao fazer login");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Senha"
        placeholderTextColor="#999"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
        <Text style={styles.link}>Criar conta</Text>
      </TouchableOpacity>
    </View>
  );
}

//tela principal
function HomeScreen({ navigation }) {
  const [currencies, setCurrencies] = useState([]);
  const [updatedAt, setUpdatedAt] = useState("");

  const auth = getAuth();

  const fetchData = async () => {
    try {
      const response = await fetch("https://economia.awesomeapi.com.br/json/all");
      const data = await response.json();

      const arrayMoedas = Object.values(data);
      setCurrencies(arrayMoedas);

      const now = new Date();
      setUpdatedAt(now.toLocaleString());
    } catch (error) {
      alert("Erro ao buscar cotações");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => navigation.navigate("Login"))
      .catch(() => alert("Erro ao sair"));
  };


  const flags = {
    USD: "https://flagcdn.com/w40/us.png", //estados unidos
    EUR: "https://flagcdn.com/w40/eu.png", //união europeia
    GBP: "https://flagcdn.com/w40/gb.png", //reino unido
    ARS: "https://flagcdn.com/w40/ar.png", //argentina
    CAD: "https://flagcdn.com/w40/ca.png", //canadá
    AUD: "https://flagcdn.com/w40/au.png", //austrália
    JPY: "https://flagcdn.com/w40/jp.png", //japão
    CHF: "https://flagcdn.com/w40/ch.png", //suíça
    CNY: "https://flagcdn.com/w40/cn.png", //china
    ILS: "https://flagcdn.com/w40/il.png", //israel
  };

  const renderCard = (currency) => {
    if (!currency) return null;

    const flagUrl = flags[currency.code];

    return (
      <View style={styles.card}>
        {flagUrl ? (
          <Image source={{ uri: flagUrl }} style={styles.flagImg} />
        ) : (
          <Text style={styles.flagFallback}>
            {currency.code}
          </Text>
        )}

        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>
            {currency.code} / BRL
          </Text>
          <Text style={styles.cardSubtitle}>
            {currency.name}
          </Text>
        </View>

        <Text style={styles.value}>
          R$ {parseFloat(currency.bid).toFixed(2)}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0A1F44" }}>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.title}>COTAÇÃO DE MOEDAS</Text>
        <Text style={styles.subtitle}>
          ATUALIZADO EM: {updatedAt}
        </Text>

        {currencies.map((item, index) => (
          <View key={index}>
            {renderCard(item)}
          </View>
        ))}

        <TouchableOpacity style={styles.button} onPress={fetchData}>
          <Text style={styles.buttonText}>
            ATUALIZAR COTAÇÕES
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <Text style={styles.logoutText}>SAIR</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.navbar}> //barra de navegação fixa embaixo
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>💰</Text>
          <Text style={[styles.navText, { color: "#FFD60A" }]}>
            COTAÇÕES
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📊</Text>
          <Text style={styles.navText}>HISTÓRICO</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navText}>CONFIG</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}



//app 
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Cadastro">
        <Stack.Screen name="Cadastro" component={CadastroScreen}  options={{ headerShown: false }}  />
        <Stack.Screen name="Login" component={LoginScreen}  options={{ headerShown: false }}  />
        <Stack.Screen name="Home" component={HomeScreen}   options={{ title: "CONVERSOR DE MOEDAS" }}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


//styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A1F44",
    justifyContent: "center",
    padding: 20
  },
  title: {
    color: "#FFD60A",
    fontSize: 28,
    textAlign: "center",
    marginBottom: 20
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15
  },
  button: {
    backgroundColor: "#FFD60A",
    padding: 15,
    borderRadius: 8
  },
  buttonText: {
    textAlign: "center",
    color: "#0A1F44",
    fontWeight: "bold"
  },
  link: {
    color: "#fff",
    marginTop: 15,
    textAlign: "center"
  },

card: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#fff",
  padding: 15,
  borderRadius: 12,
  marginBottom: 12
},

flag: {
  fontSize: 24,
  marginRight: 10
},

cardTitle: {
  fontWeight: "bold",
  color: "#0A1F44"
},

cardSubtitle: {
  fontSize: 12,
  color: "#555"
},

value: {
  fontWeight: "bold",
  color: "#0A1F44"
},

subtitle: {
  color: "#fff",
  textAlign: "center",
  marginBottom: 20
},

logout: {
  marginTop: 20,
  padding: 10
},

logoutText: {
  color: "#FFD60A",
  textAlign: "center"
},
flagImg: {
  width: 40,
  height: 30,
  borderRadius: 4,
  marginRight: 10
},
navbar: {
  flexDirection: "row",
  backgroundColor: "#fff",
  paddingVertical: 12,
  justifyContent: "space-around",
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  elevation: 10
},
navItem: {
  alignItems: "center"
},

navIcon: {
  fontSize: 20
},

navText: {
  fontSize: 12,
  color: "#0A1F44"
}
});
