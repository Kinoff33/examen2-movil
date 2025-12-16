import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  ScrollView, 
  Image 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
export default function App() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [estado, setEstado] = useState('');
  const [categoria, setCategoria] = useState('');
  const [fotoProducto, setFotoProducto] = useState(null);
  const [productos, setProductos] = useState([]);
  const [vista, setVista] = useState('lista'); 
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const tomarFoto = async () => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    if (!permiso.granted) {
      alert('Permiso de cámara denegado');
      return;
    }
    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });
    if (!resultado.canceled) {
      setFotoProducto(resultado.assets[0].uri);
    }
  };
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
        foto: fotoProducto
      })
    }).then(() => {
      listarProductos();
      limpiarFormulario();
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
  const limpiarFormulario = () => {
    setNombre('');
    setDescripcion('');
    setPrecio('');
    setEstado('');
    setCategoria('');
    setFotoProducto(null);
  };
  if (vista === 'detalle' && productoSeleccionado) {
    return (
      <ScrollView style={{ padding: 20 }}>
        <Text style={{ fontSize: 20 }}>Detalle del Producto</Text>

        <Text>Nombre: {productoSeleccionado.nombre}</Text>
        <Text>Descripción: {productoSeleccionado.descripcion}</Text>
        <Text>Precio: {productoSeleccionado.precio}</Text>
        <Text>Estado: {productoSeleccionado.estado}</Text>
        <Text>Categoría: {productoSeleccionado.categoria}</Text>
        {productoSeleccionado.foto && (
          <Image
            source={{ uri: productoSeleccionado.foto }}
            style={{ width: 200, height: 200, marginTop: 10 }}
          />
        )}
        <Button title="Volver" onPress={() => setVista('lista')} />
      </ScrollView>
    );
  }
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 20 }}>Registro de Productos</Text>
      <TextInput placeholder="Nombre" onChangeText={setNombre} value={nombre} />
      <TextInput placeholder="Descripción" onChangeText={setDescripcion} value={descripcion} />
      <TextInput placeholder="Precio" onChangeText={setPrecio} value={precio} />
      <TextInput placeholder="Estado" onChangeText={setEstado} value={estado} />
      <TextInput placeholder="Categoría" onChangeText={setCategoria} value={categoria} />
      <Button title="Tomar fotografía" onPress={tomarFoto} />
      {fotoProducto && (
        <Image
          source={{ uri: fotoProducto }}
          style={{ width: 150, height: 150, marginTop: 10 }}
        />
      )}
      <Button title="Guardar" onPress={guardarProducto} />
      <Button title="Cargar Productos" onPress={listarProductos} />
      {productos.map((p) => (
        <View key={p.id} style={{ marginTop: 10 }}>
          <Text>{p.nombre}</Text>
          <Text>{p.precio}</Text>
          <Button
            title="Detalle"
            onPress={() => {
              setProductoSeleccionado(p);
              setVista('detalle');
            }}
          />
          <Button title="Eliminar" onPress={() => eliminarProducto(p.id)} />
        </View>
      ))}
    </ScrollView>
  );
}
