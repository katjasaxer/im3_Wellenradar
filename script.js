
   document.addEventListener("DOMContentLoaded", () => {

    /* --- Wellen-Box-Interaktion --- */
    const waves = document.querySelectorAll('.welle');
    const infoBox = document.getElementById('infoBox');
    const infoBoxContent = document.getElementById('infoBoxContent');
    const inselBox = document.getElementById('insel');
    const advancedboard = document.getElementById('advanced');
    const beginnerboard = document.getElementById('beginner');
  
    let chartInstance = null; // Referenz auf das aktuelle Chart
    let groupedData = {};     // globale Datenspeicherung für spätere Klicks
  
    /* --- Klick-Events für Wellen vorbereiten --- */
    waves.forEach(wave => {
      wave.addEventListener('click', (event) => {
        event.stopPropagation();
        
        infoBox.style.position = 'fixed';
        infoBox.style.left = '15%';
        infoBox.style.top = '60%';
        infoBox.style.transform = 'translateY(-50%)';
  
        // Bild je nach swht&swd auswählen
        const swell = parseFloat(wave.dataset.swht || 0);
        const windImg = `designs/pfeile/new/${wave.dataset.swd}.png`
        const boardImg = swell > 5.0
          ? "designs/girl_advancedboard2.png"
          : "designs/girl_beginnerboard2.png"; 
  
        infoBoxContent.innerHTML = `
          <div class="box-content">
            <div class="info-text">
              <p>${wave.dataset.info}</p>
              <div class="bildpfeil">
              <img src="${boardImg}" alt="Surfergirl" class="info-image">
              <img src="${windImg}" class="wind-image"> </div>
            </div>
            <div class="chartContainer">
              <canvas id="wellenChart"></canvas>
            </div>
              <button class="back-button" id="closeInfoBox">Zurück</button>
          </div>
        `;
  

        const backbutton = document.getElementById('closeInfoBox');

        infoBox.classList.remove('hidden');
        infoBox.classList.add('visible');

        inselBox.classList.remove('visible');
        inselBox.classList.add('hidden');

        backbutton.classList.remove('hidden');
        backbutton.classList.add('visible');
        
  
        // 🔹 Wenn Daten schon geladen sind, Chart zeichnen
        const stationName = wave.dataset.info;
        if (groupedData[stationName]) {
          drawChartFor(stationName);
        }
      });
    });
  
    // Klick ausserhalb → Info-Box schließen + Chart löschen
    document.addEventListener('click', (e) => {
      if (!infoBox.contains(e.target)) {
        infoBox.classList.add('hidden');
        infoBox.classList.remove('visible');
        inselBox.classList.add('visible');
        inselBox.classList.remove('hidden');
        
        if (chartInstance) {
          chartInstance.destroy();
          chartInstance = null;
        }
      }

      
    });


    /* --- API-Daten laden --- */
    const apiUrl = "https://im3.aare-jetzt.ch/unload.php";
  
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        //console.log("Abgerufene Daten:", data);
  
        if (!Array.isArray(data) || data.length === 0) {
          console.warn("⚠️ Keine gültigen Daten erhalten – Diagramm wird nicht erstellt.");
          return;
        }
  
        // Gruppiere Daten nach Bojenname
        groupedData = data.reduce((acc, entry) => {
          const name = entry.name || `Boje_${entry.bojen_id}`;
          if (!acc[name]) acc[name] = [];
          acc[name].push(entry);
          return acc;
        }, {});
  
        console.log("Gruppierte Daten:", groupedData);
  
        // Setze Wellen-Icons anhand der Daten
        const waveNames = Object.keys(groupedData);
        waves.forEach((wave, i) => {
          const stationName = wave.dataset.info;
          const allData = groupedData[stationName] || [];
          const latest = allData[allData.length - 1];
          const swell = parseFloat(latest?.swht || 0);
          const swd = latest.swd;
  
          console.log(stationName);
          console.log(swd);

          wave.dataset.swht = swell;
          wave.dataset.swd = swd;
          wave.src = swell > 5.0
            ? "designs/wellen/welle_gross.png"
            : "designs/wellen/welle_klein.png";
        });
      })
      .catch(error => console.error("Fetch-Fehler:", error));
  
  
    /* --- Chart-Funktion --- */
    function drawChartFor(name) {
      const canvas = document.getElementById("wellenChart");
      if (!canvas) {
        console.error("Kein Canvas gefunden.");
        return;
      }
      const ctx = canvas.getContext("2d");
  
     // Zeitgrenze: 24 Stunden zurück
     const now = Date.now();
     const vor24h = now - 24 * 60 * 60 * 1000;

    // Daten für diesen Namen filtern
     const data = groupedData[name]?.filter(item => new Date(item.time).getTime() >= vor24h);

     if (!data || data.length === 0) {
     console.warn(`Keine Daten innerhalb der letzten 24 Stunden für ${name}`);
     return;
     }
  
      const labels = data.map(item =>
        new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
  
      const dataset = {
        label: `${name} – Wellenhöhe`,
        data: data.map(item => item.swht ?? 0),
        fill: false,
        borderColor: '#4E99D1',
        tension: 0.1,
      };
  
      // Wenn bereits ein Chart existiert, zerstören
      if (chartInstance) chartInstance.destroy();

      //Dynamische Charthöhe
      maxWaveHight = 2 * Math.round(Math.max(...dataset.data) / 2);
  
      if (maxWaveHight <= 8) {
        maxChartHight = 10;
      } else {
        maxChartHight = maxWaveHight + 2;
      }

      chartInstance = new Chart(ctx, {
        type: "line",
        data: { labels, datasets: [dataset] },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              // <-- Hier legen wir feste Grenzen fest
              min: 0,           // Unterste Grenze
              max: 16,          // Oberste Grenze
              //max: maxChartHight; Dynamische Chart Höhe
              ticks: {
                stepSize: 2,    
              },
              title: { display: true, text: "Wellenhöhe (ft)" },
            },
            x: {
              title: { display: true, text: "Zeit (heute)" },
            },
          },
          plugins: {
            legend: { position: 'bottom' },
          },
        },
      });
    }
  
    /* --- Hilfsfunktionen --- */
    function getRandomColor() {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    /* --- Infoboxen Boards - Advanced --- */
    advancedboard.addEventListener('click', (event) => {
      event.stopPropagation();
        
        infoBox.style.position = 'fixed';
        infoBox.style.left = '15%';
        infoBox.style.top = '60%';
        infoBox.style.transform = 'translateY(-50%)';
        infoBox.style.height = '300px';
  
  
        infoBoxContent.innerHTML = `
          <div class="box-contentboards">
            <div class="info-inhaltboards">
              <h1>Advanced</h1>
              <img src="designs/girl_advancedboard3.png" alt="Surfergirl mit Advancedboard" class="info-image">
              <p>Kräftige Wellen ab 5 ft (ab 1.5 m), die ideal für Fortgeschrittene und Profis sind.
              Sie bieten mehr Power, Geschwindigkeit und Raum für anspruchsvolle Manöver.</p>
            </div>
          </div>
        `;
  
        infoBox.classList.remove('hidden');
        infoBox.classList.add('visible');

        inselBox.classList.remove('visible');
        inselBox.classList.add('hidden');
    });
  
    /* --- Infoboxen Boards - Beginner --- */
    beginnerboard.addEventListener('click', (event) => {
      event.stopPropagation();
        
        infoBox.style.position = 'fixed';
        infoBox.style.left = '15%';
        infoBox.style.top = '60%';
        infoBox.style.transform = 'translateY(-50%)';
  
  
        infoBoxContent.innerHTML = `
          <div class="box-contentboards">
            <div class="info-inhaltboards">
              <h1>Beginner</h1>
              <img src="designs/girl_beginnerboard3.png" alt="Surfergirl mit Beginnerboard" class="info-image">
              <p>Sanfte Wellen bis 5 ft (bis 1.5 m), die perfekt für Einsteiger:innen sind.
              Hier kannst du sicher üben, erste Take-offs meistern und Schritt für Schritt ins Surfen eintauchen.</p>
            </div>
          </div> `;
  
        infoBox.classList.remove('hidden');
        infoBox.classList.add('visible');

        inselBox.classList.remove('visible');
        inselBox.classList.add('hidden');
    });

  });
  

