/* ============================================================================
   HANDLUNGSANWEISUNG (script.js)
   1) Warte auf DOMContentLoaded, bevor du DOM referenzierst.
   2) Setze apiUrl auf den korrekten Backend-Endpoint (unload.php o. ä.).
   3) Hole Daten asynchron (fetch), prüfe response.ok, parse JSON.
   4) Transformiere Daten für das Chart: labels, datasets je Stadt/Serie bilden.
   5) Initialisiere Chart.js mit Typ (line), data (labels, datasets), options (scales).
   6) Nutze Hilfsfunktionen (z. B. getRandomColor) für visuelle Unterscheidung.
   7) Behandle Fehler (catch) → logge aussagekräftig, zeige Fallback im UI.
   8) Optional: Datum/Uhrzeit schön formatieren (toLocaleDateString/Time).
   9) Performance: große Responses paginieren/filtern; Redraws minimieren.
  10) Sicherheit: Keine geheimen Keys im Frontend; nur öffentliche Endpunkte nutzen.
   ============================================================================ */

document.addEventListener("DOMContentLoaded", () => {

  const waves = document.querySelectorAll('.welle');
  const infoBox = document.getElementById('infoBox');

  waves.forEach(wave => {
    wave.addEventListener('click', (event) => {
      event.stopPropagation(); // verhindert, dass das Dokument den Klick abfängt

      // Position der Info-Box (immer fix links am Bildschirm)
      infoBox.style.position = 'fixed';
      infoBox.style.left = '250px'; // Abstand vom linken Bildschirmrand
      infoBox.style.top = '420px';   // mittig im Bildschirm
      infoBox.style.transform = 'translateY(-50%)';

      // Inhalt der Box (später dynamisch befüllbar)
      infoBox.innerHTML = `
        <div class="box-content">
            <div class="info-text">
            <h3>${wave.dataset.info}</h3>
          <img src="designs/boards/girl_beginnerboard.png" alt="Surfergirl" class="info-image" >
          </div>
        </div>
      `;

      // Box sichtbar machen
      infoBox.classList.remove('hidden');
      infoBox.classList.add('visible');
    });
  });

  // Klick außerhalb der Wellen → Info-Box schließen
  document.addEventListener('click', (e) => {
    if (!e.target.classList.contains('welle')) {
      infoBox.classList.add('hidden');
      infoBox.classList.remove('visible');
    }
  });

  //API und Chart

  const apiUrl = "https://im3.aare-jetzt.ch/unload.php"; // Passen Sie die URL bei Bedarf an

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
  console.log("Abgerufene Daten:", data);

      const ctx = document.getElementById("wellenChart").getContext("2d");

      const datasets = Object.keys(data).map((boje) => ({
        label: boje,
        data: data[boje].map((item) => item.wellen_höhe),
        fill: false,
        borderColor: getRandomColor(), // Generiert eine zufällige Farbe für jede Stadtlinie im Diagramm
        tension: 0.1, // Gibt der Linie im Diagramm eine leichte Kurve
      }));

      //Uncomment to create the chart//
      new Chart(ctx, {
        type: "line",
        data: {
          labels: data["Albion"].map((item) => new Date(item.created_at).toLocaleDateString()), // Nimmt an, dass alle Städte Daten für dieselben Daten haben
          datasets: datasets,
        },
        options: {
          scales: {
            y: {
              beginAtZero: false, // Startet die y-Achse nicht bei 0, um einen besseren Überblick über die Schwankungen zu geben
            },
          },
        },
      });
      
    })
    .catch((error) => console.error("Fetch-Fehler:", error)); // Gibt Fehler im Konsolenlog aus, falls die Daten nicht abgerufen werden können

  function getCityColor(city) {
    const wellenFarben = {
      swht: "#09008aff",
      wwh: "#97e567ff",
  
      // Fügen Sie hier weitere Städte und ihre Farben hinzu
    };
    return wellenFarben[boje] || getRandomColor(); // Gibt die vordefinierte Farbe zurück oder eine zufällige Farbe
  }

  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color; // Erzeugt eine zufällige Farbe
  }
});

