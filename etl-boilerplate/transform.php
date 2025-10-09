<?php

/* ============================================================================
   HANDLUNGSANWEISUNG (transform.php)
   0) Schau dir die Rohdaten genau an und plane exakt, wie du die Daten umwandeln möchtest (auf Papier)
   1) Binde extract.php ein und erhalte das Rohdaten-Array.
   2) Definiere Mapping Koordinaten → Anzeigename (z. B. Bern/Chur/Zürich).
   3) Konvertiere Einheiten (z. B. °F → °C) und runde sinnvoll (Celsius = (Fahrenheit - 32) * 5 / 9).
   4) Leite eine einfache "condition" ab (z. B. sonnig/teilweise bewölkt/bewölkt/regnerisch).
   5) Baue ein kompaktes, flaches Array je Standort mit den Ziel-Feldern.
   6) Optional: Sortiere die Werte (z. B. nach Zeit), entferne irrelevante Felder.
   7) Validiere Pflichtfelder (location, temperature_celsius, …).
   8) Kodieren: json_encode(..., JSON_PRETTY_PRINT) → JSON-String.
   9) GIB den JSON-String ZURÜCK (return), nicht ausgeben – für den Load-Schritt.
  10) Fehlerfälle als Exception nach oben weiterreichen (kein HTML/echo).
   ============================================================================ */

// Bindet das Skript extract.php für Rohdaten ein und speichere es in $data
$data = include('extract.php');

// Definiert eine Zuordnung von Bojen-ID zu Standortnamen
$locationsMap = [
    '46237' => 'Albion',
    '46236' => 'San Francisco Bar',
    '46223' => 'Diablo Canyon',
    '46221' => 'Topanga',
    '46225' => 'Imperial Beach',
];

// Funktion, um Feet in Meter umzuwandeln (falls nötig)
function convertFeetToMeter($feet) {
    return round($feet * 0.3048, 2);
}

// Funktion zur Bestimmung der Surf-Bedingung
function determineCondition($swht) {
    if ($swht > 2) {
        return 'Advanced';
    } else {
        return 'Beginner';
    }
}

// Initialisiert ein Array, um die transformierten Daten zu speichern
$transformedData = [];

// Transformiert und fügt die notwendigen Informationen hinzu
foreach ($data as $entry) {

    // Buoy-ID aus URL extrahieren
    if (preg_match('/(\d{5})\.json$/', $entry['buoy_url'], $matches)) {
        $bojen_id = $matches[1];
    } else {
        throw new Exception("Bojen-ID konnte nicht aus URL extrahiert werden.");
    }

    // Standortname aus Mapping
    $name = $locationsMap[$bojen_id] ?? 'Unbekannt';

    // Umrechnung Feet → Meter (wenn nötig)
    $swht_m = convertFeetToMeter($entry['swht']);
    $wwh_m  = convertFeetToMeter($entry['wwh']);

    // Schwierigkeitsstufe bestimmen
    $condition = determineCondition($swht_m);

    // Zeitformat anpassen
    $time = date('Y-m-d H:i:s', strtotime($entry['time']));

    // Validiere Pflichtfelder
    if (empty($bojen_id) || empty($name) || empty($swht_m) || empty($time)) {
        throw new Exception("Fehlende Pflichtfelder bei Datensatz mit Zeit: " . $entry['time']);
    }

    // Neues Datenelement zusammenstellen
    $transformedData[] = [
        'bojen_id' => $bojen_id,
        'name'     => $name,
        'swht'     => $swht_m,
        'swd'      => $entry['swd'],
        'wwh'      => $wwh_m,
        'wwd'      => $entry['wwd'],
        'time'     => $time,
        'condition'=> $condition
    ];
}

// Kodiert die transformierten Daten in JSON (zur Weiterverarbeitung oder Debug)
$jsonData = json_encode($transformedData, JSON_PRETTY_PRINT);

// Optional: Ausgeben zum Test
echo $jsonData;

echo "<pre>";
print_r($transformedData);
echo "</pre>";

// Alternativ zurückgeben, falls dieses Skript von load.php o.ä. eingebunden wird
// return $transformedData;

?>