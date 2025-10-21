document.addEventListener('DOMContentLoaded', () => {
  // Clean up existing MADERA materials
  materials = materials.map(material => {
    if (material.categoria === 'MADERA') {
      return {
        noElemento: material.noElemento,
        categoria: material.categoria,
        nombrePieza: material.nombrePieza,
        material: material.material,
        claveMaterial: material.claveMaterial,
        descripcionMaterial: material.descripcionMaterial,
        unidad: material.unidad,
        cantidad: material.cantidad,
        pu: material.pu,
        subtotal: material.subtotal
      };
    }
    return material;
  });
  saveItems(materials);
  updateNoElemento('');
  displayFurnitureImage();
  renderTable();
  updateFormLayout();
});