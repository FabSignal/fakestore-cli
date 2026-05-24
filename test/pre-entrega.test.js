import { spawn } from "node:child_process";
import { expect } from "chai";

function runCLI(args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["index.js", ...args], {
      shell: false,
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));

    child.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(stderr || `Exit code ${code}`));
      }
      resolve(stdout.replace(/\r\n/g, "\n"));
    });
  });
}

describe("CLI GET products", function () {
  this.timeout(15000);

  it("devuelve un array con al menos 20 productos", async () => {
    const out = await runCLI(["GET", "products"]);

    expect(out).to.include("[");
    expect(out).to.include("id:");

    const ids = out.match(/\bid:\s*\d+/g) ?? [];
    expect(ids.length).to.be.at.least(20);
  });
});

describe("CLI GET products/7", function () {
  this.timeout(15000);

  it("devuelve el producto 7 con estructura válida", async () => {
    const out = await runCLI(["GET", "products/7"]);

    expect(out).to.match(/id:\s*7/);
    expect(out).to.match(/title:\s*['"].+['"]/);
    expect(out).to.match(/price:\s*\d+(\.\d+)?/);
    expect(out).to.match(/category:\s*['"].+['"]/);
  });
});

describe("CLI POST products", function () {
  this.timeout(15000);

  it("crea un nuevo producto con los datos enviados", async () => {
    const out = await runCLI([
      "POST",
      "products",
      "Remera negra",
      "29.99",
      "men's clothing",
    ]);

    expect(out).to.match(/id:\s*\d+/);
    expect(out).to.match(/title:\s*'Remera negra'/);
    expect(out).to.match(/price:\s*'?29\.99'?/);
    expect(out).to.match(/category:\s*"men's clothing"/);
  });
});

// describe("CLI PUT products/7", function () {
//   this.timeout(15000);

//   it("actualiza el producto 7 con los datos enviados", async () => {
//     const out = await runCLI([
//       "PUT",
//       "products/7",
//       "Remera azul",
//       "34.5",
//       "women's clothing",
//     ]);

//     expect(out).to.match(/id:\s*7/);
//     expect(out).to.match(/title:\s*'Remera azul'/);
//     expect(out).to.match(/price:\s*'?34\.5'?/);
//     expect(out).to.match(/category:\s*"women's clothing"/);
//   });
// });

describe("CLI DELETE products/7", function () {
  this.timeout(15000);

  it("devuelve el producto eliminado con id 7", async () => {
    const out = await runCLI(["DELETE", "products/7"]);

    expect(out).to.match(/id:\s*7/);
    expect(out).to.match(/title:\s*['"].+['"]/);
    expect(out).to.match(/price:\s*\d+(\.\d+)?/);
    expect(out).to.match(/category:\s*['"].+['"]/);
  });
});
