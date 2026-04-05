async function buscarArchivo() {
    const fechaInput = document.getElementById('fechaBusqueda').value;
    const contenedor = document.getElementById('resultado');

    if (!fechaInput) {
        alert("Por favor, selecciona una fecha.");
        return;
    }

    // 1. Descomponer fecha (YYYY-MM-DD)
    const [anio, mes, dia] = fechaInput.split('-');
    
    // 2. Construir ruta para GitHub (Carpeta: data/Año/Mes/Día-Mes-Año.xlsx)
    const nombreArchivo = `${dia}-${mes}-${anio}.xlsx`;
    const rutaFinal = `data/${anio}/${mes}/${nombreArchivo}`;

    contenedor.innerHTML = "<p>Buscando archivo...</p>";

    try {
        // 3. Obtener el archivo Excel como ArrayBuffer
        const response = await fetch(rutaFinal);
        if (!response.ok) throw new Error('No existe registro para esta fecha.');

        const arrayBuffer = await response.arrayBuffer();
        
        // 4. Leer el Excel con SheetJS
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        // 5. Tomar la primera hoja del Excel
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // 6. Convertir hoja a HTML y mostrarla
        const htmlTable = XLSX.utils.sheet_to_html(worksheet);
        contenedor.innerHTML = htmlTable;

    } catch (error) {
        contenedor.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    }
}