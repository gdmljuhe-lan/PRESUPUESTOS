// ==========================
// INICIALIZACIÓN DE PÁGINA
// ==========================

let brandName, year, project, clave;

window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  brandName = urlParams.get('brand') || 'Desconocida';
  year = urlParams.get('year') || 'Desconocido';
  project = urlParams.get('project') || 'Desconocido';
  clave = urlParams.get('clave') || 'Desconocida';

  document.getElementById('brandName').textContent = brandName.toUpperCase();
  document.getElementById('yearName').textContent = year.toUpperCase();
  document.getElementById('projectName').textContent = project.toUpperCase();
  document.getElementById('claveName').textContent = clave.toUpperCase();

  renderMaterialTables();

  const categoriaInput = document.getElementById('categoriaInput');
  if (categoriaInput) {
    categoriaInput.addEventListener('change', () => {
      updateFormForCategory(categoriaInput.value);
    });
  }

  const addMaterialForm = document.getElementById('addMaterialForm');
  addMaterialForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const material = {
      categoria: document.getElementById('categoriaInput').value,
      clave: document.getElementById('claveInput')?.value || '',
      descripcion: document.getElementById('descripcionInput')?.value || '',
      unidad: document.getElementById('unidadInput')?.value || '',
      cantidad: document.getElementById('cantidadInput')?.value || '',
      pu: document.getElementById('puInput')?.value || '',
      subtotal: document.getElementById('subtotalInput')?.value || ''
    };

    saveMaterial(material);
    addMaterialForm.reset();
    document.getElementById('materialDetails').innerHTML = '';
  });
});
