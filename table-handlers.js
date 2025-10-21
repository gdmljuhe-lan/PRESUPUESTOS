// ==========================
// MANEJO DE TABLAS Y STORAGE
// ==========================

function renderMaterialTables() {
  const materials = JSON.parse(localStorage.getItem(`materials_${brandName}_${year}_${project}_${clave}`) || '[]');
  const grouped = {};
  materials.forEach(m => {
    if (!grouped[m.categoria]) grouped[m.categoria] = [];
    grouped[m.categoria].push(m);
  });

  let html = '';
  for (const categoria of categoryOrder) {
    if (grouped[categoria] && grouped[categoria].length > 0) {
      html += `
        <div class="material-section">
          <h3>${categoria}</h3>
          <table class="material-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Clave</th>
                <th>Descripción</th>
                <th>Unidad</th>
                <th>Cantidad</th>
                <th>P.U.</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${grouped[categoria].map((m, i) => `
                <tr>
                  <td>${i+1}</td>
                  <td class="clave-cell">${m.clave || ''}</td>
                  <td class="description-cell">${m.descripcion || ''}</td>
                  <td>${m.unidad || ''}</td>
                  <td>${m.cantidad || ''}</td>
                  <td>${m.pu || ''}</td>
                  <td>${m.subtotal || ''}</td>
                  <td class="actions-cell">
                    <button onclick="editMaterial(${materials.indexOf(m)})">Editar</button>
                    <button onclick="deleteMaterial(${materials.indexOf(m)})">Eliminar</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
  }
  document.getElementById('materialTables').innerHTML = html;
}

function saveMaterial(material) {
  const key = `materials_${brandName}_${year}_${project}_${clave}`;
  const materials = JSON.parse(localStorage.getItem(key) || '[]');
  materials.push(material);
  localStorage.setItem(key, JSON.stringify(materials));
  renderMaterialTables();
}

function deleteMaterial(index) {
  const key = `materials_${brandName}_${year}_${project}_${clave}`;
  const materials = JSON.parse(localStorage.getItem(key) || '[]');
  materials.splice(index, 1);
  localStorage.setItem(key, JSON.stringify(materials));
  renderMaterialTables();
}

function editMaterial(index) {
  const key = `materials_${brandName}_${year}_${project}_${clave}`;
  const materials = JSON.parse(localStorage.getItem(key) || '[]');
  const m = materials[index];

  document.getElementById('categoriaInput').value = m.categoria;
  updateFormForCategory(m.categoria, m.material, '', m.descripcion);

  document.getElementById('claveInput').value = m.clave || '';
  document.getElementById('descripcionInput').value = m.descripcion || '';
  document.getElementById('unidadInput').value = m.unidad || '';
  document.getElementById('cantidadInput').value = m.cantidad || '';
  document.getElementById('puInput').value = m.pu || '';
  document.getElementById('subtotalInput').value = m.subtotal || '';
}
