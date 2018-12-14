<?php
    //return unique column name for filter
    $dbconn = pg_connect("host=localhost dbname=test user=postgres password=heslo")
                or die('Could not connect: ' . pg_last_error());

    $column = $_GET['column'];
    $table = $_GET['table'];

    $tmp = pg_query($dbconn, "SELECT DISTINCT $column FROM $table");
    $data = pg_fetch_all($tmp);
    
    echo json_encode($data);
?>