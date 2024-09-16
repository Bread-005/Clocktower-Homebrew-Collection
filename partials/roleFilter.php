<div class="filter">
    <div>
        <div class="next-to-each-other">
            <div class="center">
                <input id="role-search" type="text" class="padding" placeholder="Search">
                <input id="author-search" type="text" class="padding margin-top-5" placeholder="Author">
                <div class="font-size-18 margin-top-10 space-between">
                    <label for="only-my-ideas">Only my Ideas</label>
                    <input id="only-my-ideas" class="padding" type="checkbox">
                </div>
                <div>
                    <label for="script-filter-selection">Script</label>
                    <select id="script-filter-selection" class="padding">
                        <option value="All">All</option>
                    </select>
                </div>
            </div>
            <div class="center">
                <div class="next-to-each-other">
                    <label for="character-typ-selection" class="margin-left-6">CharacterType</label>
                    <select id="character-typ-selection" class="padding margin-left-2">
                        <option value="All">All</option>
                        <option value="Townsfolk">Townsfolk</option>
                        <option value="Outsider">Outsider</option>
                        <option value="Minion">Minion</option>
                        <option value="Demon">Demon</option>
                        <option value="Traveller">Traveller</option>
                    </select>
                </div>
                <div id="tag-div" class="margin-left-6 margin-top-5">
                    <label for="tag-filter-selection">Tags filter</label>
                    <select id="tag-filter-selection" class="padding">
                        <option value="None">None</option>
                        <option value="Misinformation">Misinformation</option>
                        <option value="Extra Death">Extra Death</option>
                        <option value="Protection">Protection</option>
                        <option value="Wincondition">Wincondition</option>
                        <option value="Character Changing">Character Changing</option>
                        <option value="Setup">Setup</option>
                        <option value="Madness">Madness</option>
                        <option value="Noms Votes Exes">Noms Votes Exes</option>
                        <option value="Does Not Wake">Does Not Wake</option>
                        <option value="ST Consult">ST Consult</option>
                        <option value="When You Die">When You Die</option>
                        <option value="Resurrection">Resurrection</option>
                    </select>
                </div>
                <div class="font-size-18 margin-top-10 space-between">
                    <label for="only-my-favorites">Only my Favorites</label>
                    <input id="only-my-favorites" type="checkbox">
                </div>
                <div class="center">
                    <button id="clear-searches-button">Clear Searches</button>
                </div>
            </div>
        </div>
    </div>
    <div class="font-size-18">
        <label for="sorting">Sorting</label>
        <select id="sorting" class="padding">
            <option value="Alphabet A-Z">Alphabet A-Z</option>
            <option value="Alphabet Z-A">Alphabet Z-A</option>
            <option value="Newest first">Newest first</option>
            <option value="Oldest first">Oldest first</option>
            <option value="Most favorite first">Most favorite first</option>
            <option value="Least favorite first">Least favorite first</option>
        </select>
    </div>
</div>