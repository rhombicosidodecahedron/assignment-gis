<?php
    //return bike lines with accident number
    $dbconn = pg_connect("host=localhost dbname=test user=postgres password=heslo")
                or die('Could not connect: ' . pg_last_error());

    $query = "SELECT jsonb_build_object('type','FeatureCollection','features', jsonb_agg(features.feature)) FROM ( SELECT jsonb_build_object('type','Feature','geometry',ST_AsGeoJSON(ST_Transform(wkb_geometry, 4326)), 'properties', to_jsonb(inputs) - 'id' - 'age' - 'lat' - 'lng' - 'name' - 'kmlid' - 'source' - 'sub_id' - 'survey' - 'target' - 'created' - 'kmlname' - 'comments' - 'layer_id' - 'feature_id' - 'gender_male' - 'kmlstyleurl' - 'feature_type' - 'feature_type' - 'wkb_geometry' - 'geo_point_2d') AS feature FROM (SELECT * FROM chapel_hill_bike_map_lines LIMIT 123) inputs) features;";
    $tmp = pg_query($dbconn, $query);
    $tmp = pg_fetch_row($tmp);
    $tmp = preg_replace('/\\\\/', '', $tmp);
    $tmp = str_replace('"{', '{', $tmp);
    $data = str_replace('"}', '}', $tmp);

    echo $data[0];
?>