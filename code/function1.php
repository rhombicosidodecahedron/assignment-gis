<?php
    //return basic data of traffic crash
    $dbconn = pg_connect("host=localhost dbname=test user=postgres password=heslo")
                or die('Could not connect: ' . pg_last_error());

    //$table = $_GET['table'];
    $where = $_GET['where'];
    $tmp = pg_query($dbconn, "SELECT jsonb_build_object('type','FeatureCollection','features', jsonb_agg(features.feature))FROM (SELECT jsonb_build_object('type','Feature','geometry',ST_AsGeoJSON(ST_Transform(wkb_geometry, 4326))) AS feature FROM (SELECT * FROM crash_data_chapel_hill_region $where) inputs) features;");
    $tmp = pg_fetch_row($tmp);
    $tmp = preg_replace('/\\\\/', '', $tmp);
    $tmp = str_replace('"{', '{', $tmp);
    $data = str_replace('"}', '}', $tmp);

    echo json_encode($data[0]);
?>