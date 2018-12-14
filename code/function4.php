<?php
    //return crash near to traffic light
    $dbconn = pg_connect("host=localhost dbname=test user=postgres password=heslo")
                or die('Could not connect: ' . pg_last_error());

   /*  $column = $_GET['column'];
    $table = $_GET['table']; */

    $query = "WITH RECURSIVE t(n, geom) AS (";
    $query .= "SELECT 1, (SELECT ST_Buffer(CAST(ST_SetSRID(wkb_geometry, 4326) AS geography), 40, 'quad_segs=2') FROM traffic_signals_in_chapel_hill WHERE ogc_fid = 1)";
    $query .= " UNION ALL ";
    $query .= "SELECT n+1, (SELECT ST_Buffer(CAST(ST_SetSRID(wkb_geometry, 4326) AS geography), 40, 'quad_segs=2') FROM traffic_signals_in_chapel_hill WHERE ogc_fid = n+1 AND n < (SELECT COUNT(ogc_fid) FROM traffic_signals_in_chapel_hill)) FROM t";
    $query .= ")";
    $query .= "SELECT jsonb_build_object('type','FeatureCollection','features', jsonb_agg(features.feature))FROM (SELECT jsonb_build_object('type','Feature','geometry',ST_AsGeoJSON(ST_Transform(wkb_geometry, 4326))) AS feature FROM ((SELECT * FROM t LIMIT 122) as pol JOIN crash_data_chapel_hill_region bc ON ST_Within(bc.wkb_geometry, CAST(pol.geom AS geometry))) inputs) features;";
    $tmp = pg_query($dbconn, $query);
    $tmp = pg_fetch_row($tmp);
    $tmp = preg_replace('/\\\\/', '', $tmp);
    $tmp = str_replace('"{', '{', $tmp);
    $data = str_replace('"}', '}', $tmp);

    echo json_encode($data[0]);
?>