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

// Debug-Ausgabe der rohen Daten
//print_r($data);

// Funktion, um Feet in Meter umzuwandeln (falls nötig)
function convertFeetToMeter($feet) {
    return round($feet * 0.3048, 2);
}

// Funktion zur Bestimmung der Surf-Bedingung
function determineCondition($swht) {
    if ($swht > 1) {
        return 'Advanced';
    } else {
        return 'Beginner';
    }
}

// Initialisiert ein Array, um die transformierten Daten zu speichern
$transformedData = [];

// Durchläuft alle empfangenen Bojen-Datensätze
foreach ($data as $item) {
    // Sicherheitshalber: Prüfe, ob notwendige Keys existieren
    if (!isset($item['id']) || !isset($item['name']) || !isset($item['swht'])) {
        continue;
    }

    // Umwandlung Feet → Meter (falls Daten in Feet geliefert werden)
    $swht_m = is_numeric($item['swht']) ? convertFeetToMeter($item['swht']) : 0;
    $wwh_m  = is_numeric($item['wwh']) ? convertFeetToMeter($item['wwh']) : 0;

    // SQL-kompatibles Zeitformat
    $timeFormatted = date('Y-m-d H:i:s', strtotime($item['time']));

    // Surfbedingung bestimmen
    $condition = determineCondition($swht_m);

    // Transformation in gewünschte Struktur
    $transformedData[] = [
        'bojen_id' => $item['id'],
        'name'     => $item['name'],
        'swht'     => $swht_m,
        'swd'      => $item['swd'] ?? '',
        'wwh'      => $wwh_m,
        'wwd'      => $item['wwd'] ?? '',
        'time'     => $timeFormatted,
        'condition'=> $condition
    ];
   
}

// Kodiert die transformierten Daten in JSON
$jsonData = json_encode($transformedData, JSON_PRETTY_PRINT);
 print_r($jsonData);
 
// Gibt die JSON-Daten zurück, anstatt sie auszugeben
return $jsonData;

