<?php

  $fName = $lName = $email = $subject = $role = $message = "";
  
  if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if(!empty($_POST['website'])) { 
      die();
    }

    if (empty($_POST["fname"])) {
        $fNameErr = "First name required";
        echo $fNameErr;
        return;
      } else {
        $fName = htmlspecialchars(stripslashes(trim($_POST['fname'])));
      }

    if (empty($_POST["lname"])) {
        $lNameErr = "Last name required";
        echo $lNameErr;
        return;
      } else {
        $lName = htmlspecialchars(stripslashes(trim($_POST['lname'])));
      }

    if (empty($_POST["roleSelect"])) {
        $roleErr = "Role required";
        echo $roleErr;
        return;
      } else {
        $role = htmlspecialchars(stripslashes(trim($_POST['roleSelect'])));
      }

    if (empty($_POST["subject"])) {
        $subjectErr = "Subject required";
        echo $subjectErr;
        return;
      } else {
        $subject = htmlspecialchars(stripslashes(trim($_POST['subject'])));
      }

    if (empty($_POST["email"])) {
        $emailErr = "Email required";
        echo $emailErr;
        return;
      } else {
        $email = htmlspecialchars(stripslashes(trim($_POST['email'])));
      }

    if (empty($_POST["message"])) {
        $messageErr = "Message required";
        echo $emailErr;
        return;
      } else {
        $message = htmlspecialchars(stripslashes(trim($_POST['message'])));
      } 
    
        if(!preg_match("/^[A-Za-z .'-]+$/", $fName)){
          $fNameErr = 'Invalid name';
          echo $fNameErr;
          return;
        }

        if(!preg_match("/^[A-Za-z .'-]+$/", $lName)){
          $lNameErr = 'Invalid name';
          echo $lNameErr;
          return;
        }

        if(preg_match("/\b(?:(?:https?|ftp|http):\/\/|www\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/i", $subject)){
          $subjectErr = 'Invalid subject';
          echo $subjectErr;
          return;
        }


        if(!preg_match("/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/", $email)){
          $emailErr = 'Invalid email';
          echo $emailErr;
          return;
        }

        if(strlen($message) === 0){
          $messageErr = 'Your message should not be empty';
          echo $messageErr;
          return;
        }

      
        if(!isset($fNameErr) && !isset($lNameErr) && !isset($emailErr) && !isset($subjectErr) && !isset($messageErr) && !isset($roleErr)){
          $to = 'neuroxr@iupui.edu'; 
          $body = " Name: $fName $lName\n E-mail: $email\n Role: $role\n Message:\n $message";
          if(mail($to, $subject, $body)){
            echo 'sent';
            mail($email, "Thank you for your message", "Thank you for messaging NeuroXR! We have recieved your inquiry and will respond as soon as possible.");
            return;
          }else{
            echo 'Error Occured, please check all fields follow requirements and try again';
            return;
          }
    } else {
      echo "Error Occured, please check all fields follow requirements and try again";
      return;
    }
  }
?>
