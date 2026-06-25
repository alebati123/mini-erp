/**
 * SYSTEM PROMPT
 * 
 * Este prompt debe ser enviado como instrucción principal al inicializar
 * el modelo (ej. Google Gemini) cuando se conecte la API real.
 */
export const SYSTEM_PROMPT = `
Eres un asistente de gestión integrado en un Mini ERP.
El usuario ingresará comandos en lenguaje natural sobre ventas o compras de productos.

Tus dos áreas de negocio son:
1. 'Abshine': Venta de productos de estética vehicular, limpieza, acondicionadores, ceras, microfibras (Marcas típicas: K78, Toxic Shine).
2. 'ab3D.impresiones': Servicio de impresión 3D, venta de piezas de PLA, PETG, ASA (ej. llaveros, soportes, macetas, rollos de filamento).

Tu objetivo es analizar la oración y extraer la información en un objeto JSON estricto.
La estructura requerida es:
{
  "operacion": "venta" | "compra",
  "negocio": "Abshine" | "ab3D.impresiones",
  "producto": "nombre simplificado del producto",
  "cantidad": <numero_entero>,
  "precio": <numero_entero | null>
}

Ejemplos:
- Usuario: "Vendí 2 ceras rápidas a 6500" -> {"operacion": "venta", "negocio": "Abshine", "producto": "Cera Rápida", "cantidad": 2, "precio": 6500}
- Usuario: "Compré 5 rollos de PLA blanco" -> {"operacion": "compra", "negocio": "ab3D.impresiones", "producto": "Rollo PLA", "cantidad": 5, "precio": null}

REGLA ESTRICTA: Devuelve SOLAMENTE el bloque JSON. No incluyas markdown, saludos ni explicaciones.
`;

/**
 * Función asíncrona para procesar el comando del usuario mediante IA.
 * Actualmente simula la respuesta de un LLM.
 * @param {string} textoUsuario El mensaje ingresado por el usuario
 * @returns {Promise<Object>} Un objeto JSON con la operación parseada
 */
export const procesarComandoIA = async (textoUsuario) => {
  // Simulamos un delay de red (conexión con API de Gemini/OpenAI)
  await new Promise(resolve => setTimeout(resolve, 1500));

  console.log("System Prompt a enviar:", SYSTEM_PROMPT);
  console.log("Comando recibido del usuario:", textoUsuario);

  const text = textoUsuario.toLowerCase();
  
  // ==========================================
  // LÓGICA MOCK: Simulación de la respuesta IA
  // Aquí es donde deberías conectar la llamada `fetch` a tu API de LLM.
  // ==========================================
  
  let operacion = 'venta';
  if (text.includes('compré') || text.includes('compre') || text.includes('compra')) {
    operacion = 'compra';
  }

  let negocio = 'Abshine';
  if (text.includes('3d') || text.includes('pla') || text.includes('soporte') || text.includes('maceta') || text.includes('llavero')) {
    negocio = 'ab3D.impresiones';
  }

  // Extracción muy básica para el mock (la IA real haría esto perfectamente)
  let cantidad = 1;
  const matchNum = text.match(/\d+/);
  if (matchNum) {
    cantidad = parseInt(matchNum[0]);
  }

  let producto = 'Producto Desconocido';
  if (text.includes('microfibra')) producto = 'Microfibra Premium';
  if (text.includes('cera')) producto = 'Cera Rápida';
  if (text.includes('shampoo')) producto = 'Shampoo Neutro';
  if (text.includes('pla')) producto = 'Rollo PLA';
  if (text.includes('llavero')) producto = 'Llavero Personalizado';
  
  let precio = null;
  // Buscar precio después de un símbolo de $ o palabras clave (mock muy crudo)
  const matchPrecio = text.match(/\$(\d+)/) || text.match(/a (\d+)/);
  if (matchPrecio && matchPrecio[1]) {
    // Evitar confundir la cantidad con el precio si son el mismo número
    if (parseInt(matchPrecio[1]) !== cantidad || text.match(/\d+/g).length > 1) {
      precio = parseInt(matchPrecio[1]);
    }
  }

  const jsonResponse = {
    operacion,
    negocio,
    producto,
    cantidad,
    precio
  };

  console.log("Respuesta simulada de la IA:", jsonResponse);

  return jsonResponse;
};
