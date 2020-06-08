This module adds various features to make running a Fate game in Foundry smoother. Requires the Fate system by Nick East.

The tools this module provides are:

* Flexible Condition creation: Right click on a token and click on the injured person icon in the token HUD to bring up a management console from which you can create new conditions to apply to any character. This now works correctly on synthetic actors.
The downside of this is that if you want to create a prototype template character, you need to drag out its token, link the token and actor, set the conditions, then break the link between them. From that point on you can drag out as many copies as you like of the template character and they'll all have the condition.
Physical stress and mental stress are baked in as conditions to allow the use of more than 4 stress boxes, e.g. for single-point stress tracks. The StressViewer icon in the HUD to the left ties into these stress tracks to display them for all tokens in the scene for your convenience.

* Stress and consequences viewer/editor (icon of an injured person): Allows anyone to view, and the GM to edit, stress and consequences for all tokens in the current scene. Uses the stress boxes embedded in the conditions tool.

* Aspect Viewer (Theater masks icon): This lets any user view all aspects for tokens currently in the scene. This is designed with the standard Fate ethos of all aspects being open at all times. I may implement a settings option to turn this feature off for anyone who isn't the GM.

* Fate Point viewer (stack of coins--or fate points--icon): This tool lets the GM manipulate all users' characters' fate points without having to open their sheets. This also keeps track of the GM's fate points for the scene (this is stored in a flag on the GM user, so may behave oddly if there is more than one GM logged in to the game).
