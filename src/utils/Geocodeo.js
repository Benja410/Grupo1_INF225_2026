export async function obtenerCoordenadas(direccion) {
    if (!direccion) return null;
    
    try {

        const direccionBuscada = encodeURIComponent(`${direccion}, Chile`);
        const url = `https://nominatim.openstreetmap.org/search?q=${direccionBuscada}&format=json&limit=1`;

        const respuesta = await fetch(url, {
            headers: { 'User-Agent': 'PlataformaPracticas/1.0 (USM)' }
        });

        const data = await respuesta.json();

        if (data && data.length > 0) {
            return {
                latitud: parseFloat(data[0].lat),
                longitud: parseFloat(data[0].lon)
            };
        }
        return null; 
    } catch (error) {
        console.error("Error en geocoding:", error);
        return null;
    }
}