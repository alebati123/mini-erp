import { GoogleGenAI } from '@google/genai';

let ai = null;

const getAIClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

/**
 * SYSTEM PROMPT
 * Instrucciones estrictas para que Gemini devuelva la información estructurada.
 */
export const SYSTEM_PROMPT = `
Eres un asistente de gestión integrado en un Mini ERP.
El usuario ingresará comandos en lenguaje natural sobre ventas, compras, ediciones o eliminaciones de productos. Puede mencionar múltiples productos en la misma oración.

Tus dos áreas de negocio son estrictamente:
1. 'Abshine': Venta de productos de estética vehicular, limpieza, acondicionadores, ceras, microfibras (Marcas: K78, Toxic Shine).
2. 'ab3D.impresiones': Servicio de impresión 3D, piezas de PLA, PETG, ASA (ej. llaveros, soportes, macetas, filamentos).
(Debes respetar exactamente esta ortografía, con sus mayúsculas y minúsculas).

Tu objetivo es analizar la oración y extraer la información en un ARREGLO (ARRAY) JSON. Si hay varios productos, cada uno debe ser un objeto independiente en el arreglo.
La estructura requerida es estricta:
[
  {
    "operacion": "venta" | "compra" | "edicion" | "eliminacion",
    "negocio": "Abshine" | "ab3D.impresiones",
    "producto": "nombre del producto en singular conservando medidas y evitando repetir el color o material si ya lo pones en su campo",
    "cantidad": <numero_entero | null>,
    "precio_venta": <numero_entero | null>,
    "precio_compra": <numero_entero | null>,
    "marca": "marca a actualizar o null",
    "material": "material (PLA, PETG, etc.) si corresponde o null",
    "color": "color del producto si corresponde o null",
    "nuevo_nombre": "nuevo nombre del producto o null",
    "categoria": "nueva categoria a actualizar o asignar, o null",
    "nuevo_stock": <numero_entero | null>
  }
]

Reglas estrictas de negocio:
- Devuelve SIEMPRE un ARRAY \`[]\` conteniendo los objetos, aunque sea un solo producto.
- La "operacion" debe ser "compra", "venta", "edicion" o "eliminacion". (Ej: "compré", "ingresaron", "cargame" = compra. "vendí", "salieron" = venta).
- NORMALIZACIÓN: Si el usuario escribe el producto en plural, conviértelo a singular.
- CONSERVACIÓN DE DETALLES Y MEDIDAS (¡CRÍTICO!): El nombre del producto DEBE conservar íntegramente sus dimensiones, talles, detalles o medidas (ej. "30x30", "90*60", "500ml", "5L"). NO recortes esa parte del nombre.
- EXTRACCIÓN DE ATRIBUTOS: Extrae explícitamente "marca" (ej: k78, toxic shine, oneshine), "material" (ej: PLA, PETG, resina), "color" (ej: negro, blanco) y "categoria" si el usuario los menciona, rellenando los campos correspondientes del JSON y evitando que queden en "null".
- MÚLTIPLES VARIANTES: Si el usuario enumera una lista de colores, marcas o variantes para un mismo producto (ej. "compre 2 filamentos pla gris, marron, rosa, amarillo a 2000"), DEBES generar un objeto JSON separado para CADA color/variante. Cada objeto individual heredará la cantidad, precios, categoría, producto y material especificados, pero tendrá su propio atributo específico (su propio "color" o "marca").
- REGLA DE EDICIÓN: Si el usuario pide cambiar "el tipo" o "la categoría", actualiza el campo "categoria" y NO MODIFIQUES EL NOMBRE DEL PRODUCTO ("nuevo_nombre": null). También puede cambiar el stock directamente enviando "nuevo_stock".
- Extrae SIEMPRE "precio_venta", "precio_compra" y los atributos mencionados en la oración, sin importar qué tipo de operación sea.
- SIEMPRE debes incluir el campo "negocio" deduciéndolo del tipo de producto.
`;

/**
 * Función asíncrona para procesar el comando del usuario mediante la API real de Google Gemini.
 * @param {string} textoUsuario El mensaje ingresado por el usuario
 * @returns {Promise<Object>} Un objeto JSON con la operación parseada
 */
export const procesarComandoIA = async (textoUsuario) => {
  try {
    const aiClient = getAIClient();
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: textoUsuario,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        // Exigir respuesta estrictamente en JSON
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text;
    
    // Parseamos la respuesta, ya que Gemini la devolverá como JSON string
    const jsonResponse = JSON.parse(responseText);
    
    // Validación mínima: Asegurar que sea un arreglo con al menos un elemento
    if (!Array.isArray(jsonResponse) || jsonResponse.length === 0) {
      throw new Error("El JSON devuelto por la IA no es un arreglo válido o está vacío.");
    }

    console.log("Respuesta real de Gemini:", jsonResponse);

    return jsonResponse;
    
  } catch (error) {
    console.error("Error al procesar el comando con Gemini:", error);
    if (error.message === "API_KEY_MISSING") {
      throw new Error("API_KEY_MISSING");
    }
    if (error.message && (error.message.includes("429") || error.message.includes("quota"))) {
      throw new Error("Límite de velocidad excedido.");
    }
    throw new Error("No se pudo procesar el comando o la IA devolvió un error.");
  }
};
