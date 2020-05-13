<?php

function doEdit($connection, $data_arr){
		extract($data_arr);

		$stmt_Ins = "Update benutzer SET Anrede='".$anrede.
		"', Nachname='".$nname.
		"', Vorname='".$vname.
		"', Geburtsdatum= '".$gebDatum.
		"' WHERE BenutzerNr = ".$uid.";";

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
Beispiel-Abfrage: http://localhost/bibVerw/users.php?request=Insert&anrede=Herr&vname=Anton&nname=Guenther&gebDatum=1981-12-17
*/
function doInsert($connection, $data_arr){
		extract($data_arr);

		$stmt_Ins = "INSERT INTO benutzer (Anrede, Nachname, Vorname, Geburtsdatum) VALUES('".
			$anrede."', '".
			$nname."','".
			$vname."', '".
			$gebDatum."')";

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

function doSelect($connection, $data_arr){
	extract($data_arr);
	$stmt_Sel = "";

	$isOnlyIDs = isset($onlyIDs);

	if($isOnlyIDs){
		$stmt_Sel = "SELECT BenutzerNr FROM benutzer";
	}else{
		$stmt_Sel = "SELECT * FROM benutzer";
	}
	
	$stmt_Where = " WHERE BenutzerNr > 0";//" AND Anrede = '".$_GET["anrede"]."'";
	if(isset($endId)){
		$stmt_Where = $stmt_Where." AND BenutzerNr <= '".$endId."'";
	}
	if(isset($anrede)){
		$stmt_Where = $stmt_Where." AND Anrede = '".$anrede."'";
	}
	if(isset($nname)){
		$stmt_Where = $stmt_Where." AND Nachname = '".$nname."'";
	}
	if(isset($vname)){
		$stmt_Where = $stmt_Where." AND Vorname = '".$vname."'";
	}
//	if(isset($gebStart)){
//		$stmt_Where = $stmt_Where." AND Vorname = '".$vname."'";
//	}
	$res_Sel = $connection->query($stmt_Sel.$stmt_Where);


	// products array
	$products_arr=array();
	$products_arr["records"]=array();

	if($res_Sel->num_rows > 0){
		while($row = $res_Sel->fetch_assoc()){
			// extract row
			// this will make $row['name'] to
			// just $name only
			extract($row);
			$product_item = array();

			if($isOnlyIDs){
				if($onlyIDs==='TRUE'){
					$product_item=array(
							"id" => $BenutzerNr
						);
				}
			}else{
				$product_item=array(
						"id" => $BenutzerNr,
						"anrede" => $Anrede,
						"vorname" => $Vorname,
						"nachname" => $Nachname,
						"gebDatum" => $Geburtsdatum
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
				header("Access-Control-Allow-Origin:  http://localhost:3000");
			header("Content-Type: application/json; charset=UTF-8");

			$servername = "localhost";
			$user = "root";
			$pw = "";
			$db = "bibliothek";

			$con = new mysqli($servername, $user, $pw, $db);



			if(isset($_GET["request"])){
				$req=$_GET["request"];
				$products_arr = array();

				if($req=="Select"){
					if($products_arr = doSelect($con, $_GET)){
						// set response code - 200 OK
				    http_response_code(200);
					}else{

						http_response_code(100);
						//$products_arr = {records: [{id:0, nachname:"Error: No data loaded", vorname:"", gebDatum:""}]}
					}

			    // show products data in json format
			    echo json_encode($products_arr);
				}elseif ($req=="Insert") {
					if(isset($_GET["anrede"])&&isset($_GET["vname"])&&isset($_GET["nname"])&&isset($_GET["gebDatum"])){
						$products_arr=doInsert($con, $_GET);
							// set response code - 200 OK
					    http_response_code(200);
						// show products data in json format
						echo json_encode($products_arr);
					}else{
						echo "Missing Data to insert";
					}

				}elseif ($req=="Edit") {
					if(isset($_GET["uid"])&&isset($_GET["anrede"])&&isset($_GET["vname"])&&isset($_GET["nname"])&&isset($_GET["gebDatum"])){
						$products_arr=doEdit($con, $_GET);
						// set response code - 200 OK
						http_response_code(200);
						// show products data in json format
						echo json_encode($products_arr);
					}else{
						echo "Missing Data to edit";
					}
				}

			}else{
				echo "Error: Did not choose kind of Request!";
			}

			$con->close();

		?>
