// Obtener parámetros de la URL
const urlParams = new URLSearchParams(window.location.search);
const brandName = urlParams.get('brand') || 'Desconocida';
const year = urlParams.get('year') || 'Desconocido';
const project = urlParams.get('project') || 'Desconocido';
const clave = urlParams.get('clave') || '';
document.getElementById('brandName').textContent = brandName.toUpperCase();
document.getElementById('yearName').textContent = year.toUpperCase();
document.getElementById('projectName').textContent = project.toUpperCase();
document.getElementById('claveName').textContent = clave.toUpperCase();

// Lista de categorías en orden
const categoryOrder = [
  "BARNIZ", "PINTURA", "METAL", "MADERA", "MARMOL", "HERRAJE", "ELÉCTRICO",
  "ACRÍLICO", "ESPEJO", "VIDRIO", "GRAFICOS", "VINIL ADHERIBLE", "BACKLIGH",
  "TELA/VINIL", "EMBALAJE", "MANO DE OBRA", "EXTERNOS", "INSUMOS", "CORTE LASER"
];

// Definir opciones y precios para BARNIZ y PINTURA
const barnizOptions = [
  { value: "LACA BRILLO", price: 1031.00 },
  { value: "LACA MATE", price: 975.00 },
  { value: "LACA HIGH GLOSS", price: 1450.00 },
  { value: "BARNIZ TRANSPARENTE", price: 650.00 },
  { value: "FONDEADO", price: 80.00 },
  { value: "ROYTIROL", price: 450.00 },
  { value: "MICROCEMENTO", price: 1250.00 },
  { value: "CARDEADO (MADERA MACIZA)", price: 60.00 }
];

const pinturaOptions = [
  { value: "PINTURA ELECTROSTÁTICA ECONÓMICA", price: 50.00 },
  { value: "PINTURA ELECTROSTÁTICA MEDIA", price: 70.00 },
  { value: "PINTURA ELECTROSTÁTICA ALTA", price: 80.00 },
  { value: "SATINADO INOXIDABLE", price: 50.00 },
  { value: "PULIDO ESPEJO INOXIDABLE", price: 150.00 },
  { value: "CROMO NEGRO INOXIDABLE", price: 980.00 },
  { value: "CROMO, NÍQUEL, LATÓN", price: 160.00 }
];

// Opciones para MATERIAL en categoría METAL
const materialOptionsMetal = [
  "LAMINA", "PERFIL", "PLACA", "BARRA", "TUBO", "ANGULO", "SOLERA",
  "OTRO (PERFIL, BARRA, ETC.)", "OTRO (LAMINA, PLACA, ETC.)"
];

// Opciones para MATERIAL en categoría MADERA
const materialOptionsMadera = [
  "MDF", "PINO", "TRIPLAY", "LAMINADO", "TRIPLAY FLEXIBLE", "ADHESIVO",
  "MELAMINA", "MDF ENCHAPADO", "PANEL MULTIPERFORADO", "MDF CON LACA",
  "MDF ALTO BRILLO", "CUBRECANTOS", "VIGA", "TABLA DE ROBLE",
  "TABLON BANAK", "BASTON", "OSB", "OTRO (PANEL)", "OTRO (BASTON, VIGA, ETC)"
];

// Cargar materiales desde localStorage
let items = JSON.parse(localStorage.getItem(`catalog_${brandName}_${year}_${project}`) || '[]');
let item = items.find(i => i.clave.toUpperCase() === clave.toUpperCase());
let materials = item && item.materials ? item.materials : [];
let editingIndex = -1;

// Mostrar la imagen y descripción del mobiliario
function displayFurnitureImage() {
  console.log('Items loaded from localStorage:', items);
  console.log('Item found for clave:', item);
  const furnitureImage = document.getElementById('furnitureImage');
  const itemDescription = document.getElementById('itemDescription');
  if (item && item.imagen) {
    console.log('Setting image src to:', item.imagen);
    furnitureImage.src = item.imagen;
    furnitureImage.alt = 'Imagen del Mobiliario';
  } else {
    console.log('No image found, using placeholder');
    furnitureImage.src = 'https://via.placeholder.com/200?text=Sin+Imagen';
    furnitureImage.alt = 'Imagen no disponible';
  }
  if (item && item.descripcion) {
    console.log('Setting description to:', item.descripcion);
    itemDescription.textContent = item.descripcion.toUpperCase();
    itemDescription.title = item.descripcion.toUpperCase();
  } else {
    console.log('No description found, using fallback');
    itemDescription.textContent = '';
    itemDescription.title = 'Sin descripción disponible';
  }
}

// Función para actualizar NO. ELEMENTO por categoría
function updateNoElemento(categoria) {
  const categoryMaterials = materials.filter(m => m.categoria === categoria);
  const maxNoElemento = categoryMaterials.length > 0 ? Math.max(...categoryMaterials.map(m => m.noElemento || 0)) : 0;
  document.getElementById('noElemento').value = editingIndex >= 0 ? materials[editingIndex].noElemento : maxNoElemento + 1;
}

// Función para calcular subtotal y cantidad
function calculateFields() {
  const puElement = document.getElementById('pu');
  const cantidadElement = document.getElementById('cantidad');
  const subtotalElement = document.getElementById('subtotal');
  const materialElement = document.getElementById('material');
  const largoElement = document.getElementById('largo');
  const anchoElement = document.getElementById('ancho');
  const noPiezasElement = document.getElementById('noPiezas');
  const largoMaterialElement = document.getElementById('largoMaterial');
  const anchoMaterialElement = document.getElementById('anchoMaterial');
  const dimensionesMaterialElement = document.getElementById('dimensionesMaterial');

  if (!puElement || !cantidadElement || !subtotalElement) return;

  const categoria = document.getElementById('categoria')?.value || '';
  let cantidad = parseFloat(cantidadElement.value) || 0;

  if (categoria === 'METAL' && materialElement && largoElement && noPiezasElement) {
    const material = materialElement.value;
    const largo = parseFloat(largoElement.value) || 0;
    const noPiezas = parseInt(noPiezasElement.value) || 0;
    const profileMaterials = ['PERFIL', 'BARRA', 'TUBO', 'ANGULO', 'SOLERA'];

    if (profileMaterials.includes(material)) {
      cantidad = (largo / 5800) * noPiezas;
      cantidadElement.value = cantidad.toFixed(4);
    } else if (material === 'OTRO (PERFIL, BARRA, ETC.)' && dimensionesMaterialElement) {
      const dimensionesMaterial = parseFloat(dimensionesMaterialElement.value) || 1;
      cantidad = (largo / dimensionesMaterial) * noPiezas;
      cantidadElement.value = cantidad.toFixed(4);
    } else if (material === 'OTRO (LAMINA, PLACA, ETC.)' && largoMaterialElement && anchoMaterialElement) {
      const largoMaterial = parseFloat(largoMaterialElement.value) || 1;
      const anchoMaterial = parseFloat(anchoMaterialElement.value) || 1;
      const ancho = parseFloat(anchoElement?.value) || 0;
      cantidad = (largo * ancho) / (largoMaterial * anchoMaterial) * noPiezas;
      cantidadElement.value = cantidad.toFixed(4);
    } else if (['LAMINA', 'PLACA'].includes(material) && anchoElement) {
      const ancho = parseFloat(anchoElement.value) || 0;
      cantidad = (largo * ancho) / 3678400 * noPiezas;
      cantidadElement.value = cantidad.toFixed(4);
    }
  } else if (categoria === 'MADERA' && materialElement && largoElement && noPiezasElement) {
    const material = materialElement.value;
    const largo = parseFloat(largoElement.value) || 0;
    const noPiezas = parseInt(noPiezasElement.value) || 0;
    const mdfMaterials = ['MDF', 'TRIPLAY', 'LAMINADO', 'TRIPLAY FLEXIBLE', 'MELAMINA', 'MDF ENCHAPADO', 'PANEL MULTIPERFORADO', 'MDF CON LACA', 'MDF ALTO BRILLO'];
    const pinoMaterials = ['PINO', 'TABLA DE ROBLE'];
    const bastonMaterials = ['BASTON'];
    const otherPanel = ['OTRO (PANEL)'];
    const otherBaston = ['OTRO (BASTON, VIGA, ETC)'];
    const adhesivo = ['ADHESIVO'];

    if (mdfMaterials.includes(material) && anchoElement) {
      const ancho = parseFloat(anchoElement.value) || 0;
      cantidad = ((largo * ancho) / 2976800) * noPiezas;
      cantidadElement.value = cantidad.toFixed(4);
      cantidadElement.setAttribute('readonly', '');
    } else if (pinoMaterials.includes(material) && anchoElement) {
      const ancho = parseFloat(anchoElement.value) || 0;
      cantidad = ((largo * ancho) / 625000) * noPiezas;
      cantidadElement.value = cantidad.toFixed(4);
      cantidadElement.setAttribute('readonly', '');
    } else if (bastonMaterials.includes(material)) {
      cantidad = (largo / 5800) * noPiezas;
      cantidadElement.value = cantidad.toFixed(4);
      cantidadElement.setAttribute('readonly', '');
    } else if (otherPanel.includes(material) && anchoElement && largoMaterialElement && anchoMaterialElement) {
      const ancho = parseFloat(anchoElement.value) || 0;
      const largoMaterial = parseFloat(largoMaterialElement.value) || 1;
      const anchoMaterial = parseFloat(anchoMaterialElement.value) || 1;
      cantidad = ((largo * ancho) / (largoMaterial * anchoMaterial)) * noPiezas;
      cantidadElement.value = cantidad.toFixed(4);
      cantidadElement.setAttribute('readonly', '');
    } else if (otherBaston.includes(material) && dimensionesMaterialElement) {
      const dimensionesMaterial = parseFloat(dimensionesMaterialElement.value) || 1;
      cantidad = (largo / dimensionesMaterial) * noPiezas;
      cantidadElement.value = cantidad.toFixed(4);
      cantidadElement.setAttribute('readonly', '');
    } else if (adhesivo.includes(material)) {
      cantidadElement.removeAttribute('readonly');
    }
  }

  const pu = parseFloat(puElement.value) || 0;
  subtotalElement.value = '$' + (cantidad * pu).toFixed(2);
}

// Función para actualizar el formulario según la categoría y material
function updateFormLayout() {
  const categoria = document.getElementById('categoria')?.value || '';
  const formRow1 = document.getElementById('formRow1');
  const formRow2 = document.getElementById('formRow2');
  const form = document.getElementById('addMaterialForm');

  // Guardar valores actuales
  const currentValues = {
    noElemento: document.getElementById('noElemento')?.value || '',
    categoria: categoria,
    nombrePieza: document.getElementById('nombrePieza')?.value || '',
    material: document.getElementById('material')?.value || '',
    largo: document.getElementById('largo')?.value || '',
    ancho: document.getElementById('ancho')?.value || '',
    noPiezas: document.getElementById('noPiezas')?.value || '',
    largoMaterial: document.getElementById('largoMaterial')?.value || '',
    anchoMaterial: document.getElementById('anchoMaterial')?.value || '',
    dimensionesMaterial: document.getElementById('dimensionesMaterial')?.value || '',
    claveMaterial: document.getElementById('claveMaterial')?.value || '',
    descripcionMaterial: document.getElementById('descripcionMaterial')?.value || '',
    unidad: document.getElementById('unidad')?.value || '',
    cantidad: document.getElementById('cantidad')?.value || '',
    pu: document.getElementById('pu')?.value || '',
    subtotal: document.getElementById('subtotal')?.value || ''
  };

  // Resetear filas
  formRow1.innerHTML = '';
  formRow2.innerHTML = '';
  let formRow3 = form.querySelector('#formRow3');
  if (formRow3) formRow3.remove();
  let formRow4 = form.querySelector('#formRow4');
  if (formRow4) formRow4.remove();

  // Fila 1: Siempre incluye NO. ELEMENTO y CATEGORÍA
  formRow1.innerHTML = `
    <div class="form-group">
      <label for="noElemento">NO. ELEMENTO:</label>
      <input type="text" id="noElemento" readonly>
    </div>
    <div class="form-group">
      <label for="categoria">CATEGORÍA:</label>
      <select id="categoria" required>
        <option value="">Seleccionar categoría</option>
        ${categoryOrder.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
      </select>
    </div>
  `;

  // Definir categorías por tipo de formulario
  const threeRowCategories = ['MADERA', 'MARMOL', 'ACRÍLICO', 'ESPEJO', 'VIDRIO', 'GRAFICOS', 'VINIL ADHERIBLE', 'BACKLIGH', 'TELA/VINIL'];
  const twoRowCategories = ['HERRAJE', 'ELÉCTRICO', 'EMBALAJE', 'MANO DE OBRA', 'EXTERNOS', 'INSUMOS', 'CORTE LASER'];
  const barnizPinturaCategories = ['BARNIZ', 'PINTURA'];

  if (barnizPinturaCategories.includes(categoria)) {
    // Formulario para BARNIZ y PINTURA (2 filas, sin NOMBRE DE LA PIEZA)
    formRow2.innerHTML = `
      <div class="form-group">
        <label for="descripcionMaterial">DESCRIPCIÓN:</label>
        <select id="descripcionMaterial" class="description-field" required>
          <option value="">Seleccionar descripción</option>
          ${(categoria === 'BARNIZ' ? barnizOptions : pinturaOptions).map(opt => `<option value="${opt.value}">${opt.value}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label for="unidad">UNIDAD:</label>
        <select id="unidad" class="fixed-width" required>
          <option value="">Seleccionar unidad</option>
          <option value="PIEZA">PIEZA</option>
          <option value="LT">LT</option>
          <option value="ML">ML</option>
          <option value="M2">M2</option>
          <option value="METROS">METROS</option>
          <option value="PAR">PAR</option>
        </select>
      </div>
      <div class="form-group">
        <label for="cantidad">CANTIDAD:</label>
        <input type="number" id="cantidad" class="fixed-width" step="0.0001" required>
      </div>
      <div class="form-group pu-input">
        <label for="pu">PRECIO UNITARIO:</label>
        <input type="number" id="pu" class="fixed-width" min="0" step="0.01" required>
      </div>
      <div class="form-group pu-input">
        <label for="subtotal">SUBTOTAL:</label>
        <input type="text" id="subtotal" class="fixed-width" readonly>
      </div>
    `;
    const descripcionMaterial = document.getElementById('descripcionMaterial');
    if (descripcionMaterial) descripcionMaterial.addEventListener('change', updateFieldsBasedOnDescription);
  } else if (categoria === 'METAL') {
    // Formulario para METAL (3 o 4 filas, con MATERIAL como dropdown)
    formRow1.innerHTML += `
      <div class="form-group" id="nombrePiezaGroup">
        <label for="nombrePieza">NOMBRE DE LA PIEZA:</label>
        <input type="text" id="nombrePieza" required>
      </div>
    `;
    formRow2.innerHTML = `
      <div class="form-group" id="materialGroup">
        <label for="material">MATERIAL:</label>
        <select id="material" required>
          <option value="">Seleccionar material</option>
          ${materialOptionsMetal.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
        </select>
      </div>
    `;
    // Función para actualizar filas según el material seleccionado
    function updateMetalFormRow() {
      const material = document.getElementById('material')?.value || '';
      const profileMaterials = ['PERFIL', 'BARRA', 'TUBO', 'ANGULO', 'SOLERA'];
      const sheetMaterials = ['LAMINA', 'PLACA'];

      // Guardar valores actuales
      const currentRowValues = {
        material: document.getElementById('material')?.value || currentValues.material,
        largo: document.getElementById('largo')?.value || currentValues.largo,
        ancho: document.getElementById('ancho')?.value || currentValues.ancho,
        noPiezas: document.getElementById('noPiezas')?.value || currentValues.noPiezas,
        largoMaterial: document.getElementById('largoMaterial')?.value || currentValues.largoMaterial,
        anchoMaterial: document.getElementById('anchoMaterial')?.value || currentValues.anchoMaterial,
        dimensionesMaterial: document.getElementById('dimensionesMaterial')?.value || currentValues.dimensionesMaterial,
        claveMaterial: document.getElementById('claveMaterial')?.value || currentValues.claveMaterial,
        descripcionMaterial: document.getElementById('descripcionMaterial')?.value || currentValues.descripcionMaterial,
        unidad: document.getElementById('unidad')?.value || currentValues.unidad,
        cantidad: document.getElementById('cantidad')?.value || currentValues.cantidad,
        pu: document.getElementById('pu')?.value || currentValues.pu,
        subtotal: document.getElementById('subtotal')?.value || currentValues.subtotal
      };

      // Resetear filas adicionales
      let formRow3 = form.querySelector('#formRow3');
      if (formRow3) formRow3.remove();
      let formRow4 = form.querySelector('#formRow4');
      if (formRow4) formRow4.remove();

      if (profileMaterials.includes(material)) {
        // 3 filas: Fila 1 (NO. ELEMENTO, CATEGORÍA, NOMBRE PIEZA), Fila 2 (MATERIAL, LARGO, NO. PIEZAS), Fila 3 (CLAVE, DESCRIPCIÓN, UNIDAD, CANTIDAD, PU, SUBTOTAL)
        formRow2.innerHTML = `
          <div class="form-group" id="materialGroup">
            <label for="material">MATERIAL:</label>
            <select id="material" required>
              <option value="">Seleccionar material</option>
              ${materialOptionsMetal.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
            </select>
          </div>
          <div class="form-group" id="largoGroup">
            <label for="largo">LARGO (MM):</label>
            <input type="number" id="largo" min="0" step="0.1" required>
          </div>
          <div class="form-group" id="noPiezasGroup">
            <label for="noPiezas">NO. PIEZAS:</label>
            <input type="number" id="noPiezas" min="1" step="1" required>
          </div>
        `;
        const formRow3 = document.createElement('div');
        formRow3.className = 'form-row';
        formRow3.id = 'formRow3';
        formRow3.innerHTML = `
          <div class="form-group">
            <label for="claveMaterial">CLAVE:</label>
            <input type="text" id="claveMaterial" class="fixed-width" required>
          </div>
          <div class="form-group">
            <label for="descripcionMaterial">DESCRIPCIÓN:</label>
            <textarea id="descripcionMaterial" class="description-field" required></textarea>
          </div>
          <div class="form-group">
            <label for="unidad">UNIDAD:</label>
            <select id="unidad" class="fixed-width" required>
              <option value="">Seleccionar unidad</option>
              <option value="PIEZA">PIEZA</option>
              <option value="LT">LT</option>
              <option value="ML">ML</option>
              <option value="M2">M2</option>
              <option value="METROS">METROS</option>
              <option value="PAR">PAR</option>
            </select>
          </div>
          <div class="form-group">
            <label for="cantidad">CANTIDAD:</label>
            <input type="number" id="cantidad" class="fixed-width" step="0.0001" required readonly>
          </div>
          <div class="form-group pu-input">
            <label for="pu">PRECIO UNITARIO:</label>
            <input type="number" id="pu" class="fixed-width" min="0" step="0.01" required>
          </div>
          <div class="form-group pu-input">
            <label for="subtotal">SUBTOTAL:</label>
            <input type="text" id="subtotal" class="fixed-width" readonly>
          </div>
        `;
        form.insertBefore(formRow3, form.querySelector('.button-group'));
      } else if (material === 'OTRO (PERFIL, BARRA, ETC.)') {
        // 3 filas: Fila 1 (NO. ELEMENTO, CATEGORÍA, NOMBRE PIEZA), Fila 2 (MATERIAL, LARGO, NO. PIEZAS, DIMENSIONES MATERIAL), Fila 3 (CLAVE, DESCRIPCIÓN, UNIDAD, CANTIDAD, PU, SUBTOTAL)
        formRow2.innerHTML = `
          <div class="form-group" id="materialGroup">
            <label for="material">MATERIAL:</label>
            <select id="material" required>
              <option value="">Seleccionar material</option>
              ${materialOptionsMetal.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
            </select>
          </div>
          <div class="form-group" id="largoGroup">
            <label for="largo">LARGO (MM):</label>
            <input type="number" id="largo" min="0" step="0.1" required>
          </div>
          <div class="form-group" id="noPiezasGroup">
            <label for="noPiezas">NO. PIEZAS:</label>
            <input type="number" id="noPiezas" min="1" step="1" required>
          </div>
          <div class="form-group" id="dimensionesMaterialGroup">
            <label for="dimensionesMaterial">DIMENSIONES DE MATERIAL (MM):</label>
            <input type="number" id="dimensionesMaterial" min="0" step="0.1" required>
          </div>
        `;
        const formRow3 = document.createElement('div');
        formRow3.className = 'form-row';
        formRow3.id = 'formRow3';
        formRow3.innerHTML = `
          <div class="form-group">
            <label for="claveMaterial">CLAVE:</label>
            <input type="text" id="claveMaterial" class="fixed-width" required>
          </div>
          <div class="form-group">
            <label for="descripcionMaterial">DESCRIPCIÓN:</label>
            <textarea id="descripcionMaterial" class="description-field" required></textarea>
          </div>
          <div class="form-group">
            <label for="unidad">UNIDAD:</label>
            <select id="unidad" class="fixed-width" required>
              <option value="">Seleccionar unidad</option>
              <option value="PIEZA">PIEZA</option>
              <option value="LT">LT</option>
              <option value="ML">ML</option>
              <option value="M2">M2</option>
              <option value="METROS">METROS</option>
              <option value="PAR">PAR</option>
            </select>
          </div>
          <div class="form-group">
            <label for="cantidad">CANTIDAD:</label>
            <input type="number" id="cantidad" class="fixed-width" step="0.0001" required readonly>
          </div>
          <div class="form-group pu-input">
            <label for="pu">PRECIO UNITARIO:</label>
            <input type="number" id="pu" class="fixed-width" min="0" step="0.01" required>
          </div>
          <div class="form-group pu-input">
            <label for="subtotal">SUBTOTAL:</label>
            <input type="text" id="subtotal" class="fixed-width" readonly>
          </div>
        `;
        form.insertBefore(formRow3, form.querySelector('.button-group'));
      } else if (material === 'OTRO (LAMINA, PLACA, ETC.)') {
        // 4 filas: Fila 1 (NO. ELEMENTO, CATEGORÍA, NOMBRE PIEZA), Fila 2 (MATERIAL, LARGO, ANCHO, NO. PIEZAS), Fila 3 (LARGO MATERIAL, ANCHO MATERIAL), Fila 4 (CLAVE, DESCRIPCIÓN, UNIDAD, CANTIDAD, PU, SUBTOTAL)
        formRow2.innerHTML = `
          <div class="form-group" id="materialGroup">
            <label for="material">MATERIAL:</label>
            <select id="material" required>
              <option value="">Seleccionar material</option>
              ${materialOptionsMetal.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
            </select>
          </div>
          <div class="form-group" id="largoGroup">
            <label for="largo">LARGO (MM):</label>
            <input type="number" id="largo" min="0" step="0.1" required>
          </div>
          <div class="form-group" id="anchoGroup">
            <label for="ancho">ANCHO (MM):</label>
            <input type="number" id="ancho" min="0" step="0.1" required>
          </div>
          <div class="form-group" id="noPiezasGroup">
            <label for="noPiezas">NO. PIEZAS:</label>
            <input type="number" id="noPiezas" min="1" step="1" required>
          </div>
        `;
        const formRow3 = document.createElement('div');
        formRow3.className = 'form-row';
        formRow3.id = 'formRow3';
        formRow3.innerHTML = `
          <div class="form-group" id="largoMaterialGroup">
            <label for="largoMaterial">LARGO DE MATERIAL (MM):</label>
            <input type="number" id="largoMaterial" min="0" step="0.1" required>
          </div>
          <div class="form-group" id="anchoMaterialGroup">
            <label for="anchoMaterial">ANCHO DE MATERIAL (MM):</label>
            <input type="number" id="anchoMaterial" min="0" step="0.1" required>
          </div>
        `;
        form.insertBefore(formRow3, form.querySelector('.button-group'));
        const formRow4 = document.createElement('div');
        formRow4.className = 'form-row';
        formRow4.id = 'formRow4';
        formRow4.innerHTML = `
          <div class="form-group">
            <label for="claveMaterial">CLAVE:</label>
            <input type="text" id="claveMaterial" class="fixed-width" required>
          </div>
          <div class="form-group">
            <label for="descripcionMaterial">DESCRIPCIÓN:</label>
            <textarea id="descripcionMaterial" class="description-field" required></textarea>
          </div>
          <div class="form-group">
            <label for="unidad">UNIDAD:</label>
            <select id="unidad" class="fixed-width" required>
              <option value="">Seleccionar unidad</option>
              <option value="PIEZA">PIEZA</option>
              <option value="LT">LT</option>
              <option value="ML">ML</option>
              <option value="M2">M2</option>
              <option value="METROS">METROS</option>
              <option value="PAR">PAR</option>
            </select>
          </div>
          <div class="form-group">
            <label for="cantidad">CANTIDAD:</label>
            <input type="number" id="cantidad" class="fixed-width" step="0.0001" required readonly>
          </div>
          <div class="form-group pu-input">
            <label for="pu">PRECIO UNITARIO:</label>
            <input type="number" id="pu" class="fixed-width" min="0" step="0.01" required>
          </div>
          <div class="form-group pu-input">
            <label for="subtotal">SUBTOTAL:</label>
            <input type="text" id="subtotal" class="fixed-width" readonly>
          </div>
        `;
        form.insertBefore(formRow4, form.querySelector('.button-group'));
      } else if (sheetMaterials.includes(material)) {
        // 3 filas: Fila 1 (NO. ELEMENTO, CATEGORÍA, NOMBRE PIEZA), Fila 2 (MATERIAL, LARGO, ANCHO, NO. PIEZAS), Fila 3 (CLAVE, DESCRIPCIÓN, UNIDAD, CANTIDAD, PU, SUBTOTAL)
        formRow2.innerHTML = `
          <div class="form-group" id="materialGroup">
            <label for="material">MATERIAL:</label>
            <select id="material" required>
              <option value="">Seleccionar material</option>
              ${materialOptionsMetal.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
            </select>
          </div>
          <div class="form-group" id="largoGroup">
            <label for="largo">LARGO (MM):</label>
            <input type="number" id="largo" min="0" step="0.1" required>
          </div>
          <div class="form-group" id="anchoGroup">
            <label for="ancho">ANCHO (MM):</label>
            <input type="number" id="ancho" min="0" step="0.1" required>
          </div>
          <div class="form-group" id="noPiezasGroup">
            <label for="noPiezas">NO. PIEZAS:</label>
            <input type="number" id="noPiezas" min="1" step="1" required>
          </div>
        `;
        const formRow3 = document.createElement('div');
        formRow3.className = 'form-row';
        formRow3.id = 'formRow3';
        formRow3.innerHTML = `
          <div class="form-group">
            <label for="claveMaterial">CLAVE:</label>
            <input type="text" id="claveMaterial" class="fixed-width" required>
          </div>
          <div class="form-group">
            <label for="descripcionMaterial">DESCRIPCIÓN:</label>
            <textarea id="descripcionMaterial" class="description-field" required></textarea>
          </div>
          <div class="form-group">
            <label for="unidad">UNIDAD:</label>
            <select id="unidad" class="fixed-width" required>
              <option value="">Seleccionar unidad</option>
              <option value="PIEZA">PIEZA</option>
              <option value="LT">LT</option>
              <option value="ML">ML</option>
              <option value="M2">M2</option>
              <option value="METROS">METROS</option>
              <option value="PAR">PAR</option>
            </select>
          </div>
          <div class="form-group">
            <label for="cantidad">CANTIDAD:</label>
            <input type="number" id="cantidad" class="fixed-width" step="0.0001" required readonly>
          </div>
          <div class="form-group pu-input">
            <label for="pu">PRECIO UNITARIO:</label>
            <input type="number" id="pu" class="fixed-width" min="0" step="0.01" required>
          </div>
          <div class="form-group pu-input">
            <label for="subtotal">SUBTOTAL:</label>
            <input type="text" id="subtotal" class="fixed-width" readonly>
          </div>
        `;
        form.insertBefore(formRow3, form.querySelector('.button-group'));
      } else {
        // Default case: only MATERIAL in formRow2
        formRow2.innerHTML = `
          <div class="form-group" id="materialGroup">
            <label for="material">MATERIAL:</label>
            <select id="material" required>
              <option value="">Seleccionar material</option>
              ${materialOptionsMetal.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
            </select>
          </div>
        `;
        const formRow3 = document.createElement('div');
        formRow3.className = 'form-row';
        formRow3.id = 'formRow3';
        formRow3.innerHTML = `
          <div class="form-group">
            <label for="claveMaterial">CLAVE:</label>
            <input type="text" id="claveMaterial" class="fixed-width" required>
          </div>
          <div class="form-group">
            <label for="descripcionMaterial">DESCRIPCIÓN:</label>
            <textarea id="descripcionMaterial" class="description-field" required></textarea>
          </div>
          <div class="form-group">
            <label for="unidad">UNIDAD:</label>
            <select id="unidad" class="fixed-width" required>
              <option value="">Seleccionar unidad</option>
              <option value="PIEZA">PIEZA</option>
              <option value="LT">LT</option>
              <option value="ML">ML</option>
              <option value="M2">M2</option>
              <option value="METROS">METROS</option>
              <option value="PAR">PAR</option>
            </select>
          </div>
          <div class="form-group">
            <label for="cantidad">CANTIDAD:</label>
            <input type="number" id="cantidad" class="fixed-width" step="0.0001" required readonly>
          </div>
          <div class="form-group pu-input">
            <label for="pu">PRECIO UNITARIO:</label>
            <input type="number" id="pu" class="fixed-width" min="0" step="0.01" required>
          </div>
          <div class="form-group pu-input">
            <label for="subtotal">SUBTOTAL:</label>
            <input type="text" id="subtotal" class="fixed-width" readonly>
          </div>
        `;
        form.insertBefore(formRow3, form.querySelector('.button-group'));
      }

      // Restaurar valores
      const materialElement = document.getElementById('material');
      if (materialElement) materialElement.value = currentRowValues.material;
      const largoElement = document.getElementById('largo');
      if (largoElement) largoElement.value = currentRowValues.largo;
      const anchoElement = document.getElementById('ancho');
      if (anchoElement) anchoElement.value = currentRowValues.ancho;
      const noPiezasElement = document.getElementById('noPiezas');
      if (noPiezasElement) noPiezasElement.value = currentRowValues.noPiezas;
      const largoMaterialElement = document.getElementById('largoMaterial');
      if (largoMaterialElement) largoMaterialElement.value = currentRowValues.largoMaterial;
      const anchoMaterialElement = document.getElementById('anchoMaterial');
      if (anchoMaterialElement) anchoMaterialElement.value = currentRowValues.anchoMaterial;
      const dimensionesMaterialElement = document.getElementById('dimensionesMaterial');
      if (dimensionesMaterialElement) dimensionesMaterialElement.value = currentRowValues.dimensionesMaterial;
      const claveMaterialElement = document.getElementById('claveMaterial');
      if (claveMaterialElement) claveMaterialElement.value = currentRowValues.claveMaterial;
      const descripcionMaterialElement = document.getElementById('descripcionMaterial');
      if (descripcionMaterialElement) descripcionMaterialElement.value = currentRowValues.descripcionMaterial;
      const unidadElement = document.getElementById('unidad');
      if (unidadElement) unidadElement.value = currentRowValues.unidad;
      const cantidadElement = document.getElementById('cantidad');
      if (cantidadElement) cantidadElement.value = currentRowValues.cantidad;
      const puElement = document.getElementById('pu');
      if (puElement) puElement.value = currentRowValues.pu;
      const subtotalElement = document.getElementById('subtotal');
      if (subtotalElement) subtotalElement.value = currentRowValues.subtotal;

      // Reasignar evento de cambio al dropdown de material
      if (materialElement) {
        materialElement.removeEventListener('change', updateMetalFormRow);
        materialElement.addEventListener('change', updateMetalFormRow);
      }

      // Reasignar eventos de cálculo a campos numéricos
      const inputIds = ['largo', 'ancho', 'noPiezas', 'largoMaterial', 'anchoMaterial', 'dimensionesMaterial', 'pu'];
      inputIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          element.removeEventListener('input', calculateFields);
          element.addEventListener('input', calculateFields);
        }
      });

      calculateFields();
    }
  } else if (categoria === 'MADERA') {
    // Formulario para MADERA (3 filas, con MATERIAL como dropdown)
    formRow1.innerHTML += `
      <div class="form-group" id="nombrePiezaGroup">
        <label for="nombrePieza">NOMBRE DE LA PIEZA:</label>
        <input type="text" id="nombrePieza" required>
      </div>
    `;
    formRow2.innerHTML = `
      <div class="form-group" id="materialGroup">
        <label for="material">MATERIAL:</label>
        <select id="material" required>
          <option value="">Seleccionar material</option>
          ${materialOptionsMadera.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
        </select>
      </div>
      <div class="form-group" id="largoGroup">
        <label for="largo">LARGO (MM):</label>
        <input type="number" id="largo" min="0" step="0.1" required>
      </div>
      <div class="form-group" id="anchoGroup">
        <label for="ancho">ANCHO (MM):</label>
        <input type="number" id="ancho" min="0" step="0.1" required>
      </div>
      <div class="form-group" id="noPiezasGroup">
        <label for="noPiezas">NO. PIEZAS:</label>
        <input type="number" id="noPiezas" min="1" step="1" required>
      </div>
    `;
    const formRow3 = document.createElement('div');
    formRow3.className = 'form-row';
    formRow3.id = 'formRow3';
    formRow3.innerHTML = `
      <div class="form-group">
        <label for="claveMaterial">CLAVE:</label>
        <input type="text" id="claveMaterial" class="fixed-width" required>
      </div>
      <div class="form-group">
        <label for="descripcionMaterial">DESCRIPCIÓN:</label>
        <textarea id="descripcionMaterial" class="description-field" required></textarea>
      </div>
      <div class="form-group">
        <label for="unidad">UNIDAD:</label>
        <select id="unidad" class="fixed-width" required>
          <option value="">Seleccionar unidad</option>
          <option value="PIEZA">PIEZA</option>
          <option value="LT">LT</option>
          <option value="ML">ML</option>
          <option value="M2">M2</option>
          <option value="METROS">METROS</option>
          <option value="PAR">PAR</option>
        </select>
      </div>
      <div class="form-group">
        <label for="cantidad">CANTIDAD:</label>
        <input type="number" id="cantidad" class="fixed-width" step="0.0001" required readonly>
      </div>
      <div class="form-group pu-input">
        <label for="pu">PRECIO UNITARIO:</label>
        <input type="number" id="pu" class="fixed-width" min="0" step="0.01" required>
      </div>
      <div class="form-group pu-input">
        <label for="subtotal">SUBTOTAL:</label>
        <input type="text" id="subtotal" class="fixed-width" readonly>
      </div>
    `;
    form.insertBefore(formRow3, form.querySelector('.button-group'));

    // Añadir evento para actualizar cantidad según material seleccionado
    const materialElement = document.getElementById('material');
    if (materialElement) {
      materialElement.addEventListener('change', calculateFields);
    }
  } else if (threeRowCategories.includes(categoria)) {
    // Formulario de 3 filas para MARMOL, ACRÍLICO, ESPEJO, VIDRIO, GRAFICOS, VINIL ADHERIBLE, BACKLIGH, TELA/VINIL
    formRow1.innerHTML += `
      <div class="form-group" id="nombrePiezaGroup">
        <label for="nombrePieza">NOMBRE DE LA PIEZA:</label>
        <input type="text" id="nombrePieza" required>
      </div>
    `;
    formRow2.innerHTML = `
      <div class="form-group" id="materialGroup">
        <label for="material">MATERIAL:</label>
        <input type="text" id="material" required>
      </div>
      <div class="form-group" id="largoGroup">
        <label for="largo">LARGO (MM):</label>
        <input type="number" id="largo" min="0" step="0.1" required>
      </div>
      <div class="form-group" id="anchoGroup">
        <label for="ancho">ANCHO (MM):</label>
        <input type="number" id="ancho" min="0" step="0.1" required>
      </div>
      <div class="form-group" id="noPiezasGroup">
        <label for="noPiezas">NO. PIEZAS:</label>
        <input type="number" id="noPiezas" min="1" step="1" required>
      </div>
    `;
    const formRow3 = document.createElement('div');
    formRow3.className = 'form-row';
    formRow3.id = 'formRow3';
    formRow3.innerHTML = `
      <div class="form-group">
        <label for="claveMaterial">CLAVE:</label>
        <input type="text" id="claveMaterial" class="fixed-width" required>
      </div>
      <div class="form-group">
        <label for="descripcionMaterial">DESCRIPCIÓN:</label>
        <textarea id="descripcionMaterial" class="description-field" required></textarea>
      </div>
      <div class="form-group">
        <label for="unidad">UNIDAD:</label>
        <select id="unidad" class="fixed-width" required>
          <option value="">Seleccionar unidad</option>
          <option value="PIEZA">PIEZA</option>
          <option value="LT">LT</option>
          <option value="ML">ML</option>
          <option value="M2">M2</option>
          <option value="METROS">METROS</option>
          <option value="PAR">PAR</option>
        </select>
      </div>
      <div class="form-group">
        <label for="cantidad">CANTIDAD:</label>
        <input type="number" id="cantidad" class="fixed-width" step="0.0001" required>
      </div>
      <div class="form-group pu-input">
        <label for="pu">PRECIO UNITARIO:</label>
        <input type="number" id="pu" class="fixed-width" min="0" step="0.01" required>
      </div>
      <div class="form-group pu-input">
        <label for="subtotal">SUBTOTAL:</label>
        <input type="text" id="subtotal" class="fixed-width" readonly>
      </div>
    `;
    form.insertBefore(formRow3, form.querySelector('.button-group'));
  } else if (twoRowCategories.includes(categoria)) {
    // Formulario de 2 filas para HERRAJE, ELÉCTRICO, EMBALAJE, MANO DE OBRA, EXTERNOS, INSUMOS, CORTE LASER
    formRow2.innerHTML = `
      <div class="form-group">
        <label for="claveMaterial">CLAVE:</label>
        <input type="text" id="claveMaterial" class="fixed-width" required>
      </div>
      <div class="form-group">
        <label for="descripcionMaterial">DESCRIPCIÓN:</label>
        <textarea id="descripcionMaterial" class="description-field" required></textarea>
      </div>
      <div class="form-group">
        <label for="unidad">UNIDAD:</label>
        <select id="unidad" class="fixed-width" required>
          <option value="">Seleccionar unidad</option>
          <option value="PIEZA">PIEZA</option>
          <option value="LT">LT</option>
          <option value="ML">ML</option>
          <option value="M2">M2</option>
          <option value="METROS">METROS</option>
          <option value="PAR">PAR</option>
        </select>
      </div>
      <div class="form-group">
        <label for="cantidad">CANTIDAD:</label>
        <input type="number" id="cantidad" class="fixed-width" step="0.0001" required>
      </div>
      <div class="form-group pu-input">
        <label for="pu">PRECIO UNITARIO:</label>
        <input type="number" id="pu" class="fixed-width" min="0" step="0.01" required>
      </div>
      <div class="form-group pu-input">
        <label for="subtotal">SUBTOTAL:</label>
        <input type="text" id="subtotal" class="fixed-width" readonly>
      </div>
    `;
  } else {
    // Formulario por defecto (2 filas) para categorías no especificadas
    formRow2.innerHTML = `
      <div class="form-group">
        <label for="claveMaterial">CLAVE:</label>
        <input type="text" id="claveMaterial" class="fixed-width" required>
      </div>
      <div class="form-group">
        <label for="descripcionMaterial">DESCRIPCIÓN:</label>
        <textarea id="descripcionMaterial" class="description-field" required></textarea>
      </div>
      <div class="form-group">
        <label for="unidad">UNIDAD:</label>
        <select id="unidad" class="fixed-width" required>
          <option value="">Seleccionar unidad</option>
          <option value="PIEZA">PIEZA</option>
          <option value="LT">LT</option>
          <option value="ML">ML</option>
          <option value="M2">M2</option>
          <option value="METROS">METROS</option>
          <option value="PAR">PAR</option>
        </select>
      </div>
      <div class="form-group">
        <label for="cantidad">CANTIDAD:</label>
        <input type="number" id="cantidad" class="fixed-width" step="0.0001" required>
      </div>
      <div class="form-group pu-input">
        <label for="pu">PRECIO UNITARIO:</label>
        <input type="number" id="pu" class="fixed-width" min="0" step="0.01" required>
      </div>
      <div class="form-group pu-input">
        <label for="subtotal">SUBTOTAL:</label>
        <input type="text" id="subtotal" class="fixed-width" readonly>
      </div>
    `;
  }

  // Restaurar valores
  document.getElementById('noElemento').value = currentValues.noElemento;
  document.getElementById('categoria').value = currentValues.categoria;
  const nombrePieza = document.getElementById('nombrePieza');
  if (nombrePieza) nombrePieza.value = currentValues.nombrePieza;
  const material = document.getElementById('material');
  if (material) material.value = currentValues.material;
  const largo = document.getElementById('largo');
  if (largo) largo.value = currentValues.largo;
  const ancho = document.getElementById('ancho');
  if (ancho) ancho.value = currentValues.ancho;
  const noPiezas = document.getElementById('noPiezas');
  if (noPiezas) noPiezas.value = currentValues.noPiezas;
  const largoMaterial = document.getElementById('largoMaterial');
  if (largoMaterial) largoMaterial.value = currentValues.largoMaterial;
  const anchoMaterial = document.getElementById('anchoMaterial');
  if (anchoMaterial) anchoMaterial.value = currentValues.anchoMaterial;
  const dimensionesMaterial = document.getElementById('dimensionesMaterial');
  if (dimensionesMaterial) dimensionesMaterial.value = currentValues.dimensionesMaterial;
  const claveMaterial = document.getElementById('claveMaterial');
  if (claveMaterial) claveMaterial.value = currentValues.claveMaterial;
  const descripcionMaterial = document.getElementById('descripcionMaterial');
  if (descripcionMaterial) descripcionMaterial.value = currentValues.descripcionMaterial;
  const unidad = document.getElementById('unidad');
  if (unidad) unidad.value = currentValues.unidad;
  const cantidad = document.getElementById('cantidad');
  if (cantidad) cantidad.value = currentValues.cantidad;
  const pu = document.getElementById('pu');
  if (pu) pu.value = currentValues.pu;
  const subtotal = document.getElementById('subtotal');
  if (subtotal) subtotal.value = currentValues.subtotal;

  // Reasignar eventos solo a elementos existentes
  const inputIds = ['largo', 'ancho', 'noPiezas', 'pu', 'largoMaterial', 'anchoMaterial', 'dimensionesMaterial'];
  inputIds.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.removeEventListener('input', calculateFields);
      element.addEventListener('input', calculateFields);
    }
  });

  // Reasignar evento de cambio de categoría
  const categoriaElement = document.getElementById('categoria');
  if (categoriaElement) {
    categoriaElement.removeEventListener('change', handleCategoryChange);
    categoriaElement.addEventListener('change', handleCategoryChange);
  }

  // Actualizar campos para BARNIZ y PINTURA si aplica
  if (barnizPinturaCategories.includes(categoria) && currentValues.descripcionMaterial) {
    updateFieldsBasedOnDescription();
  }

  // Actualizar formRow para METAL si aplica
  if (categoria === 'METAL') {
    updateMetalFormRow();
  }

  // Actualizar cantidad si aplica
  calculateFields();
}

// Función para manejar el cambio de categoría
function handleCategoryChange() {
  const categoriaElement = document.getElementById('categoria');
  if (categoriaElement) {
    updateNoElemento(categoriaElement.value);
    updateFormLayout();
  }
}

// Función para actualizar unidad y precio unitario según descripción
function updateFieldsBasedOnDescription() {
  const categoria = document.getElementById('categoria')?.value || '';
  const descripcion = document.getElementById('descripcionMaterial')?.value || '';
  const unidad = document.getElementById('unidad');
  const pu = document.getElementById('pu');

  if (categoria === 'BARNIZ' && unidad && pu) {
    unidad.value = 'M2';
    const option = barnizOptions.find(opt => opt.value === descripcion);
    if (option) {
      pu.value = option.price.toFixed(2);
    }
  } else if (categoria === 'PINTURA' && unidad && pu) {
    unidad.value = 'ML';
    const option = pinturaOptions.find(opt => opt.value === descripcion);
    if (option) {
      pu.value = option.price.toFixed(2);
    }
  }
  calculateFields();
}

// Función para guardar items en localStorage
function saveItems(updatedMaterials) {
  const itemIndex = items.findIndex(i => i.clave.toUpperCase() === clave.toUpperCase());
  if (itemIndex !== -1) {
    items[itemIndex].materials = updatedMaterials;
    localStorage.setItem(`catalog_${brandName}_${year}_${project}`, JSON.stringify(items));
  }
}

// Función para renderizar tablas por categoría
function renderTable() {
  const orderMap = new Map(categoryOrder.map((cat, idx) => [cat, idx]));
  materials.sort((a, b) => {
    const orderA = orderMap.get(a.categoria) ?? Infinity;
    const orderB = orderMap.get(b.categoria) ?? Infinity;
    return orderA - orderB;
  });
  const groupedMaterials = materials.reduce((acc, material) => {
    if (!acc[material.categoria]) {
      acc[material.categoria] = [];
    }
    acc[material.categoria].push(material);
    return acc;
  }, {});
  for (const category in groupedMaterials) {
    groupedMaterials[category].sort((a, b) => (a.noElemento || 0) - (b.noElemento || 0));
    groupedMaterials[category].forEach((m, i) => {
      m.noElemento = i + 1;
    });
  }
  const categoryTables = document.getElementById('categoryTables');
  categoryTables.innerHTML = '';
  const reducedColumnCategories = ['PINTURA', 'BARNIZ', 'HERRAJE', 'ELÉCTRICO', 'EMBALAJE', 'MANO DE OBRA', 'EXTERNOS', 'INSUMOS', 'CORTE LASER'];
  categoryOrder.forEach(category => {
    if (groupedMaterials[category] && groupedMaterials[category].length > 0) {
      const section = document.createElement('div');
      section.className = 'category-section';
      const title = document.createElement('div');
      title.className = 'category-title';
      title.textContent = category;
      section.appendChild(title);
      const table = document.createElement('table');
      table.id = 'materialsTable';
      table.className = 'table table-striped';
      if (reducedColumnCategories.includes(category)) {
        table.classList.add('reduced-columns');
        table.innerHTML = `
          <thead>
            <tr>
              <th class="description-cell">DESCRIPCIÓN</th>
              <th class="fixed-column clave-unidad-pu-subtotal">UNIDAD</th>
              <th class="fixed-column piezas-cantidad">CANTIDAD</th>
              <th class="fixed-column clave-unidad-pu-subtotal">P.U.</th>
              <th class="fixed-column clave-unidad-pu-subtotal">SUBTOTAL</th>
              <th class="fixed-column">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        `;
        const tbody = table.querySelector('tbody');
        groupedMaterials[category].forEach((material, index) => {
          const globalIndex = materials.findIndex(m => m.noElemento === material.noElemento && m.categoria === material.categoria);
          const row = document.createElement('tr');
          row.innerHTML = `
            <td class="description-cell" title="${material.descripcionMaterial}">${material.descripcionMaterial}</td>
            <td class="fixed-column clave-unidad-pu-subtotal">${material.unidad}</td>
            <td class="fixed-column piezas-cantidad">${material.cantidad.toFixed(4)}</td>
            <td class="fixed-column clave-unidad-pu-subtotal">$${material.pu.toFixed(2)}</td>
            <td class="fixed-column clave-unidad-pu-subtotal">$${material.subtotal.toFixed(2)}</td>
            <td class="actions-cell">
              <button class="btn btn-warning btn-sm" onclick="editMaterial(${globalIndex})">EDITAR</button>
              <button class="btn btn-danger btn-sm" onclick="deleteMaterial(${globalIndex})">ELIMINAR</button>
            </td>
          `;
          tbody.appendChild(row);
        });
      } else {
        table.innerHTML = `
          <thead>
            <tr>
              <th class="fixed-column">NO.</th>
              <th class="nombre-pieza">NOMBRE DE PIEZA</th>
              <th class="fixed-column" style="width: 77px; min-width: 77px; max-width: 77px;">LARGO</th>
              <th class="fixed-column" style="width: 77px; min-width: 77px; max-width: 77px;">ANCHO</th>
              <th class="fixed-column piezas-cantidad">PIEZAS</th>
              <th class="fixed-column clave-unidad-pu-subtotal">CLAVE</th>
              <th class="description-cell">DESCRIPCIÓN</th>
              <th class="fixed-column clave-unidad-pu-subtotal">UNIDAD</th>
              <th class="fixed-column piezas-cantidad">CANTIDAD</th>
              <th class="fixed-column clave-unidad-pu-subtotal">P.U.</th>
              <th class="fixed-column clave-unidad-pu-subtotal">SUBTOTAL</th>
              <th class="fixed-column">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        `;
        const tbody = table.querySelector('tbody');
        groupedMaterials[category].forEach((material, index) => {
          const globalIndex = materials.findIndex(m => m.noElemento === material.noElemento && m.categoria === material.categoria);
          const row = document.createElement('tr');
          row.innerHTML = `
            <td class="fixed-column">${material.noElemento}</td>
            <td class="nombre-pieza" title="${material.nombrePieza || ''}">${(material.nombrePieza || '').length > 15 ? (material.nombrePieza || '').substring(0, 15) + '...' : (material.nombrePieza || '')}</td>
            <td class="fixed-column" style="width: 77px; min-width: 77px; max-width: 77px;">${material.largo || ''}</td>
            <td class="fixed-column" style="width: 77px; min-width: 77px; max-width: 77px;">${material.ancho || ''}</td>
            <td class="fixed-column piezas-cantidad">${material.noPiezas || ''}</td>
            <td class="fixed-column clave-unidad-pu-subtotal">${material.claveMaterial || ''}</td>
            <td class="description-cell" title="${material.descripcionMaterial}">${material.descripcionMaterial}</td>
            <td class="fixed-column clave-unidad-pu-subtotal">${material.unidad}</td>
            <td class="fixed-column piezas-cantidad">${material.cantidad.toFixed(4)}</td>
            <td class="fixed-column clave-unidad-pu-subtotal">$${material.pu.toFixed(2)}</td>
            <td class="fixed-column clave-unidad-pu-subtotal">$${material.subtotal.toFixed(2)}</td>
            <td class="actions-cell">
              <button class="btn btn-warning btn-sm" onclick="editMaterial(${globalIndex})">EDITAR</button>
              <button class="btn btn-danger btn-sm" onclick="deleteMaterial(${globalIndex})">ELIMINAR</button>
            </td>
          `;
          tbody.appendChild(row);
        });
      }
      section.appendChild(table);
      categoryTables.appendChild(section);
    }
  });
  saveItems(materials);
  updateNoElemento(document.getElementById('categoria')?.value || '');
}

// Función para resetear el formulario
function resetForm() {
  const form = document.getElementById('addMaterialForm');
  form.reset();
  editingIndex = -1;
  document.getElementById('formSubmitMaterialButton').textContent = 'AGREGAR ELEMENTO';
  document.getElementById('cancelEditMaterialButton').style.display = 'none';
  document.getElementById('noElemento').value = '';
  const cantidad = document.getElementById('cantidad');
  if (cantidad) cantidad.value = '';
  const subtotal = document.getElementById('subtotal');
  if (subtotal) subtotal.value = '';
  updateFormLayout();
}

// Función para editar material
function editMaterial(index) {
  try {
    const material = materials[index];
    document.getElementById('categoria').value = material.categoria;
    updateFormLayout();
    document.getElementById('noElemento').value = material.noElemento;
    const nombrePieza = document.getElementById('nombrePieza');
    if (nombrePieza) nombrePieza.value = material.nombrePieza || '';
    const materialInput = document.getElementById('material');
    if (materialInput) materialInput.value = material.material || '';
    const largo = document.getElementById('largo');
    if (largo) largo.value = material.largo || '';
    const ancho = document.getElementById('ancho');
    if (ancho) ancho.value = material.ancho || '';
    const noPiezas = document.getElementById('noPiezas');
    if (noPiezas) noPiezas.value = material.noPiezas || '';
    const largoMaterial = document.getElementById('largoMaterial');
    if (largoMaterial) largoMaterial.value = material.largoMaterial || '';
    const anchoMaterial = document.getElementById('anchoMaterial');
    if (anchoMaterial) anchoMaterial.value = material.anchoMaterial || '';
    const dimensionesMaterial = document.getElementById('dimensionesMaterial');
    if (dimensionesMaterial) dimensionesMaterial.value = material.dimensionesMaterial || '';
    const claveMaterial = document.getElementById('claveMaterial');
    if (claveMaterial) claveMaterial.value = material.claveMaterial || '';
    const descripcionMaterial = document.getElementById('descripcionMaterial');
    if (descripcionMaterial) descripcionMaterial.value = material.descripcionMaterial;
    const unidad = document.getElementById('unidad');
    if (unidad) unidad.value = material.unidad;
    const cantidad = document.getElementById('cantidad');
    if (cantidad) cantidad.value = material.cantidad;
    const pu = document.getElementById('pu');
    if (pu) pu.value = material.pu;
    editingIndex = index;
    document.getElementById('formSubmitMaterialButton').textContent = 'ACTUALIZAR ELEMENTO';
    document.getElementById('cancelEditMaterialButton').style.display = 'inline-block';
    calculateFields();
    // Actualizar formRow para METAL si aplica
    if (material.categoria === 'METAL') {
      const materialElement = document.getElementById('material');
      if (materialElement) {
        materialElement.value = material.material || '';
        materialElement.dispatchEvent(new Event('change')); // Disparar evento para actualizar formRow2
      }
    }
  } catch (error) {
    console.error('Error preparing edit:', error);
    alert('Error al preparar la edición. Por favor, intenta de nuevo.');
  }
}

// Función para eliminar material
function deleteMaterial(index) {
  if (confirm('¿Estás seguro de eliminar este material?')) {
    materials.splice(index, 1);
    renderTable();
    resetForm();
  }
}

// Manejar formulario de agregar/editar material
document.getElementById('addMaterialForm').addEventListener('submit', (e) => {
  e.preventDefault();
  try {
    const categoria = document.getElementById('categoria')?.value.trim();
    const claveMaterial = document.getElementById('claveMaterial')?.value.trim() || '';
    const descripcionMaterial = document.getElementById('descripcionMaterial')?.value.trim() || '';
    const unidad = document.getElementById('unidad')?.value.trim() || '';
    const cantidadElement = document.getElementById('cantidad');
    const pu = parseFloat(document.getElementById('pu')?.value) || 0;
    const threeRowCategories = ['MADERA', 'MARMOL', 'ACRÍLICO', 'ESPEJO', 'VIDRIO', 'GRAFICOS', 'VINIL ADHERIBLE', 'BACKLIGH', 'TELA/VINIL'];
    const barnizPinturaCategories = ['BARNIZ', 'PINTURA'];
    const twoRowCategories = ['HERRAJE', 'ELÉCTRICO', 'EMBALAJE', 'MANO DE OBRA', 'EXTERNOS', 'INSUMOS', 'CORTE LASER'];
    let nombrePieza = '';
    let material = '';
    let largo = 0;
    let ancho = 0;
    let noPiezas = 0;
    let largoMaterial = 0;
    let anchoMaterial = 0;
    let dimensionesMaterial = 0;
    let cantidad = parseFloat(cantidadElement?.value) || 0;

    if (categoria === 'METAL' || categoria === 'MADERA') {
      material = document.getElementById('material')?.value.trim() || '';
      largo = parseFloat(document.getElementById('largo')?.value) || 0;
      noPiezas = parseInt(document.getElementById('noPiezas')?.value) || 0;
      nombrePieza = document.getElementById('nombrePieza')?.value.trim() || '';
      const largoMaterialElement = document.getElementById('largoMaterial');
      if (largoMaterialElement) largoMaterial = parseFloat(largoMaterialElement.value) || 0;
      const anchoMaterialElement = document.getElementById('anchoMaterial');
      if (anchoMaterialElement) anchoMaterial = parseFloat(anchoMaterialElement.value) || 0;
      const dimensionesMaterialElement = document.getElementById('dimensionesMaterial');
      if (dimensionesMaterialElement) dimensionesMaterial = parseFloat(dimensionesMaterialElement.value) || 0;
      const sheetMaterials = ['LAMINA', 'PLACA', 'OTRO (LAMINA, PLACA, ETC.)'];
      if (sheetMaterials.includes(material) || categoria === 'MADERA') {
        ancho = parseFloat(document.getElementById('ancho')?.value) || 0;
      }
    } else if (threeRowCategories.includes(categoria)) {
      nombrePieza = document.getElementById('nombrePieza')?.value.trim() || '';
      material = document.getElementById('material')?.value.trim() || '';
      largo = parseFloat(document.getElementById('largo')?.value) || 0;
      ancho = parseFloat(document.getElementById('ancho')?.value) || 0;
      noPiezas = parseInt(document.getElementById('noPiezas')?.value) || 0;
    }

    // Validación de campos requeridos
    if (!categoria || !descripcionMaterial || !unidad || !cantidad || !pu ||
        (categoria === 'METAL' && (!material || !largo || !noPiezas || !nombrePieza || !claveMaterial)) ||
        (categoria === 'METAL' && ['LAMINA', 'PLACA', 'OTRO (LAMINA, PLACA, ETC.)'].includes(material) && !ancho) ||
        (categoria === 'METAL' && material === 'OTRO (PERFIL, BARRA, ETC.)' && !dimensionesMaterial) ||
        (categoria === 'METAL' && material === 'OTRO (LAMINA, PLACA, ETC.)' && (!largoMaterial || !anchoMaterial)) ||
        (categoria === 'MADERA' && (!material || !largo || !ancho || !noPiezas || !nombrePieza || !claveMaterial)) ||
        (threeRowCategories.includes(categoria) && (!largo || !ancho || !noPiezas || !material || !nombrePieza || !claveMaterial)) ||
        (twoRowCategories.includes(categoria) && !claveMaterial)) {
      alert('Por favor, completa todos los campos requeridos con valores válidos.');
      return;
    }

    const subtotal = cantidad * pu;
    const newMaterial = {
      noElemento: editingIndex >= 0 ? materials[editingIndex].noElemento : (materials.filter(m => m.categoria === categoria).length + 1),
      categoria,
      nombrePieza: nombrePieza || undefined,
      material: material || undefined,
      largo: largo || undefined,
      ancho: ancho || undefined,
      noPiezas: noPiezas || undefined,
      largoMaterial: largoMaterial || undefined,
      anchoMaterial: anchoMaterial || undefined,
      dimensionesMaterial: dimensionesMaterial || undefined,
      claveMaterial: claveMaterial || undefined,
      descripcionMaterial,
      unidad,
      cantidad,
      pu,
      subtotal
    };

    if (editingIndex >= 0) {
      materials[editingIndex] = newMaterial;
    } else {
      materials.push(newMaterial);
    }
    renderTable();
    resetForm();
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Error al agregar o actualizar el material. Por favor, intenta de nuevo.');
  }
});

// Manejar cancelar edición
document.getElementById('cancelEditMaterialButton').addEventListener('click', () => {
  resetForm();
});

// Manejar cancelar agregar material
document.getElementById('cancelAddMaterialButton').addEventListener('click', () => {
  resetForm();
});

// Cargar materiales e imagen al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
  updateNoElemento('');
  displayFurnitureImage();
  renderTable();
  updateFormLayout();
});