This module adds various features to make running a Fate game in Foundry smoother. Requires the Fate system by Nick East.

The tools this module provides are:

* Flexible Condition creation: You can create an Extra with the word 'condition' in it and with _number at the end and this will be changed into number editable checkboxes and a text area for notes, all of which are stored with the character sheet. e.g Condition: Indebted_5 or Physical Stress (Condition)_3.

The number of boxes on a condition can be updated at any time by adding _n to the end of the name of the condition, where n is the number of boxes required. This will overwrite all data currently stored in the condition.

* Stress and consequences viewer/editor (icon of an injured person): Allows anyone to view, and the GM to edit, stress and consequences for all tokens in the current scene. To allow this to work with Condensed style stress boxes and, indeed, any other number or style of stress boxes, the Stress Viewer does NOT display the stress on character sheets. Instead it uses stress stored in Extras. To be picked up as stress, a character must have an extra with the words "condition, physical, stress" in its title in any order for physical stress and another extra with the words "condition, mental, stress" in its title in any order. These must have had stress boxes added to them using the above Flexible Condition Creation tool (e.g. by naming a condition "Condition: Physical Stress_3" to create a 3-stress condition). NOTE: When you edit a consequence, it will save the changes and update the underlying character sheet when you click out of the consequence field or close the Stress Viewer window.

As a convenience factor, you might like to create a standard pair of 3-box conditions and save them in your Items to easily drag them to new characters. 


* Aspect Viewer (Theater masks icon): This lets any user view all aspects for tokens currently in the scene.

* Fate Point viewer (stack of coins--or fate points--icon): This tool lets the GM manipulate all users' characters' fate points without having to open their sheets. This also keeps track of the GM's fate points for the scene (this is stored in a flag on the GM user, so may behave oddly if there is more than one GM logged in to the game).
