<?php
include 'dbconnect.php';

if($_SERVER["REQUEST_METHOD"]=="POST"){
    $username = trim($_POST['name']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];


    $check = $conn ->prepare("SELECT id FROM user WHERE email, ?");
    $check ->bind_param("s" $email);
    $check ->execute();
    $check ->store_result();

    if($check->num_rows > 0){
    echo "Email already exist. Use different email.";
    }else{
    $sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?,) ";
    $stmt = $conn->prepare($sql);
    $stmt ->bind_param("sss", $username, $email, $password );
    if($stmt -> execute()){
        echo "Account created successfully";
    }else{
        echo "Something went wrong"
    }
    $stmt->close();
    }
    $check->close();  
}
?>

