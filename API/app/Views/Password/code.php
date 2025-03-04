<!doctype html>
<html lang="fr">
<head>
    <title>Changement de mot de passe 1/3</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<link rel="shortcut icon" type="image/png" href="<?= base_url() ?>/favicon.png"/>


    <!-- Latest compiled and minified CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous" />

    <!-- Bootstrap icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css" />
    <link rel="stylesheet" href="<?= base_url() ?>/assets/css/password.css" />
</head>
<body>

<?php
if(!isset($passwordToken)){
    // Force wrong password token
    $passwordToken = "";
}
$fields_info = array('passwordToken' => $passwordToken);
echo form_open_multipart(base_url('/Password/reset'), 'class="form-horizontal"', $fields_info);
?>

<div class="container my-5">
    <div class="p-5 text-center bg-body-tertiary rounded-3 card">
        <i class="bi bi-shield-exclamation" style="font-size: 64px"></i>
        <h1 class="text-body-emphasis">Changement de mot de passe</h1>
        <p class="col-lg-8 mx-auto fs-5 text-muted">
            Etape 1 sur 3
        </p>
        <div class="col-8 mx-auto fs-5">
            <div class="progress-line-wrapper">
                <div class="progress-line">
                    <div class="progress-content step-1"></div>
                    <div class="part current item-1"><i class="bi bi-fingerprint"></i></div>
                    <div class="part item-2"><i class="bi bi-key"></i></div>
                    <div class="part item-3"><i class="bi bi-shield-check"></i></div>
                </div>
            </div>
        </div>
<?php
if(isset($error)){
	echo '<div class="callout-error">' . $error . '</div>';
}
?>
		<p>
			Veuillez saisir le code qui a été généré lors de la demande de changement de mot de passe
		</p>
        <div class="d-flex justify-content-center">
			<input class="form-control font-monospace" type="text" name="code" 
				style="width: auto; font-size:3em;"
				aria-describedby="codeHelp" id="code" value="" size="3" maxlength="3">
		</div>
		<span id="codeHelp" class="form-text">
			Attention aux majuscules / minuscules
		</span>

        <div class="d-flex justify-content-center mt-5">
			<button type="submit" class="btn btn-primary"><?= lang('App.form.button.apply') ?></button>
		</div>

    </div>
</div> <!-- .container -->
			

<?php
echo form_close('');
?>

</body>
</html>