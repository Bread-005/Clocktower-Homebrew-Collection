<div id="special-div" class="center">
    <h2>Special</h2>
    <div id="special-edit-div" class="center">
        <div class="center">
            Required
            <div>
                <label for="special-type-selection">Type: </label>
                <select id="special-type-selection">
                    <option value="selection">Selection</option>
                    <option value="ability">Ability</option>
                    <option value="signal">Signal</option>
                    <option value="vote">Vote</option>
                    <option value="reveal">Reveal</option>
                </select>
                <label for="special-name-selection">Name: </label>
                <select id="special-name-selection">
                    <option value="grimoire">Grimoire</option>
                    <option value="pointing">Pointing</option>
                    <option value="ghost-votes">Ghost Votes</option>
                    <option value="distribute-roles">Distribute Roles</option>
                    <option value="bag-disabled">Bag Disabled</option>
                    <option value="bag-duplication">Bag Duplication</option>
                    <option value="multiplier">Multiplier</option>
                    <option value="hidden">Hidden</option>
                    <option value="replace-character">Replace Character</option>
                    <option value="player">Player</option>
                    <option value="card">Card</option>
                </select>
            </div>
            <div class="margin-top-10">
                <div class="center">Optional</div>
                <div class="next-to-each-other">
                    <div>
                        <label for="special-value-input">Value: </label>
                        <input id="special-value-input">
                    </div>
                    <div class="margin-left-6">
                        <label for="special-time-selection">Time: </label>
                        <select id="special-time-selection">
                            <option value="none">None</option>
                            <option value="pregame">Pregame</option>
                            <option value="day">Day</option>
                            <option value="night">Night</option>
                            <option value="firstnight">First Night</option>
                            <option value="firstday">First Day</option>
                            <option value="othernight">Other Night</option>
                            <option value="otherday">Other Day</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <button id="special-add-button">Add Special</button>
    </div>
    <ul id="special-display"></ul>
</div>