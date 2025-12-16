import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
export default function App() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [estado, setEstado] = useState('');
  const [categoria, setCategoria] = useState('');
  const [productos, setProductos] = useState([]);
  const guardarProducto = () => {
    fetch('http://192.168.1.19:3000/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        descripcion,
        precio,
        estado,
        categoria,
        foto: ''
      })
    }).then(() => {
      listarProductos();
    });
  };
  const listarProductos = () => {
    fetch('http://192.168.1.19:3000/productos')
      .then(res => res.json())
      .then(data => setProductos(data));
  };
  const eliminarProducto = (id) => {
    fetch(`http://192.168.1.19:3000/items/${id}`, {
      method: 'DELETE'
    }).then(() => {
      listarProductos();
    });
  };
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 20 }}>Registro de Productos</Text>
      <TextInput placeholder="Nombre" onChangeText={setNombre} />
      <TextInput placeholder="Descripción" onChangeText={setDescripcion} />
      <TextInput placeholder="Precio" onChangeText={setPrecio} />
      <TextInput placeholder="Estado" onChangeText={setEstado} />
      <TextInput placeholder="Categoría" onChangeText={setCategoria} />
      <Button title="Guardar" onPress={guardarProducto} />
      <Button title="Cargar Productos" onPress={listarProductos} />
      {productos.map((p) => (
        <View key={p.id} style={{ marginTop: 10 }}>
          <Text>{p.nombre}</Text>
          <Text>{p.precio}</Text>
          <Button title="Eliminar" onPress={() => eliminarProducto(p.id)} />
        </View>
      ))}
    </ScrollView>
  );
}
