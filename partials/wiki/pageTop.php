<div class="page-top">
    <img src="https://i.postimg.cc/qM09f8cD/placeholder-icon.png" id="wiki-role-image"
         class="clocktower-icon margin-top-20"/>
    <div class="padding-20">
        <div id="main-role-display" class="center padding-50">
            <h1 id="role-name"></h1>
            <h2 id="character-type"></h2>
            <h2 id="ability-text"></h2>
            <h3 id="credits-text"></h3>
        </div>
        <div id="edit-role-field" class="center margin-top-30">
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
                <textarea class="text-area-input margin" id="edit-ability-text" cols="40" rows="5"
                          placeholder="Abilitytext"></textarea>
                <br>
                <button id="submit-edit-role-button" name="click" type="reset">
                    Submit Role Change
                </button>
            </form>
        </div>
    </div>
    <div class="edit-button-container">
        <button id="edit-button" class="margin-left-30"><i class="fa-solid fa-pen fa-pen-to-square"></i></button>
    </div>
</div>