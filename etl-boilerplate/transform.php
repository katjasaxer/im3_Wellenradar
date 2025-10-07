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

// Definiert eine Zuordnung von Koordinaten zu Stadtnamen
$locationsMap = [
    '46014' => 'Albion',
    '46237' => 'San Francisco Bar',
    '46215' => 'Diablo Canyon',
    '46268' => 'Topanga',
    '46235' => 'Imperial Beach',
];

// Funktion, um Imperial in Metric umzurechnen
function convertToMetric($imperial) {
    return round($imperial *0.3048, 2); //rundet auf 2 Nachkommastellen
}

// Neue Funktion zur Bestimmung der Bojendaten
function determineCondition($swht, $swd, $wwh, $wwd) {

    if ($swht < 2) {
        return 'beginner';
    } else ($swht > 2) {
        return 'advanced';
    }
}

// Initialisiert ein Array, um die transformierten Daten zu speichern
$transformedData = [];


// Transformiert und fügt die notwendigen Informationen hinzu
foreach ($data as $location) {
    // Bestimmt den Stadtnamen anhand von Breitengrad und Längengrad
    $cityKey = $location['latitude'] . ',' . $location['longitude'];
    $city = $locationsMap[$cityKey] ?? 'Unbekannt';

    // Wandelt die Temperatur in Celsius um und rundet sie
    $temperatureCelsius = convertToCelsius($location['current']['temperature_2m']);

    // Bestimmt die Wetterbedingung
    $condition = determineCondition(
        $location['current']['cloud_cover'],
        $location['current']['rain'],
        $location['current']['showers'],
        $location['current']['snowfall']
    );

    // Konstruiert die neue Struktur mit allen angegebenen Feldern, einschließlich des neuen 'condition'-Feldes
    $transformedData[] = [
        'location' => $city,
        'temperature_celsius' => $temperatureCelsius,
        'rain' => $location['current']['rain'],
        'showers' => $location['current']['showers'],
        'snowfall' => $location['current']['snowfall'],
        'cloud_cover' => $location['current']['cloud_cover'],
        'condition' => $condition // Fügt das Feld 'condition' hinzu
    ];
}

// Kodiert die transformierten Daten in JSON
$jsonData = json_encode($transformedData, JSON_PRETTY_PRINT);

// Optional kann das JSON ausgegeben werden, um die Ausgabe zu sehen
echo $jsonData;

// Wenn dies in eine Datei gespeichert werden soll, kommentieren Sie die folgende Zeile aus
// file_put_contents('transformed_weather_data.json', $jsonData);

?>