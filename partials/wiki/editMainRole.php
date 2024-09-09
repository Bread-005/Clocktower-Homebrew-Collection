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