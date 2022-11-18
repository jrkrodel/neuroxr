<?php

  $fName = $lName = $email = $subject = $role = $message = "";
  
  if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if(!empty($_POST['website'])) { 
      die();
    }

    if (empty($_POST["fname"])) {
        $fNameErr = "fname";
        echo $fNameErr;
        return;
      } else {
        $fName = htmlspecialchars(stripslashes(trim($_POST['fname'])));
      }

    if (empty($_POST["lname"])) {
        $lNameErr = "lname";
        echo $lNameErr;
        return;
      } else {
        $lName = htmlspecialchars(stripslashes(trim($_POST['lname'])));
      }

    if (empty($_POST["roleSelect"])) {
        $roleErr = "Role error";
        echo $roleErr;
        return;
      } else {
        $role = htmlspecialchars(stripslashes(trim($_POST['roleSelect'])));
      }

    if (empty($_POST["subject"])) {
        $subjectErr = "subject";
        echo $subjectErr;
        return;
      } else {
        $subject = htmlspecialchars(stripslashes(trim($_POST['subject'])));
      }

    if (empty($_POST["email"])) {
        $emailErr = "email";
        echo $emailErr;
        return;
      } else {
        $email = htmlspecialchars(stripslashes(trim($_POST['email'])));
      }

    if (empty($_POST["message"])) {
        $messageErr = "Message error";
        echo $emailErr;
        return;
      } else {
        $message = htmlspecialchars(stripslashes(trim($_POST['message'])));
      } 
    
        if(!preg_match("/^[A-Za-z .'-]+$/", $fName)){
          $fNameErr= 'Invalid name';
          return;
        }

        if(!preg_match("/^[A-Za-z .'-]+$/", $lName)){
          $lNameErr = 'Invalid name';
          return;
        }

        if(!preg_match("/^[A-Za-z .'-]+$/", $subject)){
          $subjectErr = 'Invalid subject';
          return;
        }

        if(!preg_match("/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/", $email)){
          $emailErr = 'Invalid email';
          return;
        }

        if(strlen($message) === 0){
          $messageErr = 'Your message should not be empty';
          return;
        }

        if(preg_match('/http|www/i',$message)) {
          $messageErr = "We do not allow a url in the comment";
          echo $messageErr;
          return;
        }
      
        if(!isset($fNameErr) && !isset($lNameErr) && !isset($emailErr) && !isset($subjectErr) && !isset($messageErr) && !isset($roleErr)){
          $to = 'jrkrodel@iu.edu'; 
          $body = " Name: $fName $lName\n E-mail: $email\n Role: $role\n Message:\n $message";
          if(mail($to, $subject, $body)){
            echo 'sent';
            return;
          }else{
            echo 'Error Here';
            return;
          }
    } else {
      echo "Error There";
      return;
    }
  }
?>
