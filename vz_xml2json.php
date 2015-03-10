<?php

$directory = "data";

$xmlFilename = $directory . "/" . "pb_dod_fak.xml";
$jsonFilename = $directory . "/" . "pb_dod_fak.json";
$arrayFilename = "pb_dod_fak.txt";

$xmlFile = file_get_contents($xmlFilename);
$xmlFile = str_replace(array("\n", "\r", "\t"), '', $xmlFile);
$xmlFile = trim(str_replace('"', "'", $xmlFile));

$simpleXml = simplexml_load_string($xmlFile);

$json = json_encode($simpleXml);

$suppliers = array();
$counts = array();
$priceSums = array();
$data = array();

foreach ($simpleXml->rs->data->row as $key => $value) {
	$existingSupplierKey = array_search((string) $value['col_1'], $suppliers);

	$invoice = array('id' => (int) $value['col_0'], 'price' => parsePrice((string) $value['col_3']), 'currency' => (string) $value['col_4'], 'note' => (string) $value['col_2'], 'date_signed' => (string) $value['col_5'], 'date_published' => (string) $value['col_6']);

	if($existingSupplierKey == false){
		$counts[] = 1;
		$priceSums[] = $invoice['price'];
		$suppliers[] = (string) $value['col_1'];

		$data[] = array('supplier' => (string) $value['col_1'], 'count' => 1, 'price_sum' => array('amount' => $invoice['price'], 'currency' => $invoice['currency']), 'invoice' => array($invoice));

	}
	else {
		++$data[$existingSupplierKey]['count'];
		++$counts[$existingSupplierKey];

		$priceSums[$existingSupplierKey] = $priceSums[$existingSupplierKey] + $invoice['price'];

		$data[$existingSupplierKey]['invoice'][] = $invoice;
		$data[$existingSupplierKey]['price_sum']['amount'] = $priceSums[$existingSupplierKey];
	}

	echo(".");
}


array_multisort($priceSums, SORT_DESC, $counts, SORT_DESC, $data);

$json = json_encode($data);

@unlink($jsonFilename);
file_put_contents($jsonFilename, $json);

@unlink($arrayFilename);
file_put_contents($arrayFilename, print_r($data, true));

function parsePrice($price){
	$price = str_replace(' ', '', $price);
	$price = str_replace(',', '.', $price);
	$price = trim($price);

	return(floor($price));
}

?>
