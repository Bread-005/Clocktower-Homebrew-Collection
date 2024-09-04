<div class="filter">
    <div>
        <div>
            <div class="next-to-each-other">
                <input id="role-search" type="text" class="padding" placeholder="Search">
                <label for="character-typ-selection" class="margin-left-6">CharacterType</label>
                <select id="character-typ-selection" class="padding margin-left-2">
                    <option value="All">All</option>
                    <option value="Townsfolk">Townsfolk</option>
                    <option value="Outsider">Outsider</option>
                    <option value="Minion">Minion</option>
                    <option value="Demon">Demon</option>
                    <option value="Traveller">Traveller</option>
                </select>
                <div id="tag-div" class="center">
                    <div>
                        <label for="tag-checkbox" class="margin-left-6">Tags</label>
                        <input id="tag-checkbox" type="checkbox">
                    </div>
                    <div id="tag-checkboxes" class="center">
                        <div>
                            <label for="misinformation-checkbox">Misinformation</label>
                            <input id="misinformation-checkbox" type="checkbox" class="tag-filter-checkbox"
                                   name="Misinformation">
                        </div>
                        <div>
                            <label for="extra-deaths-checkbox">Extra Deaths</label>
                            <input id="extra-deaths-checkbox" type="checkbox" class="tag-filter-checkbox"
                                   name="Extra Deaths">
                        </div>
                        <div>
                            <label for="protection-checkbox">Protection</label>
                            <input id="protection-checkbox" type="checkbox" class="tag-filter-checkbox"
                                   name="Protection">
                        </div>
                        <div>
                            <label for="wincondition-checkbox">Wincondition</label>
                            <input id="wincondition-checkbox" type="checkbox" class="tag-filter-checkbox"
                                   name="Wincondition">
                        </div>
                        <div>
                            <label for="character-changing-checkbox">Character Changing</label>
                            <input id="character-changing-checkbox" type="checkbox" class="tag-filter-checkbox"
                                   name="Character Changing">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="margin-top-5">
            <input id="author-search" type="text" class="padding" placeholder="Author">
        </div>
        <div class="font-size-18 margin-top-10 space-between">
            <div>
                Only my Ideas
                <input id="only-my-ideas" class="padding" type="checkbox">
            </div>
            <div>
                Only my Favorites
                <input id="only-my-favorites" type="checkbox">
            </div>
        </div>
    </div>
    <div>
        Sorting
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