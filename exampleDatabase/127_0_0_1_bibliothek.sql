--
-- Datenbank: `bibliothek`
--
DROP DATABASE IF EXISTS `bibliothek`;
CREATE DATABASE IF NOT EXISTS `bibliothek` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `bibliothek`;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `benutzer`
--

CREATE TABLE `benutzer` (
  `BenutzerNr` int(4) NOT NULL,
  `Anrede` varchar(4) DEFAULT NULL,
  `Nachname` varchar(50) DEFAULT NULL,
  `Vorname` varchar(50) DEFAULT NULL,
  `Geburtsdatum` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1
PARTITION BY KEY (BenutzerNr)
(
PARTITION p0 ENGINE=InnoDB,
PARTITION p1 ENGINE=InnoDB
);

--
-- Daten für Tabelle `benutzer`
--

INSERT INTO `benutzer` (`BenutzerNr`, `Anrede`, `Nachname`, `Vorname`, `Geburtsdatum`) VALUES
(1, 'Herr', 'Walter', 'Guido', '1978-04-05'),
(3, 'Herr', 'Müller', 'Christian', '1998-05-02'),
(0, NULL, NULL, NULL, '1900-01-01'),
(2, 'Frau', 'Walter', 'Annette', '1968-08-07'),
(4, 'Frau', 'Gantler', 'Hertha', '1948-05-17');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `buecher`
--

CREATE TABLE `buecher` (
  `BuchNr` int(4) NOT NULL,
  `Titel` varchar(50) NOT NULL,
  `Autor` varchar(50) NOT NULL,
  `Verlag` varchar(50) NOT NULL,
  `Erschienen_dat` date NOT NULL,
  `Originalpreis` decimal(10,0) NOT NULL,
  `Waehrung` varchar(20) NOT NULL,
  `ausgeliehen_an` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `buecher`
--

INSERT INTO `buecher` (`BuchNr`, `Titel`, `Autor`, `Verlag`, `Erschienen_dat`, `Originalpreis`, `Waehrung`, `ausgeliehen_an`) VALUES
(1, 'Alle meine Entchen', 'Tobias von Heisenberg', 'Standardverlag Neu-Ulm', '1905-05-09', '50000', 'Lira', 0);
INSERT INTO `buecher` (`BuchNr`, `Titel`, `Autor`, `Verlag`, `Erschienen_dat`, `Originalpreis`, `Waehrung`, `ausgeliehen_an`) VALUES
(2, 'Die Wahrheit ueber E. Rich', 'Erhard Richardsen', 'Carlsson-Verlag Homburg', '1975-03-16', '50', 'Mark', 0);
INSERT INTO `buecher` (`BuchNr`, `Titel`, `Autor`, `Verlag`, `Erschienen_dat`, `Originalpreis`, `Waehrung`, `ausgeliehen_an`) VALUES
(3, 'Das Gestaendnis', 'Henry Ibsen', 'Konradius-Verlag Herne', '2005-11-03', '15,90', 'Euro', 0);
INSERT INTO `buecher` (`BuchNr`, `Titel`, `Autor`, `Verlag`, `Erschienen_dat`, `Originalpreis`, `Waehrung`, `ausgeliehen_an`) VALUES
(4, 'Der Tag der Entscheidung', 'Bruno Gans', 'Krimiverlag Neukoelln', '2016-01-29', '39,70', 'Euro', 0);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `benutzer`
--
ALTER TABLE `benutzer`
  ADD PRIMARY KEY (`BenutzerNr`);

--
-- Indizes für die Tabelle `buecher`
--
ALTER TABLE `buecher`
  ADD PRIMARY KEY (`BuchNr`),
  ADD KEY `ausgeliehen_an` (`ausgeliehen_an`),
  ADD KEY `fk_ausgeliehen_benutzernr` (`ausgeliehen_an`);
