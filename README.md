# fakestore-cli

Herramienta de línea de comandos en Node.js que gestiona productos de una tienda en línea consumiendo la [FakeStore API](https://fakestoreapi.com). Permite listar, consultar, crear y eliminar productos desde la terminal usando el recurso `products`.

| Operación                    | Verbo HTTP | Significado                        |
| ---------------------------- | ---------- | ---------------------------------- |
| Listar todos los productos   | `GET`      | Leer la colección completa         |
| Consultar un producto por id | `GET`      | Leer un elemento puntual           |
| Crear un producto nuevo      | `POST`     | Agregar un elemento a la colección |
| Eliminar un producto         | `DELETE`   | Quitar un elemento de la colección |

Cada operación se ejecuta con la forma **`npm run start <verbo> <recurso>[/<id>] [...args]`**. La aplicación lee los argumentos, valida los datos principales, realiza la petición HTTP correspondiente y muestra la respuesta por consola.

---

## Requisitos

- **Node.js 18 o superior.**
- **npm**
- Conexión a internet, ya que la aplicación consulta la FakeStore API.

Verificación rápida del entorno:

```bash
node -v   # v18 o superior
npm -v
```

---

## Instalación

```bash
git clone https://github.com/FabSignal/fakestore-cli.git
cd fakestore-cli
npm install
```

Con `npm install` se instalan las dependencias de desarrollo (`mocha` y `chai`) necesarias para correr los tests. La aplicación no necesita dependencias externas para funcionar.

---

## Comandos rápidos

```bash
npm install
npm run start GET products
npm run start GET products/7
npm run start POST products "Remera negra" 29.99 "ropa deportiva"
npm run start DELETE products/7
npm test
```

---

## Uso

Cuatro comandos cubren toda la funcionalidad:

### 1. Listar todos los productos

```bash
npm run start GET products
```

Devuelve un array con la totalidad del catálogo (20 productos, según el estado actual de la API).

### 2. Consultar un producto por id

```bash
npm run start GET products/14
```

Devuelve un objeto con los datos del producto identificado por el id provisto. El id debe ser un número entero positivo; en caso contrario, se muestra un mensaje de error.

Ejemplo de salida:

```js
{
  id: 14,
  title: 'Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor (LC49HG90DMNXZA) – Super Ultrawide Screen QLED ',
  price: 999.99,
  description: '...',
  category: 'electronics',
  image: 'https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_t.png',
  rating: { rate: 2.2, count: 140 }
}
```

### 3. Crear un producto nuevo

```bash
npm run start POST products "Remera negra" 29.99 "ropa deportiva"
```

Envía al servidor un nuevo producto con los datos provistos:

- `title` : nombre del producto. Si contiene espacios, debe ir entre comillas.
- `price` : precio del producto. El programa valida que sea numérico y lo convierte a `Number` antes de enviarlo.
- `category` : categoría a la que pertenece. Si contiene espacios, debe ir entre comillas.

La respuesta incluye el `id` autogenerado por el servidor.

### 4. Eliminar un producto

```bash
npm run start DELETE products/7
```

Solicita la eliminación del producto identificado por el id. El servidor responde devolviendo el producto eliminado como confirmación.

### Comando inválido

Si el comando no coincide con ninguno de los anteriores, el programa muestra los comandos disponibles:

```bash
npm run start algo-invalido
# Comando no reconocido. Comandos válidos:
#   npm run start GET products
#   npm run start GET products/<id>
#   npm run start POST products <title> <price> <category>
#   npm run start DELETE products/<id>
```

---

## Sobre la FakeStore API

[FakeStore](https://fakestoreapi.com) es una API pública, gratuita y de propósito didáctico que **simula** una tienda en línea con catálogo de productos, usuarios, carritos y categorías. Para esta aplicación se utiliza únicamente el recurso `/products`.

**Nota importante:** FakeStore simula la creación y eliminación de productos, pero no guarda esos cambios. Un `POST` exitoso devuelve un objeto con `id` autogenerado, pero ese producto no aparecerá en un `GET /products` posterior. Lo mismo ocurre con `DELETE`: la API responde como si hubiera eliminado el producto, pero el siguiente `GET` lo seguirá trayendo.

Para esta aplicación, lo importante es que la comunicación con la API es real: el cliente envía peticiones HTTP y procesa las respuestas. Que FakeStore no guarde los cambios queda fuera del alcance del proyecto.

---

## Conceptos y arquitectura

El código está en un único archivo (`index.js`) y se divide en partes simples:

- Configuración de la URL base de la API.
- Funciones auxiliares para validar ids y mostrar errores.
- Una función asíncrona para cada operación: listar, consultar, crear y eliminar.
- Lectura de argumentos con `process.argv`.
- Un bloque final de condiciones que decide qué acción ejecutar.

Las funciones que llaman a la API usan `fetch`, validan `response.ok`, convierten la respuesta a JSON y muestran el resultado por consola. Si ocurre un error de red o la API responde con un error HTTP, se muestra un mensaje claro.

### Validaciones principales

- Los ids deben ser números enteros positivos.
- `POST products` requiere `title`, `price` y `category`.
- `price` debe ser un valor numérico.

---

## Tests

El proyecto incluye tests automatizados que validan las cuatro operaciones contra la API real:

```bash
npm test
```

Los tests usan **Mocha** y **Chai**. Verifican que:

- `GET products` devuelva un array con al menos 20 productos.
- `GET products/7` devuelva un objeto con la estructura esperada (`id`, `title`, `price`, `category`).
- `POST products` cree un producto con los datos enviados y devuelva un id.
- `DELETE products/7` devuelva el producto eliminado.

Cada test ejecuta el programa con `node index.js <args>`, captura la salida de la terminal y revisa el resultado.

---

## Estructura del proyecto

```
fakestore-cli/
├── index.js
├── package.json
├── package-lock.json
├── test/
│   └── pre-entrega.test.js
├── README.md
└── .gitignore
```

---

## Referencias

- [Documentación oficial de Node.js](https://nodejs.org/docs/latest/api/)
- [FakeStore API](https://fakestoreapi.com/docs)
- [MDN: `fetch`](https://developer.mozilla.org/es/docs/Web/API/Window/fetch)
- [MDN: `async/await`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/async_function)
- [Mocha](https://mochajs.org/): framework de testing.
- [Chai](https://www.chaijs.com/): librería de aserciones.
