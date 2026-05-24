const BASE_URL = "https://fakestoreapi.com";

const isValidId = (id) => /^\d+$/.test(id);

const fail = (message) => {
  console.error(`Error: ${message}`);
  process.exit(1);
};

const getAllProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error al obtener los productos:", error.message);
  }
};

const getProductById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error al obtener el producto:", error.message);
  }
};

const createProduct = async (title, price, category) => {
  try {
    const response = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, price, category }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error al crear el producto:", error.message);
  }
};

const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error al eliminar el producto:", error.message);
  }
};

const [method, path, ...restArgs] = process.argv.slice(2);

const [resource, id] = (path ?? "").split("/");

if (method === "GET" && resource === "products" && !id) {
  await getAllProducts();
} else if (method === "GET" && resource === "products" && id) {
  if (!isValidId(id)) fail("El id debe ser un número entero positivo.");
  await getProductById(id);
} else if (method === "POST" && resource === "products") {
  const [title, price, category] = restArgs;
  if (!title || !price || !category) {
    fail("POST products requiere title, price y category.");
  }
  if (isNaN(Number(price))) fail("La variable price debe ser un número.");
  await createProduct(title, Number(price), category);
} else if (method === "DELETE" && resource === "products" && id) {
  if (!isValidId(id)) fail("El id debe ser un número entero positivo.");
  await deleteProduct(id);
} else {
  console.log("Comando no reconocido. Ingrese uno de los comandos válidos:");
  console.log("  npm run start GET products");
  console.log("  npm run start GET products/<id>");
  console.log("  npm run start POST products <title> <price> <category>");
  console.log("  npm run start DELETE products/<id>");
}
