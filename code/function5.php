<?php
    //return bike line
    $dbconn = pg_connect("host=localhost dbname=test user=postgres password=heslo")
                or die('Could not connect: ' . pg_last_error());

   /*  $column = $_GET['column'];
    $table = $_GET['table']; */

    $query = "SELECT jsonb_build_object('type','FeatureCollection','features', jsonb_agg(features.feature))FROM (SELECT jsonb_build_object('type','Feature','geometry',ST_AsGeoJSON(ST_Transform(wkb_geometry, 4326))) AS feature FROM (SELECT * FROM chapel_hill_bike_map_lines) inputs) features;";
    $tmp = pg_query($dbconn, $query);
    $tmp = pg_fetch_row($tmp);
    $tmp = preg_replace('/\\\\/', '', $tmp);
    $tmp = str_replace('"{', '{', $tmp);
    $data = str_replace('"}', '}', $tmp);

    echo json_encode($data[0]);
?>