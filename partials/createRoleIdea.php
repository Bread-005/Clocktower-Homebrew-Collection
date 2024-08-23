<div class="center margin-top-20">
    Write your homebrew role here
    <form class="flex-start">
        <div>
            <label class="margin" for="role-name">Rolename</label>
            <input class="input" id="role-name" type="text"/>
        </div>
        <div class="margin">
            <label for="character-types">Charactertype</label>
            <select class="character-types" id="character-types">
                <option value="Townsfolk">Townsfolk</option>
                <option value="Outsider">Outsider</option>
                <option value="Minion">Minion</option>
                <option value="Demon">Demon</option>
                <option value="Traveller">Traveller</option>
            </select>
        </div>
        <textarea class="text-area-input margin" id="ability-text" cols="30" rows="4"
                  placeholder="Abilitytext"></textarea>
        <button id="js-add-role" name="click" type="reset">
            Submit Role
        </button>
    </form>
    <h2>Role Ideas</h2>
</div>