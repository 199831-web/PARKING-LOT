document.addEventListener("DOMContentLoaded", () => {
  const totalCeldas = 100;
  let grafico;

  async function cargarCeldasYGrafico() {
    try {
      const res = await fetch('/api/celdas');
      const data = await res.json();

      const libres = data.filter(c => c.estado === 'libre').length;
      const ocupadas = data.filter(c => c.estado === 'ocupado').length;
      const reservadas = data.filter(c => c.estado === 'reservado').length;

      const colores = ['#4CAF50', '#F44336', '#FF9800']; // Verde, Rojo, Naranja

      // Donut de disponibilidad
      if (document.getElementById('graficoDisponibilidad')) {
        if (!grafico) {
          grafico = new Chart(document.getElementById('graficoDisponibilidad'), {
            type: 'doughnut',
            data: {
              labels: ['Libres', 'Ocupadas', 'Reservadas'],
              datasets: [{
                data: [libres, ocupadas, reservadas],
                backgroundColor: colores,
                borderColor: '#ffffff',
                borderWidth: 2
              }]
            },
            options: {
              responsive: true,
              plugins: {
                legend: { position: 'bottom' }
              },
              cutout: '60%'
            }
          });
        } else {
          grafico.data.datasets[0].data = [libres, ocupadas, reservadas];
          grafico.update();
        }
      }
    } catch (err) {
      console.error('Error cargando celdas:', err);
    }
  }

  // Barras de ocupación por hora
  if (document.getElementById('graficoOcupacionHoraria')) {
    new Chart(document.getElementById('graficoOcupacionHoraria'), {
      type: 'bar',
      data: {
        labels: ['6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM'],
        datasets: [{
          label: 'Cantidad de Vehículos',
          data: [2, 6, 10, 8, 5, 3, 1],
          backgroundColor: '#800000'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Ocupación por Hora' }
        }
      }
    });
  }

  // Doughnut tipos de vehículos
  if (document.getElementById('graficoTiposVehiculos')) {
    new Chart(document.getElementById('graficoTiposVehiculos'), {
      type: 'doughnut',
      data: {
        labels: ['Carro', 'Moto', 'Bicicleta'],
        datasets: [{
          data: [60, 25, 15],
          backgroundColor: ['#800000', '#F44336', '#FF9800']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Distribución por Tipo de Vehículo' }
        }
      }
    });
  }

  // Ejecutar solo si estás en VisualizarCeldas
  if (window.location.pathname.includes('VisualizarCeldas.html')) {
    cargarCeldasYGrafico();
    setInterval(cargarCeldasYGrafico, 60000);
  }
});
