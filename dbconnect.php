<?php
$host = "localhost";
$username = "root"; // Default user
$password = ""; // Default password is empty
$database = "dflower-shop"; //Name of your database

// Create connection
$conn = mysqli_connect($host, $username, $password, $database);

// Check connection
if ($conn) {
    echo "Connected successfully!";
}else{
    echo "Not Connected Properly";
}