<!doctype html>
<html lang="en">
<head>
    <?php include "partials/htmlHead.php" ?>
    <title>wiki</title>
</head>
<body>

<div class="space-between">
    <a href="role_idea.php">
        <button class="icon-button" type="submit"><i class="fa-solid fa-square-left"></i></button>
    </a>
    <p id="username-display-wiki-page">Your Username: </p>
</div>

<?php include "partials/wiki/pageTop.php" ?>

<div class="space-between">
    <div id="image-submission">
        <h2>Change Role Icon</h2>
        <input type="url" id="image-input-url">
        <button id="upload-button">Set Image for Role</button>
    </div>

    <div class="width-290"></div>
    <div class="width-290"></div>
</div>

<?php include "partials/wiki/tags.php" ?>
<?php include "partials/wiki/nightOrder.php" ?>
<?php include "partials/wiki/howToRun.php" ?>
<?php include "partials/wiki/jinxes.php" ?>
<?php include "partials/wiki/reminderToken.php" ?>
<?php include "partials/wiki/special.php" ?>
<?php include "partials/wiki/rating.php" ?>
<?php include "partials/wiki/comments.php" ?>
<?php include "partials/wiki/downloadJson.php" ?>
<?php include "partials/wiki/deleteRole.php" ?>

<script src="JavaScript/wiki.js" type="module" defer>

</script>
</body>
</html>