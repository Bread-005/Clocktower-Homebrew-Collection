<!doctype html>
<html lang="en">
<head>
    <?php include "partials/htmlHead.php" ?>
    <title>wiki</title>
</head>
<body>

<div>
    <a href="role_idea.php">
        <button class="icon-button" type="submit"><i class="fa-solid fa-square-left"></i></button>
    </a>
</div>

<?php include "partials/wikiPageTop.php" ?>
<?php include "partials/tags.php" ?>

<div class="space-between">
    <div id="image-submission">
        <h2>Change Role Icon</h2>
        <input type="url" id="image-input-url">
        <button id="upload-button">Set Image for Role</button>
    </div>

    <div id="edit-role-field" class="center">
        <form>
            <label for="edit-role-name" class="margin">Rolename</label>
            <input class="input" id="edit-role-name" type="text"/>
            <div class="character-type-dropdown margin">
                <label for="edit-character-type">Charactertype</label>
                <select class="character-types" id="edit-character-type">
                    <option value="Townsfolk">Townsfolk</option>
                    <option value="Outsider">Outsider</option>
                    <option value="Minion">Minion</option>
                    <option value="Demon">Demon</option>
                    <option value="Traveller">Traveller</option>
                </select>
            </div>
            <textarea class="text-area-input margin" id="edit-ability-text" cols="30" rows="4"
                      placeholder="Abilitytext"></textarea>
            <br>
            <button id="submit-edit-role-button" name="click" type="reset">
                Submit Role Change
            </button>
        </form>
    </div>
    <div class="width-290"></div>
</div>

<?php include "partials/nightOrder.php" ?>
<?php include "partials/howToRun.php" ?>

<div class="center margin-top-30">
    <p id="personal-role-rating"></p>
    <p id="average-role-rating"></p>
</div>

<div class="margin-top-30 center">
    <div class="comments">
        <div class="center">
            <textarea id="input-comment" class="text-area-input" cols="40" rows="4"
                      placeholder="write comment"></textarea>
            <div class="comments">
                <button id="add-public-comment-button">add public comment</button>
                <button id="add-private-comment-button">add private Comment</button>
            </div>
        </div>
        <div id="private-comments-checkbox-div" class="center">
            <label for="only-private-comments-checkbox-input">Only private comments</label>
            <input id="only-private-comments-checkbox-input" type="checkbox">
        </div>
    </div>
    <ul id="comments-list">

    </ul>
</div>

<div class="center margin-top-30">
    <button id="download-json-button">Copy Json to clipboard</button>
</div>

<div id="delete-role-div" class="center margin-top-20">
    Delete Role
    <button id="delete-role-button"><i class="fa-solid fa-trash"></i></button>
</div>

<div id="delete-popup-background" class="delete-popup-background center">
    <div class="center delete-confirmation-popup">
        <p>Are you sure you want to delete this role?</p>
        <div class="space-between">
            <button id="delete-confirmation-yes-button">Yes</button>
            <button id="delete-confirmation-cancel-button">Cancel</button>
        </div>
    </div>
</div>

<script src="JavaScript/wiki.js" type="module" defer>

</script>
</body>
</html>