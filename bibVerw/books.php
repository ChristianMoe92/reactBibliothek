<?php

/*
Beispiel-Abfrage: http://localhost/bibVerw/books.php?request=Lend&newUser=1&choBook=2
*/
function doLend($connection, $data_arr){
	extract($data_arr);

	$stmt_lend = "UPDATE buecher SET ausgeliehen_an = ".$newUser." WHERE BuchNr = ".$choBook.";";
	// products array
	$products_arr=array();
	$products_arr["records"]=array();
	if($connection->query($stmt_lend) === TRUE){
		$msg = "<p>Ausleihe erfolgreich</p>";
		array_push($products_arr["records"], array(
			"txt" => $msg
		));
		return $products_arr;
	}else{
		array_push($products_arr["records"], array(
			"Err_Txt" => "Error: ".$connection->error
		));
		return $products_arr;
	}
}

/*
Beispiel-Abfrage: http://localhost/bibVerw/books.php?request=Edit&bid=2&titel=Der+arme+Ritter&autor=Anton+Jakobsen&verl=Guenther+und+Soehne&erschDatum=1981-12-17&origPr=12.75&waehr=DM
*/
function doEdit($connection, $data_arr){
		extract($data_arr);

		$stmt_Ins = "UPDATE buecher SET Titel='".$titel.
		"', Autor='".$autor.
		"', Verlag='".$verl.
		"', Erschienen_dat='".$erschDatum.
		"', Originalpreis='".$origPr.
		"', Waehrung= '".$waehr.
		"' WHERE BuchNr = ".$bid.";";

		// products array
		$products_arr=array();
		$products_arr["records"]=array();
		if($connection->query($stmt_Ins) === TRUE){
			$msg = "<p>Registrierung erfolgreich</p>";
			array_push($products_arr["records"], array(
				"txt" => $msg
			));
			return $products_arr;
		}else{
			array_push($products_arr["records"], array(
				"Err_Txt" => "Error: ".$connection->error
			));
			return $products_arr;
		}
}

/*
Beispiel-Abfrage: http://localhost/bibVerw/books.php?request=Insert&titel=Der+arme+Ritter&autor=Anton+Jakobsen&verl=Guenther+und+Soehne&erschDatum=1981-12-17&origPr=12.75&waehr=DM
*/
function doInsert($connection, $data_arr){
	extract($data_arr);


		$stmt_Ins = "INSERT INTO buecher (Titel, Autor, Verlag, Erschienen_dat, Originalpreis, Waehrung) VALUES('".
			$titel."', '".
			$autor."','".
			$verl."', '".
			$erschDatum."', '".
			$origPr."', '".
			$waehr."')";

		// products array
		$products_arr=array();
		$products_arr["records"]=array();
		if($connection->query($stmt_Ins) === TRUE){
			$msg = "<p>Registrierung erfolgreich</p>";
			array_push($products_arr["records"], array(
				"txt" => $msg
			));
			return $products_arr;
		}else{
			array_push($products_arr["records"], array(
				"Err_Txt" => "Error: ".$connection->error
			));
			return $products_arr;
		}
}

/*
Beispiel-Abfrage: http://localhost/bibVerw/books.php?request=Select
*/
function doSelect($connection, $data_arr){
	extract($data_arr);
	$stmt_Sel = "";
	$stmt_From = "";
	$stmt_Where = "";

	$isOnlyIDs = isset($onlyIDs);

	if(isset($onlyLend)){
		if($onlyLend === 'TRUE'){
			$stmt_Sel = "SELECT bu.BuchNr, bu.Titel, bu.Verlag, bu.Autor, bu.Erschienen_dat, bu.Originalpreis, bu.Waehrung, CONCAT(be.vorname, ' ', be.nachname) AS ausgelAn";
			$stmt_From = " FROM buecher bu JOIN benutzer be ON bu.ausgeliehen_an = be.BenutzerNr";
			$stmt_Where = " WHERE BuchNr > 0 AND ausgeliehen_an > 0";
		}else{
			$stmt_Sel = "SELECT bu.BuchNr, bu.Titel, bu.Verlag, bu.Autor, bu.Erschienen_dat, bu.Originalpreis, bu.Waehrung, IF(bu.ausgeliehen_an > 0, 'Verliehen', 'Verfuegbar') AS Stat ";
			$stmt_From = "FROM buecher bu";
			$stmt_Where = " WHERE BuchNr > 0";
		}
	}elseif($isOnlyIDs){
		if($onlyIDs === 'TRUE'){
			$stmt_Sel = "SELECT bu.BuchNr";
			$stmt_From = " FROM buecher bu";
			$stmt_Where = " WHERE BuchNr > 0 AND ausgeliehen_an = 0";
		}else{
			$stmt_Sel = "SELECT bu.BuchNr, bu.Titel, bu.Verlag, bu.Autor, bu.Erschienen_dat, bu.Originalpreis, bu.Waehrung, IF(bu.ausgeliehen_an > 0, 'Verliehen', 'Verfuegbar') AS Stat ";
			$stmt_From = "FROM buecher bu";
			$stmt_Where = " WHERE BuchNr > 0";
		}
	}else{
		$stmt_Sel = "SELECT bu.BuchNr, bu.Titel, bu.Verlag, bu.Autor, bu.Erschienen_dat, bu.Originalpreis, bu.Waehrung, IF(bu.ausgeliehen_an > 0, 'Verliehen', 'Verfuegbar') AS Stat ";
		$stmt_From = "FROM buecher bu";
		$stmt_Where = " WHERE BuchNr > 0";
	}


	//$stmt_Where = " WHERE BuchNr > 0";//" AND Anrede = '".$_GET["anrede"]."'";
	if(isset($endId)){
		$stmt_Where = $stmt_Where." AND BuchNr <= '".$endId."'";
	}
	if(isset($titel)){
		$stmt_Where = $stmt_Where." AND Titel = '".$titel."'";
	}
	if(isset($autor)){
		$stmt_Where = $stmt_Where." AND Autor = '".$autor."'";
	}
	if(isset($verl)){
		$stmt_Where = $stmt_Where." AND Verlag = '".$verl."'";
	}
	if(isset($waehr)){
		$stmt_Where = $stmt_Where." AND Waehrung = '".$waehr."'";
	}

	//	if(isset($gebStart)){
	//		$stmt_Where = $stmt_Where." AND Vorname = '".$vname."'";
	//	}
	$res_Sel = $connection->query($stmt_Sel.$stmt_From.$stmt_Where);


	// products array
	$products_arr=array();
	$products_arr["records"]=array();

	if($res_Sel->num_rows > 0){
		while($row = $res_Sel->fetch_assoc()){
			// extract row
			// this will make $row['name'] to
			// just $name only
			extract($row);
			//foreach($row as $key => $val){
			//		echo $key." = ".$val." ";
			//}

			$product_item=array();
			if($isOnlyIDs){
				if($onlyIDs==='TRUE'){
					$product_item=array(
							"id" => $BuchNr
					);
				}
			}elseif(isset($ausgelAn)){
				$product_item=array(
						"id" => $BuchNr,
						"titel" => $Titel,
						"autor" => $Autor,
						"verlag" => $Verlag,
						"erschDatum" => $Erschienen_dat,
						"origPreis" => $Originalpreis,
						"waehrung" => $Waehrung,
						"ausgelAn" => $ausgelAn
				);
			}else{
				$product_item=array(
						"id" => $BuchNr,
						"titel" => $Titel,
						"autor" => $Autor,
						"verlag" => $Verlag,
						"erschDatum" => $Erschienen_dat,
						"origPreis" => $Originalpreis,
						"waehrung" => $Waehrung,
						"status" => $Stat
				);
			}


			array_push($products_arr["records"], $product_item);

		}
		return $products_arr;
	}else{
		array_push($products_arr["records"], array(
			"Err_Txt" => "Error: ".$connection->error
		));
		return $products_arr;
	}
}
?>

<?php
				// required headers
			 header("Access-Control-Allow-Origin: http://localhost:3000");
			 header("Content-Type: application/json; charset=UTF-8");
			$servername = "localhost";
			$user = "root";
			$pw = "";
			$db = "bibliothek";

			$con = new mysqli($servername, $user, $pw, $db);

			if(isset($_GET["request"])){
				$req=$_GET["request"];
				if($req=="Select"){
					$products_arr = array();
					$products_arr = doSelect($con, $_GET);

					// set response code - 200 OK
			    http_response_code(200);

			    // show products data in json format
			    echo json_encode($products_arr);
				}elseif ($req=="Lend") {
					if(isset($_GET["newUser"])&&isset($_GET["choBook"])){
						//if($_GET["isLend"]==='TRUE'){
							$products_arr=doLend($con, $_GET);
							// set response code - 200 OK
					    http_response_code(200);
							// show products data in json format
					    echo json_encode($products_arr);
					}else{
							echo "Abort";
						//}
					}
				}elseif ($req=="Insert") {

					if(isset($_GET["titel"])&&isset($_GET["autor"])&&isset($_GET["verl"])&&isset($_GET["erschDatum"])&&isset($_GET["origPr"])&&isset($_GET["waehr"])){
						$products_arr=doInsert($con, $_GET);
						// set response code - 200 OK
				    http_response_code(200);
						// show products data in json format
				    echo json_encode($products_arr);
					}else{
						echo "Missing Data to insert";
					}


			}elseif ($req=="Edit") {

				if(isset($_GET["bid"])&&isset($_GET["titel"])&&isset($_GET["autor"])&&isset($_GET["verl"])&&isset($_GET["erschDatum"])&&isset($_GET["origPr"])&&isset($_GET["waehr"])){
					$products_arr=doEdit($con, $_GET);
					// set response code - 200 OK
					http_response_code(200);
					// show products data in json format
					echo json_encode($products_arr);
				}else{
					echo "Missing Data to insert";
				}
			}

			}else{
				echo "Error: Did not choose kind of Request!";
			}

			$con->close();

		?>
